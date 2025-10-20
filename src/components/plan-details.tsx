"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { TripResponse } from "@/types";
import { format, parseISO } from "date-fns";
import {
  Baby,
  Bed,
  Calendar,
  Coffee,
  MapPin,
  Palette,
  Star,
  TrendingUp,
  Utensils,
} from "lucide-react";
import { PlaceDetailsCard } from "./place-details";

/* -------------------------------------------------
  3.  Tiny helpers that are now 100 % typed
---------------------------------------------------*/
const ACTIVITY_COLOURS: Record<
  "Sightseeing" | "Adventure" | "Leisure" | "Travel" | "Dining",
  string
> = {
  Sightseeing: "bg-violet-100 text-violet-700 border-violet-300",
  Adventure: "bg-orange-100 text-orange-700 border-orange-300",
  Leisure: "bg-emerald-100 text-emerald-700 border-emerald-300",
  Travel: "bg-sky-100 text-sky-700 border-sky-300",
  Dining: "bg-rose-100 text-rose-700 border-rose-300",
};

const BUDGET_COLOURS: Record<"tight" | "moderate" | "lavish", string> = {
  tight: "bg-gray-200 text-gray-800",
  moderate: "bg-amber-200 text-amber-800",
  lavish: "bg-fuchsia-200 text-fuchsia-800",
};

function SummaryHeader({ summary }: { summary: TripResponse["trip_summary"] }) {
  return (
    <Card className="mb-6 overflow-hidden rounded-3xl border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <Palette className="text-purple-600" />
          {summary.destination_name}
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Baby className="text-pink-600" /> {summary.travel_party} ·{" "}
          <Calendar className="text-pink-600" /> {summary.duration_days} days
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Star className="text-yellow-500" />
          <span className="text-sm text-muted-foreground">
            Suitability score
          </span>
          <Progress
            value={summary.overall_suitability_score * 10}
            className="w-32"
          />
          <span className="font-bold text-purple-700">
            {summary.overall_suitability_score}/10
          </span>
        </div>

        <Separator />

        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          {summary.key_takeaways.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function DayCard({
  day,
}: {
  day: TripResponse["daily_itinerary_plan"][number];
}) {
  return (
    <Card className="relative rounded-2xl shadow-md border-0">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">Day {day.day_number}</CardTitle>
            <CardDescription>
              {format(parseISO(day.date), "EEEE, dd MMM yyyy")}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="mt-1">
            {day.weather}
          </Badge>
        </div>
        <p className="text-sm text-purple-700 font-medium">{day.daily_theme}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {day.activities.map((act, idx) => (
          <div key={idx} className="flex gap-3">
            <div
              className={`shrink-0 w-[40%] rounded-xl border px-2 py-1 text-center text-xs font-semibold ${
                ACTIVITY_COLOURS[act.activity_type]
              }`}
            >
              {act.time_of_day}
              <PlaceDetailsCard place={act.place_details} />
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium">{act.description}</p>
              {act.place_details?.name && (
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {act.place_details.name}
                </div>
              )}
            </div>
          </div>
        ))}

        <Separator className="my-2" />

        <div className="grid grid-cols-3 gap-2 text-xs">
          <Meal icon={Coffee} label="Breakfast" value={day.meals.breakfast} />
          <Meal icon={Utensils} label="Lunch" value={day.meals.lunch} />
          <Meal icon={Utensils} label="Dinner" value={day.meals.dinner} />
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-purple-50 p-2">
          <Bed className="w-4 h-4 text-purple-600" />
          <div className="text-xs">
            <p className="font-medium">
              {day.accommodation_recommendation.hotel_name}
            </p>
            <p className="text-muted-foreground">
              {day.accommodation_recommendation.reason}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const Meal = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-1">
    <Icon className="w-3 h-3 text-orange-600" />
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium truncate">{value}</span>
  </div>
);

function BudgetSection({
  budget,
}: {
  budget: TripResponse["budget_analysis"];
}) {
  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-amber-50 to-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="text-amber-600" />
          Budget guide
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {budget.daily_cost_breakdown.map((cat) => (
          <div key={cat.category} className="space-y-1">
            <p className="text-sm font-medium capitalize text-muted-foreground">
              {cat.category.replace("_", " & ")}
            </p>
            <div className="flex gap-2">
              {(["tight", "moderate", "lavish"] as const).map((lvl) => (
                <Badge key={lvl} className={`${BUDGET_COLOURS[lvl]} px-2 py-1`}>
                  ${cat.daily_cost[lvl]}
                </Badge>
              ))}
            </div>
          </div>
        ))}

        <Separator />

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total trip</span>
          <div className="flex gap-2">
            {(["tight", "moderate", "lavish"] as const).map((lvl) => (
              <Badge key={lvl} className={`${BUDGET_COLOURS[lvl]} px-3 py-1`}>
                ${budget.total_trip_cost_usd[lvl]}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------
  5.  Page – fetch / static import / prop-drill
---------------------------------------------------*/
export default function TripPageDetails({ data }: { data: TripResponse }) {
  return (
    <main className="px-4 py-8">
      <SummaryHeader summary={data.trip_summary} />

      <section className="space-y-6">
        {data.daily_itinerary_plan.map((day) => (
          <DayCard key={day.day_number} day={day} />
        ))}
      </section>

      <section className="mt-10">
        <BudgetSection budget={data.budget_analysis} />
      </section>
    </main>
  );
}
