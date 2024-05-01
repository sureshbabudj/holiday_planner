"use client";

import { RatingLabel, TransportIcon } from "@/components/PlanCard";
import { Button } from "@/components/ui/button";
import { Rating } from "@/types";
import {
  MapPinIcon,
  CalendarDaysIcon,
  HeartIcon,
  Share2Icon,
  SaveIcon,
} from "lucide-react";
import { ItineraryType } from "./PlanDetails";

export function PlanDetailHeader({
  title,
  rating,
  fromDate,
  toDate,
  totalDays,
  transportMode,
  travelTimeInHours,
}: ItineraryType & { rating: Rating }) {
  return (
    <div className="flex flex-row w-full space-x-2 mb-6 items-baseline">
      <div className="grow">
        <h2 className="font-semibold text-3xl mb-2">{title}</h2>
        {/* TODO: tag the destination in api response */}
        <div className="flex flex-row space-x-1 mb-3">
          <MapPinIcon />
          <span>Jibhi, Himachal Pradesh, India</span>
        </div>
        <div className="mb-3">
          <RatingLabel rating={rating} className="justify-normal" />
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="flex flex-row space-x-2 text-xl font-semibold items-center mb-3">
          <CalendarDaysIcon />
          <span className="">{`from ${fromDate} to ${toDate} (${totalDays} days)`}</span>
        </div>
        <div className="flex flex-row-reverse justify-center items-center mb-3">
          <div className="text-md mr-2 rounded-md bg-violet-400 text-slate-50 p-2 flex justify-center">
            <TransportIcon transport={transportMode} />
          </div>
          <div className="text-md mr-2">
            travel for{" "}
            <span className="rounded-full text-white bg-blue-900 inline-block px-2">
              {travelTimeInHours}
            </span>{" "}
            hours by
          </div>
        </div>
        <div className="flex flex-row space-x-2 items-center">
          <Button variant={"outline"} className="text-red-700">
            <HeartIcon />
          </Button>
          <Button variant={"outline"}>
            <Share2Icon />
          </Button>
          <Button variant={"default"} className="bg-violet-800">
            <SaveIcon />
            <span className="ml-1">Save to Your Plan</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
