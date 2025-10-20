import { z } from "genkit";
import { TripResponseSchema } from "./schema/google-places-data.schema";

export interface TripPayload {
  homeCity: string;
  destination: string;
  fromDate: string;
  toDate: string;
  travelType: string;
  budgetRange: string;
  primaryInterest: string;
}

export interface PlaceDetails {
  imageUrl: string | null;
  rating: number | null;
  reviewCount: number;
  name: string;
  address: string;
}

export interface PlaceDetailsError {
  error: {
    message: string;
  };
}

export type TripResponse = z.infer<typeof TripResponseSchema>;
