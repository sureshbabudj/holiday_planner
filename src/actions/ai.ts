"use server";

import { ai } from "@/lib/genkit";
import { TripResponseSchema } from "@/schema/google-places-data.schema";
import { TripPayload } from "@/types";
import { googleAI } from "@genkit-ai/google-genai";
import { z } from "genkit";

// 💡 Define the dynamic tool to gather all external data
const tripDataTool = ai.defineTool(
  {
    name: "tripDataTool",
    description:
      "Gathers current weather, travel prices, and popular place IDs for itinerary planning.",
    inputSchema: z.object({
      location: z.string().describe("The primary destination city/country."),
      startDate: z
        .string()
        .describe("The starting date for the trip (YYYY-MM-DD)."),
      endDate: z
        .string()
        .describe("The ending date for the trip (YYYY-MM-DD)."),
      primaryInterest: z
        .string()
        .describe("The user's primary trip interest (e.g., Hiking)."),
      budgetRange: z.string().describe("The user's budget range for the trip."),
    }),
    outputSchema: z.string(), // Returns a string summary of the fetched data
  },
  async (input) => {
    // --- Simulated Data Fetching ---
    const weatherQuery = `5-day weather forecast for ${input.location} from ${input.startDate} to ${input.endDate}`;
    const placeQuery = `Best rated attractions, hotels, and restaurants in ${input.location} for a ${input.primaryInterest} trip`;

    // This simulated output informs the model that data is available.
    // NOTE: The tool *must* receive the budgetRange to use it in the simulated output,
    // which requires updating the input schema of the tool to include it.
    // We will assume the model uses the available information from the initial prompt.

    return `
            {
                "data_status": "FETCHED",
                "weather_summary": "Weather forecast for ${input.location} during the trip duration (${weatherQuery}) shows conditions suitable for sightseeing and the user's interest.",
                "place_data_available": "Google Maps and search data for attractions, addresses, and ratings in ${input.location} focused on the interest '${input.primaryInterest}' (${placeQuery}) is ready for use.",
                "cost_data_available": "Real-time travel cost data for flights and accommodations in the region is available for budget calculation. The user specified a budget goal of $${input.budgetRange || "MODERATE"}."
            }
        `;
  }
);

const SYSTEM_INSTRUCTION_JSON = `
    You are a world-class travel agent, economist, and weather expert.
    Your sole output must be a single JSON object that strictly adheres to the provided Zod Schema structure.
    Do not output any introductory text, commentary, or markdown outside of the JSON block.
`;

export async function generateAIResponse(payload: TripPayload) {
  const {
    homeCity,
    destination,
    fromDate,
    toDate,
    travelType,
    budgetRange,
    primaryInterest,
  } = payload;

  // --- STEP 1: Tool Execution (Get Context) ---
  const toolPrompt = `
        Based on the user request, execute the 'tripDataTool' to gather all necessary external information 
        for planning the trip to ${destination} from ${fromDate} to ${toDate} 
        with the primary interest of ${primaryInterest} and a budget goal of ${budgetRange}.
    `;

  // 💡 FIX 1: Ensure tool parameters are passed correctly for Genkit.
  const toolResponse = await ai.generate({
    model: googleAI.model("gemini-2.5-flash"),
    prompt: toolPrompt,
    tools: [tripDataTool],
  });

  // Extract the raw text from the tool call's output
  const toolContext = toolResponse.text;

  // --- STEP 2: JSON Generation (Using Context) ---

  const promptText = `
        Using the external data summary provided below, plan a comprehensive, structured holiday itinerary.
        
        **EXTERNAL DATA SUMMARY:**
        ${toolContext}

        **User Trip Parameters:**
        - **Home City:** ${homeCity}
        - **Destination:** ${destination}
        - **Dates:** ${fromDate} to ${toDate}
        - **Travel Type:** ${travelType}
        - **Budget Goal:** ${budgetRange}
        - **Primary Interest:** ${primaryInterest}

        **JSON Content Instructions:**
        1. **Daily Plan Logic:** Create the Daily Itinerary Plan based on the user's **Primary Interest** and **Travel Type**. The plan must include one dedicated **Leisure Day** (activity_type: 'Leisure') if the trip duration is 6 days or more.
        2. **Meals & Accommodation:** Every single day must include a breakfast, lunch, and dinner recommendation. Suggest appropriate accommodation, detecting and planning for multi-city travel if logical.
        3. **Budget:** Analyze the user's **Budget Goal** and fill the \`budget_analysis\` object completely for the 'tight', 'moderate', and 'lavish' cost levels.
        
        **Use the Zod Schema's structure and descriptions as your guide for the final JSON object.**
    `;

  try {
    const response = await ai.generate({
      model: googleAI.model("gemini-2.5-flash"),
      prompt: promptText,
      system: SYSTEM_INSTRUCTION_JSON,
      tools: [tripDataTool],
      config: {
        temperature: 0.3,
      },
      output: { schema: TripResponseSchema },
    });

    // Genkit's output is now a raw JSON object string, which we parse and validate.
    const validatedData = TripResponseSchema.parse(response.output);
    return validatedData;
  } catch (error) {
    console.error("AI Generation Error:", error);
    // If validation fails or any other error occurs
    return {
      error:
        "Failed to generate structured trip plan due to an internal API or validation error.",
    };
  }
}
