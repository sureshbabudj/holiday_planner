"use client";

import { ItineraryDay } from "@/app/api/plan/places";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function ItineraryDayMenu({
  sightseeingPlans,
  selectedDay,
  onDayClick,
}: {
  sightseeingPlans: ItineraryDay[];
  selectedDay: ItineraryDay;
  onDayClick?: (day: ItineraryDay, dayNumber: number) => void;
}) {
  return (
    <div className="w-full px-10">
      <Carousel
        opts={{
          align: "start",
        }}
      >
        <CarouselContent>
          {sightseeingPlans.map((day, i) => (
            <CarouselItem
              key={i}
              className="basis-1/2 sm:basis-1/3 md:basis-1/5 lg:basis-1/6"
            >
              <Button
                variant="outline"
                className={cn("bg-slate-100 w-full", {
                  "bg-violet-700 text-white": selectedDay.date === day.date,
                })}
                key={i}
                onClick={() => onDayClick?.(day, i)}
              >
                {day.date}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export function ItineraryDayMenu1({
  sightseeingPlans,
  selectedDay,
  onDayClick,
}: {
  sightseeingPlans: ItineraryDay[];
  selectedDay: ItineraryDay;
  onDayClick?: (day: ItineraryDay, dayNumber: number) => void;
}) {
  return (
    <div className="flex flex-row space-x-3 mb-4 justify-center">
      {sightseeingPlans.map((day, i) => (
        <Button
          variant="default"
          className={cn("bg-slate-600", {
            "bg-violet-700": selectedDay.date === day.date,
          })}
          key={i}
          onClick={() => onDayClick?.(day, i)}
        >
          {day.date}
        </Button>
      ))}
    </div>
  );
}
