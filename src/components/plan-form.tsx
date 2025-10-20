"use client";

import { generateAIResponse } from "@/actions/ai";
import { TripResponse } from "@/types";
import React, { useState } from "react";
import TripPageDetails from "./plan-details";

// Define options for selection fields
const travelTypeOptions = [
  "Solo Traveler",
  "Couple (Honeymoon/Romantic)",
  "Family with Infant(s)",
  "Family with Toddler(s)",
  "Family with Elders",
  "Group of Friends",
  "Business Trip / Workation",
];

const budgetRangeOptions = [
  "Tight (Lowest Cost)",
  "Moderate (Mid-Range, Good Value)",
  "Lavish (Luxury, No Expense Spared)",
  "Custom (Enter amount in prompt)",
];

const primaryInterestOptions = [
  "Food and Culinary Exploration",
  "Historical and Cultural Sightseeing",
  "Outdoor Adventure and Hiking",
  "Beach and Relaxation",
  "Nightlife and Entertainment",
  "Shopping and Design",
];

export function PlanForm() {
  // Use a generic state type for the structured JSON response
  const [response, setResponse] = useState<TripResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Custom type definitions for form data extraction are not needed in this JavaScript file

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    const formData = new FormData(event.currentTarget);

    // Extract and structure the data according to the server action's expected payload
    const payload = {
      homeCity: formData.get("homeCity") as string,
      destination: formData.get("destination") as string,
      fromDate: formData.get("fromDate") as string,
      toDate: formData.get("toDate") as string,
      travelType: formData.get("travelType") as string,
      budgetRange: formData.get("budgetRange") as string,
      primaryInterest: formData.get("primaryInterest") as string,
    };

    // Validate required fields (minimal check)
    if (!payload.destination || !payload.fromDate || !payload.toDate) {
      // Use a custom message box instead of alert()
      setError("Please fill in destination and dates.");
      setLoading(false);
      return;
    }

    try {
      // The action expects the structured object payload
      const result = await generateAIResponse(payload);
      console.log("AI Response:", result);
      setResponse(result as TripResponse);
    } catch (error) {
      console.error("Error generating AI response:", error);
      setError(
        "An error occurred while generating the plan. Check the console for details."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-6 bg-white">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        AI Holiday Planner
      </h1>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Destination & Home City */}
        <div>
          <label
            className="block mb-1 text-sm font-medium text-gray-700"
            htmlFor="homeCity"
          >
            Traveling From (City/Country)
          </label>
          <input
            type="text"
            name="homeCity"
            required
            className="w-full rounded-md border border-gray-300 p-2.5 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., London, UK"
          />
        </div>

        <div>
          <label
            className="block mb-1 text-sm font-medium text-gray-700"
            htmlFor="destination"
          >
            Destination City/Country
          </label>
          <input
            type="text"
            name="destination"
            required
            className="w-full rounded-md border border-gray-300 p-2.5 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., Tokyo, Japan"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className="block mb-1 text-sm font-medium text-gray-700"
              htmlFor="fromDate"
            >
              Start Date
            </label>
            <input
              type="date"
              name="fromDate"
              required
              className="w-full rounded-md border border-gray-300 p-2.5 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label
              className="block mb-1 text-sm font-medium text-gray-700"
              htmlFor="toDate"
            >
              Return Date
            </label>
            <input
              type="date"
              name="toDate"
              required
              className="w-full rounded-md border border-gray-300 p-2.5 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Trip Details (Selects) */}
        <div>
          <label
            className="block mb-1 text-sm font-medium text-gray-700"
            htmlFor="travelType"
          >
            Travel Party Type
          </label>
          <select
            name="travelType"
            required
            className="w-full rounded-md border border-gray-300 p-2.5 focus:border-indigo-500 focus:ring-indigo-500 appearance-none"
          >
            {travelTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className="block mb-1 text-sm font-medium text-gray-700"
            htmlFor="budgetRange"
          >
            Budget Level
          </label>
          <select
            name="budgetRange"
            required
            className="w-full rounded-md border border-gray-300 p-2.5 focus:border-indigo-500 focus:ring-indigo-500 appearance-none"
          >
            {budgetRangeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className="block mb-1 text-sm font-medium text-gray-700"
            htmlFor="primaryInterest"
          >
            Primary Trip Interest
          </label>
          <select
            name="primaryInterest"
            required
            className="w-full rounded-md border border-gray-300 p-2.5 focus:border-indigo-500 focus:ring-indigo-500 appearance-none"
          >
            {primaryInterestOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white font-semibold py-3 px-4 rounded-md transition duration-200 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 shadow-md"
          }`}
        >
          {loading ? "Planning..." : "Plan My Structured Holiday"}
        </button>
      </form>
      <>
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}
        {response && <TripPageDetails data={response} />}
      </>
    </div>
  );
}
