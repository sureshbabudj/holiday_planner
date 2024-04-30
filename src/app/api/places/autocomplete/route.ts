// pages/api/proxy.js
import axios from "axios";

import { NextResponse } from "next/server";

export interface GooglePlacesAutoCompleteApiResponse {
  predictions: Prediction[];
  status: string;
}

export interface Prediction {
  description: string;
  matched_substrings: MatchedSubstring[];
  place_id: string;
  reference: string;
  structured_formatting: StructuredFormatting;
  terms: Term[];
  types: string[];
}

export interface MatchedSubstring {
  length: number;
  offset: number;
}

export interface StructuredFormatting {
  main_text: string;
  main_text_matched_substrings: MainTextMatchedSubstring[];
  secondary_text: string;
}

export interface MainTextMatchedSubstring {
  length: number;
  offset: number;
}

export interface Term {
  offset: number;
  value: string;
}

export async function GET(request: Request) {
  try {
    const input = new URL(request.url).searchParams.get("input");
    if (!input) {
      throw { message: "Invalid request" };
    }
    const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API;
    const googlePlacesAutoCompleteApi = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${GOOGLE_API_KEY}&radius=500&types=%28cities%29`;
    const response = await axios.get(googlePlacesAutoCompleteApi);
    return NextResponse.json(
      response.data as GooglePlacesAutoCompleteApiResponse,
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: error.message },
      { status: error.response?.status || 500 }
    );
  }
}
