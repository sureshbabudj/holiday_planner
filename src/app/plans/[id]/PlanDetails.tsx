/* eslint-disable @next/next/no-img-element */
"use client";

import { PlanResponse } from "./page";
import { ItineraryDay } from "@/app/api/plan/places";
import { ItineraryDayMenu } from "./ItineraryDayMenu";
import { PlanDetailHeader } from "./PlanDetailHeader";
import { useState } from "react";

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

function ItineraryDayDetails() {
  return (
    <div className="">
      <div className="brounded-lg w-full mx-5 space-y-6 p-10">
        <div>
          <p className="text-sm leading-6 text-slate-800">
            Hypnosis at the parallel universe was the advice of alarm, commanded
            to a conscious ship. Processors experiment with paralysis!
          </p>
        </div>

        <div className="grid grid-cols-6 col-span-2   gap-2  ">
          <div className=" overflow-hidden rounded-xl col-span-3 max-h-[14rem]">
            <img
              className="h-full w-full object-cover "
              src="https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80"
              alt=""
            />
          </div>
          <div className=" overflow-hidden rounded-xl col-span-3 max-h-[14rem]">
            <img
              className="h-full w-full object-cover  "
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1399&q=80"
              alt=""
            />
          </div>
          <div className=" overflow-hidden rounded-xl col-span-2 max-h-[10rem]">
            <img
              className="h-full w-full object-cover "
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              alt=""
            />
          </div>
          <div className=" overflow-hidden rounded-xl col-span-2 max-h-[10rem]">
            <img
              className="h-full w-full object-cover "
              src="https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              alt=""
            />
          </div>
          <div className="relative overflow-hidden rounded-xl col-span-2 max-h-[10rem]">
            <div className="text-white text-xl absolute inset-0  bg-slate-900/80 flex justify-center items-center">
              + 23
            </div>
            <img
              className="h-full w-full object-cover "
              src="https://images.unsplash.com/photo-1560393464-5c69a73c5770?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=765&q=80"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PlanDetails({ plan }: { plan: PlanResponse }) {
  const { plan: planDetails, attractions } = plan;
  const {
    holidaysIncluded,
    id: planId,
    rating,
    sightseeingPlans,
    tags,
    best,
  } = planDetails;

  const itinerary = planDetails.itinerary as ItineraryType;

  const [itineraryDay, setItineraryDay] = useState(sightseeingPlans[0]?.date);

  const handleDayClick = (day: ItineraryDay) => {
    setItineraryDay(day.date);
  };

  return (
    <div className="flex flex-col container mx-auto" id={planId}>
      <PlanDetailHeader {...{ ...itinerary, rating }} />
      <ItineraryDayMenu
        sightseeingPlans={sightseeingPlans}
        selectedDay={itineraryDay}
        onDayClick={handleDayClick}
      />
      <ItineraryDayDetails />
    </div>
  );
}
