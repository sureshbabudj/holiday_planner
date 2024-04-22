import {
  Coordinates,
  Holiday,
  PlanResult,
  VacationPlan,
  MinimalHoliday,
  Itinerary,
  Rating,
} from "@/types";
import axios from "axios";
import { NextResponse } from "next/server";
import {
  Place,
  getNearbyPlaces,
  formulateItinerary,
  calculateTravelTimeInHours,
  findDaysBetweenDates,
  generateTourPlanTitle,
  findPlaceWithPhotos,
} from "./places";
import crypto from 'crypto'

// Function to evaluate the rating for a vacation plan
function evaluateRating(
  holidaysIncluded: MinimalHoliday[],
  itinerary: Itinerary
): Rating {
  const holidaysIncludedCount = holidaysIncluded.length;
  const vacationDays = itinerary.siteSeeingDates.length;
  const ratio = holidaysIncludedCount / vacationDays;

  // 1. Number of Holidays vs Vacation Days Ratio
  const ratioRating = ratio * 10;

  // 2. Travel Time Constraint
  const travelTimeInHours = itinerary.travelTimeInHours;
  const maxTravelTime = vacationDays / 4;
  const travelTimeRating = travelTimeInHours <= maxTravelTime ? 10 : 0;

  // 3. More days to travel - more rest and relaxed it can be at the same time pricy
  const moreDaysRating = vacationDays >= 5 ? 8 : vacationDays >= 3 ? 6 : 4;

  // 4. short and sweet - less vacation or no vacation at all - budget friendly
  const shortSweetRating = vacationDays <= 3 ? 8 : 5;

  // Calculate the overall rating
  const overallRating =
    (ratioRating + travelTimeRating + moreDaysRating + shortSweetRating) / 4;

  return {
    ratioRating,
    travelTimeRating,
    moreDaysRating,
    shortSweetRating,
    overallRating,
  };
}

// Function to check if a given date is a weekend (Saturday or Sunday)
function isWeekend(date: Date): boolean {
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // Sunday is 0, Saturday is 6
}

// Function to generate vacation plans based on duration and maximum travel time
async function generateVacationPlans(
  duration: number,
  maxTravelTime: number,
  homeAddress: Coordinates,
  destinationAddress: Coordinates,
  year: number,
  holidayList: Holiday[],
  nearbyPlaces: Place[]
): Promise<VacationPlan[]> {
  const { travelTimeInHours, transportMode } = calculateTravelTimeInHours(
    homeAddress,
    destinationAddress
  );
  const vacationPlans = [];

  // Skip vacation plans that exceed the maximum travel time
  if (travelTimeInHours > maxTravelTime) return [];

  let startDate = new Date(year, 0, 1);

  // If the chosen year is in the past, throw an error
  if (year < new Date().getFullYear()) {
    throw new Error(
      "The vacation plan for the past year will not make any sense."
    );
  }

  // If the chosen year is the current year, plan only for remaining days/months
  if (year === new Date().getFullYear()) {
    startDate = new Date();
  }

  const generatedPlans: { [key: string]: boolean } = {}; // To keep track of generated plans

  let endDate = new Date(startDate.toDateString());
  endDate.setDate(startDate.getDate() + duration);

  while (startDate <= endDate) {
    // If the chosen month in a year is in the past, throw an error
    if (endDate < new Date()) {
      throw new Error(
        "The vacation plan for the past month will not make any sense."
      );
    }

    // Check if end date falls within the year
    if (endDate.getFullYear() !== year) break;

    const vacationStartDate = new Date(startDate);
    vacationStartDate.setHours(12); // Set start time to noon for better planning
    const vacationEndDate = new Date(endDate);
    vacationEndDate.setHours(12); // Set end time to noon for better planning

    const planKey = `${formatDate(vacationStartDate)}_${formatDate(
      vacationEndDate
    )}`;

    // Check if the plan with the same start and end date already exists
    if (!generatedPlans[planKey]) {
      const holidayMap: { [key: string]: Holiday } = {};
      holidayList.forEach((item) => {
        holidayMap[item.date] = item;
      });
      const uniqueHolidays = Object.values(holidayMap);
      const holidaysIncluded = uniqueHolidays
        .filter((holiday) => {
          const holidayDate = new Date(holiday.date);
          return (
            holidayDate >= vacationStartDate && holidayDate <= vacationEndDate
          );
        })
        .map(({ date, name }) => ({ date, name }));

      if (holidaysIncluded.length > 0) {
        const siteSeeingDates = await getSiteSeeingDates(
          vacationStartDate,
          vacationEndDate,
          holidaysIncluded
        );

        const totalDays = findDaysBetweenDates(
          vacationStartDate,
          vacationEndDate
        );

        let image = "";
        const randomPlace = findPlaceWithPhotos(nearbyPlaces);
        if (randomPlace) {
          const { photo_reference, height, width } = randomPlace.photos[0];
          image = `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photo_reference}&maxheight=${height}&maxwidth=${width}&key=${process.env.GOOGLE_MAPS_API}`;
        }

        const itinerary = {
          title: generateTourPlanTitle(totalDays),
          fromDate: formatDate(vacationStartDate),
          toDate: formatDate(vacationEndDate),
          totalDays,
          travelTimeInHours: Math.round(travelTimeInHours),
          restDate: formatDate(vacationEndDate),
          siteSeeingDates,
          transportMode,
          image,
        };

        const rating = evaluateRating(holidaysIncluded, itinerary);

        // Determine tags
        const tags = [];
        if (duration <= 3) tags.push("economical");
        if (duration >= 5) tags.push("pricy");
        if (duration >= 3 && duration <= 7) tags.push("pleasant");
        if (duration <= 5) tags.push("short");
        else if (duration >= 8 && duration <= 12) tags.push("medium");
        else tags.push("long");

        const sightSeeingDays = formulateItinerary(
          itinerary.siteSeeingDates,
          nearbyPlaces
        );

        const plan: VacationPlan = {
          id: [8, 4, 4, 4, 12].map(n => crypto.randomBytes(n / 2).toString("hex")).join("-"),
          itinerary,
          holidaysIncluded,
          tags,
          rating,
          sightseeingPlans: sightSeeingDays,
        };

        vacationPlans.push(plan);
        generatedPlans[planKey] = true; // Mark the plan as generated
      }
    }
    startDate.setDate(startDate.getDate() + 1); // Move to next day
  }

  return vacationPlans;
}

// Function to format date as DD-MM-YYYY
function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Function to get site seeing dates
async function getSiteSeeingDates(
  startDate: Date,
  endDate: Date,
  holidaysIncluded: MinimalHoliday[]
): Promise<string[]> {
  const siteSeeingDates: string[] = [];

  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    if (
      !isWeekend(currentDate) &&
      !holidaysIncluded.some(
        (holiday) => holiday.date === formatDate(currentDate)
      )
    ) {
      siteSeeingDates.push(formatDate(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return siteSeeingDates;
}

// Function to calculate the number of holidays in a given month
function countHolidaysInMonth(
  month: number,
  year: number,
  holidayList: Holiday[]
): number {
  const holidaysInMonth = holidayList.filter((holiday) => {
    const holidayDate = new Date(holiday.date);
    return (
      holidayDate.getFullYear() === year && holidayDate.getMonth() === month
    );
  });
  return holidaysInMonth.length;
}

async function evaluateVacationPlans(
  homeAddress: Coordinates,
  destinationAddress: Coordinates,
  year: number,
  holidayList: Holiday[],
  page: number = 1,
  pageSize: number = 10
): Promise<PlanResult> {
  const nearbyPlaces = await getNearbyPlaces(destinationAddress.join());
  const vacationPlans: VacationPlan[] = [];

  // Generate long-term vacation plans
  const months = Array.from({ length: 12 }, (_, i) => i); // Generate an array of month numbers (0 to 11)

  const bestMonth = months.reduce((prevMonth, currMonth) => {
    return countHolidaysInMonth(currMonth, year, holidayList) >
      countHolidaysInMonth(prevMonth, year, holidayList)
      ? currMonth
      : prevMonth;
  }, 0); // Find the month with the most holidays

  // Generate short-term vacation plans
  const plansGroup = [
    await generateVacationPlans(
      2,
      2,
      homeAddress,
      destinationAddress,
      year,
      holidayList,
      nearbyPlaces
    ), // 2-day plan for travel time within 2 hours
    await generateVacationPlans(
      3,
      4,
      homeAddress,
      destinationAddress,
      year,
      holidayList,
      nearbyPlaces
    ), // 3-day plan for travel time within 3 to 4 hours
    await generateVacationPlans(
      4,
      8,
      homeAddress,
      destinationAddress,
      year,
      holidayList,
      nearbyPlaces
    ), // 4-day plan for travel time within 5 to 8 hours

    // Generate medium-term vacation plans
    await generateVacationPlans(
      5,
      Infinity,
      homeAddress,
      destinationAddress,
      year,
      holidayList,
      nearbyPlaces
    ), // 5-day plan (no maximum travel time)
    await generateVacationPlans(
      6,
      Infinity,
      homeAddress,
      destinationAddress,
      year,
      holidayList,
      nearbyPlaces
    ), // 6-day plan (no maximum travel time)
    await generateVacationPlans(
      7,
      Infinity,
      homeAddress,
      destinationAddress,
      year,
      holidayList,
      nearbyPlaces
    ), // 7-day plan (no maximum travel time)
    await generateVacationPlans(
      9,
      Infinity,
      homeAddress,
      destinationAddress,
      year,
      holidayList,
      nearbyPlaces
    ), // 9-day plan (no maximum travel time)
    await generateVacationPlans(
      12,
      Infinity,
      homeAddress,
      destinationAddress,
      year,
      holidayList,
      nearbyPlaces
    ), // 12-day plan (no maximum travel time)
    await generateVacationPlans(
      15,
      Infinity,
      homeAddress,
      destinationAddress,
      year,
      holidayList,
      nearbyPlaces
    ), // 15-day plan (no maximum travel time)
    await generateVacationPlans(
      new Date(year, bestMonth + 1, 0).getDate(),
      Infinity,
      homeAddress,
      destinationAddress,
      year,
      holidayList,
      nearbyPlaces
    ), // Full month plan for the month with the most holidays
  ];

  plansGroup.forEach((group) => vacationPlans.push(...group));

  // Sort vacation plans based on rating (highest to lowest)
  vacationPlans.sort((a, b) => b.rating.overallRating - a.rating.overallRating);

  const totalPlans = vacationPlans.length;
  const totalPages = Math.ceil(totalPlans / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalPlans);
  const paginatedPlans = vacationPlans.slice(startIndex, endIndex);

  return {
    vacationPlans: paginatedPlans,
    totalPlans,
    totalPages,
    currentPage: page,
    attractions: nearbyPlaces,
  };
}

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const countryCode = params.get("country_code");
    const home = params.get("home")?.split(":");
    const destination = params.get("destination")?.split(":");
    const year = parseInt(
      params.get("year") || String(new Date().getFullYear())
    );
    const page = parseInt(params.get("page") || "1");
    const pageSize = parseInt(params.get("pageSize") || "10");
    const response = await axios.get(
      `https://date.nager.at/api/v3/publicholidays/${year}/${countryCode || "US"
      }`
    );
    const holidayList = response.data as Holiday[];

    if (!home || !destination) {
      throw { error: "Invalid request" };
    }

    const vacationPlans = await evaluateVacationPlans(
      home,
      destination,
      year,
      holidayList,
      page,
      pageSize
    );

    return NextResponse.json(vacationPlans, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
