/* eslint-disable @next/next/no-img-element */
"use client";

import { PlanResponse } from "./page";
import { ItineraryDay, Place } from "@/app/api/plan/places";
import { ItineraryDayMenu } from "./ItineraryDayMenu";
import { PlanDetailHeader } from "./PlanDetailHeader";
import { useState } from "react";
import { cn, findCountry } from "@/lib/utils";
import { months } from "@/components/MonthPicker";
import { PlaceDetails } from "@/app/api/places/details/route";
import { TransportIcon } from "@/components/PlanCard";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export interface ItineraryType {
  title: string;
  fromDate: string;
  toDate: string;
  totalDays: number;
  travelTimeInHours: number;
  restDate: string;
  siteSeeingDates: string[];
  transportMode: string;
  image: string;
  imageTitle: string;
  siteTravelTimeInHours: number;
}

function Ticket({
  home,
  destination,
  transportMode,
  travelTimeInHours,
}: {
  home: PlaceDetails;
  destination: PlaceDetails;
  travelTimeInHours: number;
  transportMode: string;
}) {
  return (
    <div className="flex w-full text-white p-4 rounded-r-3xl py-5 max-w-3xl self-center border-dashed lg:border border-gray-200">
      <div className="h-full flex-grow flex flex-col">
        <div className="flex w-full justify-between items-center">
          <div className="flex flex-col items-center">
            <span className="text:xl sm:text-4xl font-bold">
              {home.result.name}
            </span>
            <span className="text-white text-sm">{findCountry(home)}</span>
          </div>
          <div className="flex flex-col flex-grow items-center px-10">
            <span className="font-bold text-xs">
              <TransportIcon transport={transportMode} />
            </span>
            <div className="w-full flex items-center mt-2">
              <div className="w-3 h-3 rounded-full border-2 border-zinc-900"></div>
              <div className="flex-grow border-t-2 border-zinc-400 border-dotted h-px"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 mx-2"
              >
                <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
              </svg>
              <div className="flex-grow border-t-2 border-zinc-400 border-dotted h-px"></div>
              <div className="w-3 h-3 rounded-full border-2 border-zinc-900"></div>
            </div>
            <div className="flex items-center px-3 rounded-full bg-lime-700 h-8 mt-2">
              <span className="text-sm">{travelTimeInHours}h</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text:xl sm:text-4xl font-bold">
              {destination.result.name}
            </span>
            <span className="text-white text-sm">
              {findCountry(destination)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DaySerial({ dayNumber }: { dayNumber: number }) {
  return (
    <div className="flex flex-col items-center space-y-1 bg-violet-500 text-white rounded-sm px-4 py-1 me-3 justify-center">
      <div className="text-sm font-semibold uppercase">Day</div>
      <div className="font-semibold text-3xl">{dayNumber}</div>
    </div>
  );
}

function formatDate(dateObj: Date) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const day = days[dateObj.getDay()].slice(0, 3);
  const month = months[dateObj.getMonth()].slice(0, 3);
  const fDate = dateObj.getDate();
  const year = dateObj.getFullYear();
  return `${day}, ${month} ${fDate}, ${year}`;
}

function DateDisplay({ date }: { date: string }) {
  const dateParts = date.split("-");
  const dateObj = new Date(`${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`);
  return <div className="font-semibold text-2xl">{formatDate(dateObj)}</div>;
}

function ItineraryDayDetails({
  itineraryDay,
  attractions,
  dayNumber,
}: {
  itineraryDay: ItineraryDay;
  attractions: Place[];
  dayNumber: number;
}) {
  const daySerial = dayNumber + 1;
  const { date, placesToVisit, travelTime } = itineraryDay;
  const places: Place[] = [];
  placesToVisit.forEach(({ id }) => {
    const place = attractions.find((place) => place.place_id === id);
    if (place) places.push(place);
  });

  const times = ["Morning", "Afternoon", "Evening", "Night"];
  let isLunchOver = false;
  const determineLunch = (i: number) => {
    if (isLunchOver) return false;
    const isLunchTime =
      parseInt(placesToVisit[i].startTime!) >= 13 &&
      parseInt(placesToVisit[i].startTime!) <= 15;
    isLunchOver = isLunchTime;
    return isLunchTime;
  };

  return (
    <div className="">
      <div className="rounded-lg w-full mx-5 space-y-6 p-10">
        <div className="flex flex-row">
          <DaySerial dayNumber={daySerial} />
          <div className="">
            <DateDisplay date={date} />
            <p className="text-slate-800">
              You get to explore {places.length} places and you mostly travel
              for visiting the places approx. {Math.round(travelTime)} hour(s)
            </p>
          </div>
        </div>
        <h4 className="font-semibold text-xl my-2">Places Overview</h4>
        <div className="-my-6">
          <div className="relative pl-8 sm:pl-32 py-6 group">
            <div className="font-caveat font-medium text-2xl text-indigo-500 mb-1 sm:mb-0">
              Breakfast
            </div>

            <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-indigo-600 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
              <time className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-20 h-6 mb-3 sm:mb-0 text-violet-600 bg-violet-100 rounded-full px-2">
                9:00
              </time>
              <div className="text-xl font-bold text-slate-900">
                Start from Hotel
              </div>
            </div>
          </div>
          {places.map((place, i) => (
            <>
              {determineLunch(i) && (
                <div className="relative pl-8 sm:pl-32 py-6 group">
                  <div className="font-caveat font-medium text-2xl text-indigo-500 mb-1 sm:mb-0">
                    Lunch
                  </div>

                  <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-indigo-600 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
                    <time className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-20 h-6 mb-3 sm:mb-0 text-violet-600 bg-violet-100 rounded-full px-2">
                      {times[1]}
                    </time>
                    <div className="text-xl font-bold text-slate-900">
                      At Restaurent
                    </div>
                  </div>
                </div>
              )}
              <div
                key={place.place_id}
                className="relative pl-8 sm:pl-32 py-6 group"
              >
                <div className="font-caveat font-medium text-2xl text-indigo-500 mb-1 sm:mb-0">
                  {place.name}
                </div>

                <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-indigo-600 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
                  <time className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-20 h-6 mb-3 sm:mb-0 text-violet-600 bg-violet-100 rounded-full px-2">
                    {placesToVisit[i].startTime}
                  </time>
                  <div className="text-xl font-bold text-slate-900">
                    {place.vicinity}
                  </div>
                </div>

                {place.photos && place.photos[0] && place.photos[0].url && (
                  <div className="rounded-xl overflow-hidden lg:max-w-[50%]">
                    <img
                      className="h-full w-full object-cover aspect-auto"
                      src={place.photos[0].url}
                      alt={place.name}
                    />
                  </div>
                )}

                <div className="flex flex-row space-x-1 my-2">
                  {place.types.map((tag) => (
                    <div
                      key={tag}
                      className="bg-slate-200 text-slate-700 text-xs px-2 py-1 rounded "
                    >
                      {tag.replaceAll("_", " ")}
                    </div>
                  ))}
                </div>

                <div className="flex flex-row space-x-1 my-2">
                  {place.rating && (
                    <div className="flex flex-row items-center space-x-2">
                      <span className="text-sm">Google Rating: </span>
                      <span className="bg-green-500 text-white text-sm px-2 py-1 rounded font-semibold">
                        {place.rating}
                      </span>
                    </div>
                  )}
                  {place.user_ratings_total && (
                    <div className="flex flex-row items-center space-x-2">
                      <span className="text-sm">Based on </span>
                      <span className="bg-blue-500 text-white text-sm px-2 py-1 rounded font-semibold">
                        {place.user_ratings_total}
                      </span>
                      <span className="text-sm">user ratings</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          ))}
          <div className="relative pl-8 sm:pl-32 py-6 group">
            <div className="font-caveat font-medium text-2xl text-indigo-500 mb-1 sm:mb-0">
              Return
            </div>

            <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-indigo-600 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
              <time className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-20 h-6 mb-3 sm:mb-0 text-violet-600 bg-violet-100 rounded-full px-2">
                {times[3]}
              </time>
              <div className="text-xl font-bold text-slate-900">To Hotel</div>
            </div>
          </div>
        </div>
        <h4 className="font-semibold text-xl my-2">Photos</h4>
        <div className="grid grid-cols-6 col-span-2 gap-2">
          {places.map((place) => (
            <>
              {place.photos?.map((photo) => (
                <div
                  key={photo.photo_reference}
                  className={cn(
                    "overflow-hidden rounded-xl col-span-3 max-h-[10rem]"
                  )}
                >
                  <img
                    className="h-full w-full object-cover"
                    src={photo.url}
                    alt={place.name}
                  />
                </div>
              ))}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlanHero({
  mainImg,
  home,
  destination,
  transportMode,
  travelTimeInHours,
}: {
  mainImg: string;
  home: PlaceDetails;
  destination: PlaceDetails;
  travelTimeInHours: number;
  transportMode: string;
}) {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat mb-10"
      style={{ backgroundImage: `url('${mainImg}')` }}
    >
      <div className="absolute inset-0 bg-black/75 sm:bg-transparent sm:bg-gradient-to-r  sm:from-black/90 sm:to-black/10"></div>

      <div className="relative mx-auto max-w-screen-xl sm:px-6  min-h-fit lg:flex lg:h-72 lg:px-8">
        <Ticket
          home={home}
          destination={destination}
          transportMode={transportMode}
          travelTimeInHours={travelTimeInHours}
        />
      </div>
    </section>
  );
}

export function PlanDetails({ plan }: { plan: PlanResponse }) {
  const { plan: planDetails, attractions, home, destination } = plan;
  const {
    holidaysIncluded,
    id: planId,
    rating,
    sightseeingPlans,
    tags,
    best,
  } = planDetails;

  const itinerary = planDetails.itinerary as ItineraryType;

  const [itineraryDay, setItineraryDay] = useState(sightseeingPlans[0]);
  const [dayNumber, setDayNumber] = useState(0);

  const mainImg =
    attractions[0].photos[0]?.url ??
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200";

  const handleDayClick = (day: ItineraryDay, dayNumber: number) => {
    setItineraryDay(day);
    setDayNumber(dayNumber);
  };

  const generateDescription = () => {
    let description =
      "This itinerary covers most of the the tourists attractions such as ";
    description += attractions
      .filter((_, i) => i < 3)
      .map((i) => i.name)
      .join(", ");
    description += " and more...";
    return description;
  };

  return (
    <div className="flex flex-col container mx-auto" id={planId}>
      <PlanDetailHeader {...{ ...itinerary, rating, destination }} />
      <PlanHero
        mainImg={mainImg}
        home={home}
        destination={destination}
        transportMode={itinerary.transportMode}
        travelTimeInHours={itinerary.travelTimeInHours}
      />

      <div className="mb-5">
        <p>{generateDescription()}</p>
        <div className="mb-2">
          <div className="text-lg text-slate-700 leading-10">
            This plan utilises the holidays{" "}
            {holidaysIncluded.map((holiday) => (
              <HoverCard key={holiday.date}>
                <HoverCardTrigger asChild>
                  <span className="bg-blue-400 text-white text-xs px-4 py-[2px] me-1 last:me-0 inline-block rounded cursor-pointer">
                    {holiday.name}
                  </span>
                </HoverCardTrigger>
                <HoverCardContent className="w-fit text-xs p-2">
                  {formatDate(new Date(holiday.date))}
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </div>
      </div>
      <ItineraryDayMenu
        sightseeingPlans={sightseeingPlans}
        selectedDay={itineraryDay}
        onDayClick={handleDayClick}
      />
      <ItineraryDayDetails
        dayNumber={dayNumber}
        itineraryDay={itineraryDay}
        attractions={attractions}
      />
    </div>
  );
}
