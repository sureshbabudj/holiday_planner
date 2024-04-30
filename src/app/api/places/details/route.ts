// pages/api/proxy.js
import axios from "axios";

import { NextResponse } from "next/server";

export interface PlaceDetails {
  html_attributions: any[];
  result: CityAddress;
  status: string;
}

export interface CityAddress {
  address_components: AddressComponent[];
  adr_address: string;
  formatted_address: string;
  geometry: Geometry;
  icon: string;
  icon_background_color: string;
  icon_mask_base_uri: string;
  name: string;
  photos: Photo[];
  place_id: string;
  reference: string;
  types: string[];
  url: string;
  utc_offset: number;
  vicinity: string;
  website: string;
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
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
}

export async function GET(request: Request) {
  try {
    const placeId = new URL(request.url).searchParams.get("place_id");
    if (!placeId) {
      throw { message: "Invalid request" };
    }
    const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API;
    const googlePlacesDetailApi = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`;
    const response = await axios.get(googlePlacesDetailApi);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: error.message },
      { status: error.response?.status || 500 }
    );
  }
}
