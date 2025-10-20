import { z } from "genkit";

// --- Utility Schemas (for reuse) ---
export const GooglePlacesDataSchema = z.object({
  place_id: z
    .string()
    .describe("The unique Google Place ID for this location, if applicable."),
  name: z.string().describe("The name of the location or establishment."),
  user_rating: z
    .number()
    .min(1)
    .max(5)
    .optional()
    .describe("The user rating (1.0 to 5.0) from Google Places."),
  review_count: z
    .number()
    .int()
    .optional()
    .describe("The number of user reviews."),
  address: z.string().optional().describe("The full address."),
});

const MealPlanSchema = z.object({
  breakfast: z
    .string()
    .describe("Name of the meal/restaurant, e.g., 'Local bakery near hotel'."),
  lunch: z
    .string()
    .describe("Name of the meal/restaurant, e.g., 'Street food market'."),
  dinner: z
    .string()
    .describe(
      "Name of the meal/restaurant, e.g., 'Mid-range Italian restaurant'."
    ),
});

const CostEstimateSchema = z.object({
  tight: z
    .number()
    .int()
    .describe("Estimated cost for this category on a tight/budget plan (USD)."),
  moderate: z
    .number()
    .int()
    .describe(
      "Estimated cost for this category on a moderate/mid-range plan (USD)."
    ),
  lavish: z
    .number()
    .int()
    .describe(
      "Estimated cost for this category on a lavish/luxury plan (USD)."
    ),
});

// --- Itinerary Schemas ---

const DailyActivitySchema = z.object({
  time_of_day: z
    .enum(["Morning", "Afternoon", "Evening"])
    .describe("Time slot for the activity."),
  activity_type: z
    .enum(["Sightseeing", "Adventure", "Leisure", "Travel", "Dining"])
    .describe("Primary type of activity."),
  description: z
    .string()
    .describe("Detailed description of the activity or visit."),
  place_details: GooglePlacesDataSchema.optional().describe(
    "Details of the specific place to visit/stay, if applicable."
  ),
});

const DailyItinerarySchema = z.object({
  day_number: z
    .number()
    .int()
    .describe("Day number of the trip (e.g., 1, 2, 3)."),
  date: z.string().describe("Date of the itinerary day (YYYY-MM-DD)."),
  daily_theme: z
    .string()
    .describe(
      "A short summary of the day's focus (e.g., 'Historical Exploration' or 'Mountain Hike')."
    ),
  weather: z
    .string()
    .describe(
      "Tentative weather for the day (e.g., 'Cloudy, 15°C', uses 'weather' tool data)."
    ),
  activities: z
    .array(DailyActivitySchema)
    .describe("List of activities planned for the day."),
  meals: MealPlanSchema.describe(
    "Breakfast, lunch, and dinner recommendations."
  ),
  accommodation_recommendation: z
    .object({
      hotel_name: z.string().describe("Recommended hotel/stay name."),
      reason: z
        .string()
        .describe(
          "Justification for the choice (e.g., 'Near all sights, family-friendly' or 'Close to the train station for the next city')."
        ),
      is_same_city: z
        .boolean()
        .describe("True if stay is in the same city as the previous night."),
      place_details: GooglePlacesDataSchema.optional().describe(
        "Google Places details for the accommodation."
      ),
    })
    .describe("Accommodation suggestion for the night."),
});

// --- Main Response Schema ---

export const TripResponseSchema = z.object({
  // --- Trip Summary & Core Data ---
  trip_summary: z.object({
    destination_name: z.string(),
    travel_party: z
      .string()
      .describe("The recognized travel type (e.g., Family with Toddlers)."),
    duration_days: z.number().int(),
    travel_from_city: z.string().describe("The user's home/starting city."),
    overall_suitability_score: z.number().min(1).max(10),
    key_takeaways: z.array(z.string()).min(3).max(5),
  }),

  // --- High-Level Itineraries (Thematic classification) ---
  itinerary_themes: z
    .object({
      leisure_relaxed: z
        .string()
        .describe(
          "1-2 sentence description of the leisure option for the trip."
        ),
      adventure_sports: z
        .string()
        .describe(
          "1-2 sentence description of the adventure option for the trip."
        ),
      sight_seeing_cultural: z
        .string()
        .describe(
          "1-2 sentence description of the sight-seeing option for the trip."
        ),
    })
    .describe("High-level classification of possible trip themes."),

  // --- Detailed Daily Plan ---
  daily_itinerary_plan: z
    .array(DailyItinerarySchema)
    .describe(
      "The detailed, day-by-day plan following the recommended trip theme."
    ),

  // --- Cost Analysis ---
  budget_analysis: z.object({
    recommended_budget_level: z
      .enum(["tight", "moderate", "lavish"])
      .describe("The suggested budget level based on the user's input."),
    total_trip_cost_usd: CostEstimateSchema.describe(
      "Total estimated cost for the entire trip across all categories."
    ),
    daily_cost_breakdown: z
      .array(
        z.object({
          category: z.enum([
            "Accommodation",
            "Food_and_Drinks",
            "Activities_Entry",
            "Local_Transport",
            "Intercity_Travel",
          ]),
          daily_cost: CostEstimateSchema.describe(
            "Estimated daily cost for this category at each budget level."
          ),
        })
      )
      .describe("Detailed daily cost estimates per category."),
  }),
});
