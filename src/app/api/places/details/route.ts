// pages/api/proxy.js
import axios from "axios";

import { NextResponse } from "next/server";

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
