import { Rating, VacationPlan } from "@/types";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { ItineraryPlace } from "@/app/api/plan/places";
import { ScrollArea } from "./ui/scroll-area";
import React from "react";
import { BusIcon, Car, EyeIcon, Plane, Ship, Train } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@radix-ui/react-hover-card";

interface PlanCardProps {
  data: VacationPlan;
}

function RatingHoverCard({ text, rating }: { text: string; rating: Rating }) {
  const ratingKeys = Object.keys(rating);
  const getRatingKeyLabel = (value: string) => {
    switch (value) {
      case "ratioRating":
        return "Holidays Included";
      case "travelTimeRating":
        return "Travel Time";
      case "moreDaysRating":
        return "Duration";
      case "shortSweetRating":
        return "Plesentful";
      default:
        return "Over All Rating";
    }
  };
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <a className="text-sm text-muted-foreground cursor-pointer hover:text-violet-900">
          {text}
        </a>
      </HoverCardTrigger>
      <HoverCardContent className="w-fit">
        <div className="flex flex-col justify-between bg-white text-slate-500 shadow-lg border border-slate-100 p-4">
          {ratingKeys.map((key, i) => (
            <div
              className={cn([
                {
                  "border-t border-t-slate-200 pt-2":
                    i === ratingKeys.length - 1,
                },
                "flex flex-row mb-3 last:mb-0 items-center",
              ])}
              key={key}
            >
              <RatingIcon
                ratingLabel={getRatingLabel(rating[key as keyof Rating])}
                ratingValue={rating[key as keyof Rating]}
                className="text-sm"
              />
              <div className="text-md mr-2">
                <div className="text-sm text-gray-500">
                  {getRatingKeyLabel(key)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

function RatingIcon({
  ratingValue,
  ratingLabel,
  className = "",
}: {
  ratingValue: number;
  ratingLabel: string;
  className?: string;
}) {
  return (
    <div
      className={cn([
        {
          "bg-green-800": ratingLabel === "Highly Recommended",
          "bg-red-400": ratingLabel === "Not Recommended",
          "bg-green-600": ratingLabel === "Recommended",
          "bg-yellow-600": ratingLabel === "Moderate",
        },
        "text-md mr-2 rounded-md text-slate-50 p-2 flex justify-center",
        className,
      ])}
    >
      <span>{Number(ratingValue).toFixed(2)}</span>
    </div>
  );
}

function getRatingLabel(rating: number) {
  let ratingLabel = "";
  if (rating >= 9) {
    ratingLabel = "Highly Recommended";
  } else if (rating >= 7) {
    ratingLabel = "Recommended";
  } else if (rating >= 5) {
    ratingLabel = "Moderate";
  } else {
    ratingLabel = "Not Recommended";
  }
  return ratingLabel;
}

function RatingLabel({ rating }: { rating: Rating }) {
  const hoverText = `Based on ${Object.keys(rating).length} ratings`;
  const ratingLabel = getRatingLabel(rating.overallRating);
  return (
    <div className="flex flex-row justify-center items-center">
      <RatingIcon
        ratingLabel={ratingLabel}
        ratingValue={rating.overallRating}
      />
      <div className="text-md mr-2">
        <div className="text-sm text-gray-500">{ratingLabel}</div>
        <div className="text-sm text-gray-300">
          <RatingHoverCard text={hoverText} rating={rating} />
        </div>
      </div>
    </div>
  );
}

function TransportIcon({ transport }: { transport: string }) {
  switch (transport) {
    case "bus":
      return <BusIcon />;
    case "train":
      return <Train />;
    case "flight":
      return <Plane />;
    case "boat":
      return <Ship />;
    default:
      return <Car />;
  }
}

export function PlanCard({ data }: PlanCardProps) {
  const {
    itinerary,
    holidaysIncluded,
    tags,
    rating,
    sightseeingPlans,
    id: planId,
  } = data;

  // Function to format the date in a suitable form for the title
  const formatTitleDate = (date: string) => {
    const parts = date.split("-");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const attractions: ItineraryPlace[] = [];
  sightseeingPlans.forEach((plan) => attractions.push(...plan.placesToVisit));

  // Function to generate a paragraph based on tags and ratings
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
    <div className="xl:w-[calc(25%-1rem)] lg:w-[calc(33%-1rem)] md:w-[calc(50%-1rem)] sm:w-full mr-4 last:mr-0 mb-5 shadow-md rounded-lg text-slate-600 border border-slate-200">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="h-56 w-full object-cover object-end rounded-tl-lg rounded-tr-lg"
        src={itinerary.image}
        alt="Home in Countryside"
      />
      <div className=" min-h-10 rounded-bl-lg rounded-br-lg py-2">
        <div className="px-4 mb-5">
          <h2 className="text-lg font-bold text-slate-700">
            {itinerary.title}
          </h2>
          <span className="text-sm block mb-1">
            {formatTitleDate(itinerary.fromDate)} -{" "}
            {formatTitleDate(itinerary.toDate)}
          </span>
        </div>

        <div className="flex flex-row mb-2 justify-between px-4 mb-5">
          <RatingLabel rating={rating} />
          <div className="flex flex-row justify-center items-center">
            <div className="text-md mr-2 rounded-md bg-violet-400 text-slate-50 p-2 flex justify-center">
              <TransportIcon transport={itinerary.transportMode} />
            </div>
            <div className="text-md mr-2">
              {itinerary.travelTimeInHours} hours
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-500 px-4">{generateDescription()}</p>
        <div className="px-4 mb-2">
          <div className="text-sm text-slate-500">
            This plan utilises the holidays{" "}
            {holidaysIncluded.map((holiday) => (
              <span
                key={holiday.date}
                className="bg-slate-100 text-slate-400 text-xs px-1 py-[2px] me-1 last:me-0 inline-block rounded"
              >
                {holiday.name}
              </span>
            ))}
          </div>
        </div>

        <div className="border border-t-slate-50 border-b-slate-100 my-4" />

        <div className="px-4 mb-2">
          <div className="text-sm text-slate-500">
            Perfect for you, If you like
          </div>
          <div className="flex flex-row space-x-1 my-2">
            {tags.map((tag) => (
              <div
                key={tag}
                className="bg-slate-200 text-slate-700 text-xs px-2 py-1 rounded "
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        <div className="border border-t-slate-50 border-b-slate-100 mt-4 mb-2" />

        <div className="px-4 flex justify-center">
          <Button
            variant="default"
            className="w-full text-dark text-sm p-2 bg-blue-50 hover:bg-blue-200"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}
