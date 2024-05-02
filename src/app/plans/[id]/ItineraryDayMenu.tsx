"use client";

import { ItineraryDay } from "@/app/api/plan/places";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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