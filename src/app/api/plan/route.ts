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
  getPhotosForPlaces,
} from "./places";
import crypto from "crypto";
import { countryCodes } from "./countryCodes";
import { cookies } from "next/headers";
import redisClient from "@/lib/redis";
import { PlaceDetails } from "../places/details/route";
import { findCountry } from "@/lib/utils";

interface PlanSearchParams {
  home: PlaceDetails;
  destination: PlaceDetails;
  country_code: string;
  year: number;
  userId: string;
  page: number;
  pageSize: number;
  cacheKey: string;
}

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
  const travelTimePercentage =
    (itinerary.siteTravelTimeInHours / (itinerary.totalDays * 9)) * 100;
  let travelTimeRating;
  if (travelTimePercentage <= 25) {
    travelTimeRating = 10;
  } else if (travelTimePercentage > 25 && travelTimePercentage <= 50) {
    travelTimeRating = 8;
  } else if (travelTimePercentage > 50 && travelTimePercentage <= 75) {
    travelTimeRating = 5;
  } else {
    travelTimeRating = 0;
  }

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

function extractInnerText(htmlString: string): string {
  return htmlString
    .replace(/\n/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style[^>]*>/gi, "")
    .replace(/<head[^>]*>[\s\S]*?<\/head[^>]*>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script[^>]*>/gi, "")
    .replace(/<\/\s*(?:p|div)>/gi, "\n")
    .replace(/<br[^>]*\/?>/gi, "\n")
    .replace(/<[^>]*>/gi, "")
    .replace("&nbsp;", " ")
    .replace(/[^\S\r\n][^\S\r\n]+/gi, " ");
}

// Function to check if a given date is a weekend (Saturday or Sunday)
function isWeekend(date: Date): boolean {
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // Sunday is 0, Saturday is 6
}

// Function to generate vacation plans based on duration and maximum travel time
function generateVacationPlans(
  duration: number,
  maxTravelTime: number,
  homeAddress: Coordinates,
  destinationAddress: Coordinates,
  year: number,
  holidayList: Holiday[],
  nearbyPlaces: Place[]
): VacationPlan[] {
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
        const siteSeeingDates = getSiteSeeingDates(
          vacationStartDate,
          vacationEndDate,
          holidaysIncluded
        );

        const totalDays = findDaysBetweenDates(
          vacationStartDate,
          vacationEndDate
        );

        const randomPlace = findPlaceWithPhotos(nearbyPlaces);
        let image = randomPlace?.photos[0];

        const itinerary: Itinerary = {
          title: generateTourPlanTitle(totalDays),
          fromDate: formatDate(vacationStartDate),
          toDate: formatDate(vacationEndDate),
          totalDays,
          travelTimeInHours: Math.round(travelTimeInHours),
          restDate: formatDate(vacationEndDate),
          siteSeeingDates,
          transportMode,
          image: image?.url,
          imageTitle:
            image?.html_attributions.length &&
            extractInnerText(image?.html_attributions[0]),
        };

        const { itinerary: sightSeeingDays, travelTime } = formulateItinerary(
          itinerary.siteSeeingDates,
          nearbyPlaces
        );

        itinerary.siteTravelTimeInHours = travelTime;

        const rating = evaluateRating(holidaysIncluded, itinerary);

        // Determine tags
        const tags = [];
        if (duration <= 3) tags.push("economical");
        if (duration >= 5) tags.push("pricy");
        if (duration >= 3 && duration <= 7) tags.push("pleasant");
        if (duration <= 5) tags.push("short");
        else if (duration >= 8 && duration <= 12) tags.push("medium");
        else tags.push("long");

        const plan: VacationPlan = {
          id: [8, 4, 4, 4, 12]
            .map((n) => crypto.randomBytes(n / 2).toString("hex"))
            .join("-"),
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
    startDate = endDate;
    endDate = new Date(startDate.toDateString());
    endDate.setDate(startDate.getDate() + duration);
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
function getSiteSeeingDates(
  startDate: Date,
  endDate: Date,
  holidaysIncluded: MinimalHoliday[]
): string[] {
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
  cacheKey: string
): Promise<Pick<PlanResult, "vacationPlans" | "attractions">> {
  const nearbyPlacesWithoutPhotos = await getNearbyPlaces(
    destinationAddress.join()
  );
  const nearbyPlaces = await getPhotosForPlaces(nearbyPlacesWithoutPhotos);
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
    generateVacationPlans(
      2,
      2,
      homeAddress,
      destinationAddress,
      year,
      holidayList,
      nearbyPlaces
    ), // 2-day plan for travel time within 2 hours
    generateVacationPlans(
      3,
      4,
      homeAddress,
      destinationAddress,
      year,
      holidayList,
      nearbyPlaces
    ), // 3-day plan for travel time within 3 to 4 hours
    generateVacationPlans(
      4,
      8,
      homeAddress,
      destinationAddress,
      year,
      holidayList,
      nearbyPlaces
    ), // 4-day plan for travel time within 5 to 8 hours

    // Generate medium-term vacation plans
    generateVacationPlans(
      5,
      Infinity,
      homeAddress,
      destinationAddress,
      year,
      holidayList,
      nearbyPlaces
    ), // 5-day plan (no maximum travel time)
    generateVacationPlans(
      6,
      Infinity,
      homeAddress,
      destinationAddress,
      year,
      holidayList,
      nearbyPlaces
    ), // 6-day plan (no maximum travel time)
    generateVacationPlans(
      7,
      Infinity,
      homeAddress,
      destinationAddress,
      year,
      holidayList,
      nearbyPlaces
    ), // 7-day plan (no maximum travel time)
    generateVacationPlans(
      9,
      Infinity,
      homeAddress,
      destinationAddress,
      year,
      holidayList,
      nearbyPlaces
    ), // 9-day plan (no maximum travel time)
    generateVacationPlans(
      12,
      Infinity,
      homeAddress,
      destinationAddress,
      year,
      holidayList,
      nearbyPlaces
    ), // 12-day plan (no maximum travel time)
    generateVacationPlans(
      15,
      Infinity,
      homeAddress,
      destinationAddress,
      year,
      holidayList,
      nearbyPlaces
    ), // 15-day plan (no maximum travel time)
    generateVacationPlans(
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

  const result = {
    vacationPlans,
    attractions: nearbyPlaces,
  };

  return result;
}

function getPaginatedVacationPlans(
  vacationPlans: VacationPlan[],
  page: number = 1,
  pageSize: number = 10
) {
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
  };
}

async function getHolidays({
  countryCode,
  year,
}: {
  countryCode: string;
  year: string;
}): Promise<Holiday[]> {
  const response = await axios.get(
    `https://date.nager.at/api/v3/publicholidays/${year}/${countryCode || "US"}`
  );
  return response.data;
}

async function resolveSearchParams(
  url: URL
): Promise<PlanSearchParams | Error> {
  try {
    const searchParams = new URL(url).searchParams;
    const homeId = new URLSearchParams(searchParams).get("home");
    const destinationId = new URLSearchParams(searchParams).get("destination");
    const userId = new URLSearchParams(searchParams).get("user_id");
    if (!homeId || !destinationId || !userId) {
      throw { message: "Missing required parameters" };
    }

    const year = parseInt(
      searchParams.get("year") || String(new Date().getFullYear())
    );
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    const api = axios.create({
      baseURL: "http://localhost:8101",
      withCredentials: true, // Include credentials (cookies) in requests
    });

    const [home, destination] = await Promise.all([
      api.get<PlaceDetails>(`/api/places/details?place_id=${homeId}`),
      api.get<PlaceDetails>(`/api/places/details?place_id=${destinationId}`),
    ]);

    const country = findCountry(home.data);
    const country_code = country
      ? countryCodes[country].nagarCode === "NA"
        ? "US"
        : countryCodes[country].nagarCode
      : "US";

    const cacheKey = `user:${userId};home:${homeId};desti:${destinationId};year:${year}`;

    return {
      home: home.data,
      destination: destination.data,
      country_code,
      year,
      userId,
      page,
      pageSize,
      cacheKey,
    };
  } catch (error: any) {
    console.log(error);
    return error?.message
      ? new Error(error.message)
      : new Error("Internal server Error");
  }
}

export async function GET(request: Request) {
  try {
    const params = await resolveSearchParams(new URL(request.url));
    if (params instanceof Error) {
      throw params;
    }

    const {
      home: homePlace,
      destination: destinationPlace,
      country_code: countryCode,
      year,
      page,
      pageSize,
      cacheKey,
    } = params;

    const home = [
      String(homePlace.result.geometry.location.lat),
      String(homePlace.result.geometry.location.lng),
    ];
    const destination = [
      String(destinationPlace.result.geometry.location.lat),
      String(destinationPlace.result.geometry.location.lng),
    ];

    let result: PlanResult | undefined;
    let headers: HeadersInit = {};

    let data = await redisClient.get(cacheKey);
    if (data) {
      const {
        attractions,
        vacationPlans,
        home: homePlace,
        destination: destinationPlace,
      } = JSON.parse(data) as Pick<
        PlanResult,
        "vacationPlans" | "attractions" | "home" | "destination"
      >;
      const paginatedResults = getPaginatedVacationPlans(
        vacationPlans,
        page,
        pageSize
      );
      result = {
        ...paginatedResults,
        attractions,
        home: homePlace,
        destination: destinationPlace,
      };
    } else {
      const holidayList = await getHolidays({
        countryCode,
        year: String(year),
      });

      const { vacationPlans, attractions } = await evaluateVacationPlans(
        home,
        destination,
        year,
        holidayList,
        cacheKey
      );

      await redisClient.set(
        cacheKey,
        JSON.stringify({
          vacationPlans,
          attractions,
          home: homePlace,
          destination: destinationPlace,
        }),
        "EX",
        3600
      );

      const paginatedResults = getPaginatedVacationPlans(
        vacationPlans,
        page,
        pageSize
      );

      result = {
        ...paginatedResults,
        attractions,
        home: homePlace,
        destination: destinationPlace,
      };
    }

    return Response.json(result, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
