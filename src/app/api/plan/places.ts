import { Coordinates } from "@/types";
import axios from "axios";

export interface NearbyPlacesResponse {
  html_attributions: any[];
  next_page_token: string;
  results: Place[];
  status: string;
}

export interface Place {
  geometry: Geometry;
  icon: string;
  icon_background_color: string;
  icon_mask_base_uri: string;
  name: string;
  photos: Photo[];
  place_id: string;
  reference: string;
  scope: string;
  types: string[];
  vicinity: string;
  business_status?: string;
  opening_hours?: OpeningHours;
  plus_code?: PlusCode;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
}

export interface Geometry {
  location: Location;
  viewport: Viewport;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Viewport {
  northeast: Northeast;
  southwest: Southwest;
}

export interface Northeast {
  lat: number;
  lng: number;
}

export interface Southwest {
  lat: number;
  lng: number;
}

export interface Photo {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
  url?: string;
}

export interface OpeningHours {
  open_now: boolean;
}

export interface PlusCode {
  compound_code: string;
  global_code: string;
}

export type ItineraryDay = {
  date: string;
  placesToVisit: string[];
};

// Function to calculate travel time in hours based on transport mode (flight or train/bus)
export function calculateTravelTimeInHours(
  homeAddress: Coordinates,
  destinationAddress: Coordinates
): {
  travelTimeInHours: number;
  transportMode: "flight" | "train/bus";
} {
  const distanceInKm = calculateDistanceInKm(homeAddress, destinationAddress);
  const transportMode = distanceInKm > 600 ? "flight" : "train/bus";
  const travelTimeInHours =
    transportMode === "flight" ? distanceInKm / 800 : distanceInKm / 60;
  return { travelTimeInHours, transportMode };
}

const defaultVisitTime = 2;

// Function to formulate itinerary for a single day
function formulateItineraryDay(
  places: Place[],
  travelTimeLimit: number,
  visitTime: number
): ItineraryDay | null {
  const selectedPlaces: Place[] = [];
  let totalTravelTime = 0;
  let remainingTime = travelTimeLimit; // Track remaining time for sightseeing

  for (const place of places) {
    const prevPlace = selectedPlaces[selectedPlaces.length - 1];
    const travelTime = prevPlace
      ? calculateTravelTimeInHours(
          getCoordinates(prevPlace),
          getCoordinates(place)
        ).travelTimeInHours
      : 1; // make 1 hour to travel from hotel

    // Prioritize places that fit within remaining travel and sightseeing time
    if (travelTime + visitTime <= remainingTime) {
      // Add place visit time here
      selectedPlaces.push(place);
      totalTravelTime = totalTravelTime + travelTime;
      remainingTime = remainingTime - (travelTime + visitTime); // Deduct travel and visit time
    } else {
      break; // Stop adding places if exceeding time limit
    }
  }

  if (selectedPlaces.length > 0) {
    return { date: "", placesToVisit: selectedPlaces.map((i) => i.name) };
  }
  return null;
}

export function generateTourPlanTitle(duration: number): string {
  const adjectives = [
    "Mesmerizing",
    "Enthralling",
    "Unforgettable",
    "Breathtaking",
    "Exhilarating",
    "Adventurous",
    "Relaxing",
    "Cultural",
    "Panoramic",
    "Serene",
    "Majestic",
    "Historical",
  ];

  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  return `${randomAdjective} ${duration}-Day Tour`;
}

export function findPlaceWithPhotos(places: Place[]): Place | null {
  const placesWithPhotos = places.filter((place) => place.photos?.length >= 1); // Filter places with photos
  if (placesWithPhotos.length > 0) {
    const randomIndex = Math.floor(Math.random() * placesWithPhotos.length);
    return placesWithPhotos[randomIndex];
  } else {
    return null;
  }
}

function getVisitTimeBasedOnDays(daysCount: number): number {
  if (daysCount > 30) return 8;
  if (daysCount > 20) return 6;
  if (daysCount > 15) return 4;
  if (daysCount > 10) return 3;
  if (daysCount > 5) return 2;
  if (daysCount > 2) return 1;
  return defaultVisitTime;
}

export function findDaysBetweenDates(from: Date, to: Date): number {
  const diffInMilliseconds = Math.abs(to.getTime() - from.getTime());
  const days = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
  return days;
}

// Function to formulate full itinerary for a vacation plan
export function formulateItinerary(
  sightSeeingDays: string[],
  places: Place[]
): ItineraryDay[] {
  const itinerary: ItineraryDay[] = [];
  const travelTimeLimit = 8; // Adjust travel time limit per day (in hours)

  let remainingPlaces = places.slice(); // Copy of all places

  for (const date of sightSeeingDays) {
    const dayItinerary = formulateItineraryDay(
      remainingPlaces,
      travelTimeLimit,
      getVisitTimeBasedOnDays(sightSeeingDays.length)
    );
    if (dayItinerary) {
      dayItinerary.date = date;
      itinerary.push(dayItinerary);
      // Remove visited places from remaining list
      remainingPlaces = remainingPlaces.filter(
        (place) => !dayItinerary.placesToVisit.find((i) => i === place.name)
      );
    }
  }

  return itinerary;
}

export function calculateDistanceInKm(
  homeAddress: Coordinates,
  destinationAddress: Coordinates
): number {
  const earthRadiusKm = 6371;
  const [lat1, lon1] = homeAddress.map((i) => Number(i));
  const [lat2, lon2] = destinationAddress.map((i) => Number(i));

  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function getCoordinates(place: Place): Coordinates {
  if (!place.geometry || !place.geometry.location) {
    throw new Error("Place has no geometry");
  }
  return Object.values(place.geometry.location).map((place) => String(place));
}

export async function getNearbyPlacesPhoto(
  photoreference: string,
  maxheight = 1000,
  maxwidth = 1600
): Promise<string> {
  try {
    const params = `photoreference=${photoreference}&maxheight=${maxheight}&maxwidth=${maxwidth}&key=${process.env.GOOGLE_MAPS_API}`;
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/photo?${params}`
    );
    const url = response.request
      ? `${response.request.host}/${response.request.path}`
      : "";
    return url;
  } catch (error) {
    console.error("Error fetching nearby places:", error);
    return "";
  }
}
async function getPhotosForPlaces(results: Place[]): Promise<Place[]> {
  await results.forEach(async (result: any) => {
    if (result.photos && result.photos.length) {
      result.photos[0].url = await getNearbyPlacesPhoto(
        result.photos[0].photo_reference,
        result.photos[0].height,
        result.photos[0].width
      );
    }
  });
  return results;
}

export async function getNearbyPlaces(
  location = "-33.8670522,151.1957362",
  radius = 1500,
  placeType = "tourist_attraction"
): Promise<Place[]> {
  try {
    const params = `location=${location}&radius=${radius}&type=${placeType}&key=${process.env.GOOGLE_MAPS_API}`;
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params}`
    );
    const nearbyPlacesResponse = response.data as NearbyPlacesResponse;
    // await getPhotosForPlaces(nearbyPlacesResponse.results);

    return nearbyPlacesResponse.results;
  } catch (error) {
    console.error("Error fetching nearby places:", error);
    return [];
  }
}
