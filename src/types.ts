import { ItineraryDay, Place } from "./app/api/plan/places";

export interface NavLink {
  title: string;
  href: string;
  children?: NavLink[];
}

export interface Option {
  label: string;
  value: string;
}

export type Coordinates = string[];

export interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties?: string[];
  launchYear: any;
  types: string[];
}

export type MinimalHoliday = Pick<Holiday, "date" | "name">;

export interface Itinerary {
  [key: string]: any;
}

export interface VacationPlan {
  id: string;
  itinerary: Itinerary;
  holidaysIncluded: Pick<Holiday, "date" | "name">[];
  best?: boolean; // Flag indicating the best plan
  tags: string[];
  rating: Rating;
  sightseeingPlans: ItineraryDay[];
}

export interface PlanResult {
  vacationPlans: VacationPlan[];
  totalPlans: number;
  totalPages: number;
  currentPage: number;
  attractions: Place[];
}

export interface Rating {
  ratioRating: number;
  travelTimeRating: number;
  moreDaysRating: number;
  shortSweetRating: number;
  overallRating: number;
}
