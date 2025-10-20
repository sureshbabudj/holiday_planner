"use server";

import { PlaceDetails, PlaceDetailsError } from "@/types";

const GOOGLE_MAPS_API = process.env.GOOGLE_MAPS_API!;

// The core logic for handling the API request
export default async function getGooglePlaceDetails(
  placeId: string
): Promise<PlaceDetails | PlaceDetailsError> {
  try {
    // 1. Call Google Places Details API
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total,photo,name,vicinity&key=${GOOGLE_MAPS_API}`;

    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    if (detailsData.status !== "OK" || !detailsData.result) {
      console.error(
        "Places API Error:",
        detailsData.status,
        detailsData.error_message
      );
      return { error: { message: "Place details not found or API error." } };
    }

    const placeResult = detailsData.result;
    const photoReference = placeResult.photos?.[0]?.photo_reference;

    let imageUrl = null;

    // 2. Call Google Places Photos API (if a photo reference exists)
    if (photoReference) {
      // NOTE: We generate the URL here.
      imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_MAPS_API}`;
    }

    // 3. Return the SAFE, filtered data back to the client
    return {
      imageUrl: imageUrl,
      rating: placeResult.rating || null,
      reviewCount: placeResult.user_ratings_total || 0,
      name: placeResult.name,
      address: placeResult.vicinity,
    };
  } catch (error) {
    console.error("Server side proxy failure:", error);
    return {
      error: { message: "Internal server error during Places lookup." },
    };
  }
}
