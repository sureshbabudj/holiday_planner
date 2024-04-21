import { VacationPlan } from "@/types";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Place } from "@/app/api/plan/places";
import { ScrollArea } from "./ui/scroll-area";

interface PlanCardProps {
  data: VacationPlan;
}

export function PlanCard({ data }: PlanCardProps) {
  const { itinerary, holidaysIncluded, tags, rating, sightseeingPlans } = data;

  // Function to format the date in a suitable form for the title
  const formatTitleDate = (date: string) => {
    const parts = date.split("-");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  // Function to generate a paragraph based on tags and ratings
  const generateDescription = () => {
    let description = "";
    // Example descriptions based on tags
    if (tags.includes("pricy")) {
      description += "This vacation plan is pricy, ";
    } else {
      description += "This vacation plan is economical, ";
    }
    if (tags.includes("pleasant")) {
      description += "providing a pleasant experience with ";
    } else {
      description += "which might be less pleasant due to ";
    }
    // Example descriptions based on ratings
    if (rating.moreDaysRating >= 8) {
      description +=
        "more days to travel, allowing for ample rest and relaxation. ";
    } else if (rating.moreDaysRating >= 6) {
      description += "a moderate duration for a balanced experience. ";
    } else {
      description += "a shorter duration, making it budget-friendly. ";
    }
    description += `The overall rating is ${rating.overallRating?.toFixed(2)}.`;
    return description;
  };

  const attractions: string[] = [];
  sightseeingPlans.forEach((plan) => attractions.push(...plan.placesToVisit));

  return (
    <Card className="w-[calc(33%-1rem)] mr-4 last:mr-0 mb-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="h-48 w-full object-cover object-end"
        src={itinerary.image}
        alt="Home in Countryside"
      />
      <CardHeader>
        <CardTitle>{itinerary.title}</CardTitle>
        <CardDescription>
          <div className="text-md">
            {formatTitleDate(itinerary.fromDate)} -{" "}
            {formatTitleDate(itinerary.toDate)}
          </div>
          {generateDescription()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Transport Mode:</strong> {itinerary.transportMode}
        </p>
        <p>
          <strong>Travel Time:</strong> {itinerary.travelTimeInHours} hours
        </p>
        <p>
          <strong>Rest Date:</strong> {itinerary.restDate}
        </p>

        <ScrollArea className="h-36 w-full rounded-md border my-2">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">
              Places covered:
            </h4>
            {attractions.map((place) => (
              <>
                <div key={place} className="text-sm">
                  {place}
                </div>
                <div className="my-2 border" />
              </>
            ))}
          </div>
        </ScrollArea>
        <p>
          <strong>Holidays Included:</strong>
        </p>
        <ul>
          {holidaysIncluded.map((holiday) => (
            <li key={holiday.date}>
              {holiday.name} - {holiday.date}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex justify-between">
        {tags.map((tag) => (
          <Button key={tag} variant="outline">
            {tag}
          </Button>
        ))}
      </CardFooter>
    </Card>
  );
}
