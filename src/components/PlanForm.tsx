"use client";

import { useState } from "react";
import AddressAutocomplete, { AddressOption } from "./AddressAutocomplete";
import { MonthPicker } from "./MonthPicker";
import { YearPicker } from "./YearPicker";
import { useRouter } from "next/navigation";

export function PlanForm() {
  const router = useRouter();

  const [home, setHome] = useState<AddressOption | null>(null);
  const [destination, setDestination] = useState<AddressOption | null>(null);
  const [month, setMonth] = useState<string | null>(null);
  const [year, setYear] = useState<string>(String(new Date().getFullYear()));

  function handleSubmit() {
    if (!home || !destination) {
      return;
    }
    const params = {
      country_code: home.countryCode,
      home: `${home.latitude}:${home.longitude}`,
      destination: `${destination.latitude}:${destination.longitude}`,
      year: String(year),
    };
    const searchParams = new URLSearchParams(params);
    router.push(`/plans?${searchParams}`);
  }

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <label htmlFor="residence" className="text-lg">
          Tell us where you&apos;re calling home:
        </label>
        <AddressAutocomplete
          placeholder="Enter your home city address..."
          onValueChange={(address) => address && setHome(address)}
        />
      </div>
      <div>
        <label htmlFor="destination" className="text-lg">
          Where does your wanderlust take you?
        </label>
        <AddressAutocomplete
          placeholder="Enter destination..."
          onValueChange={(address) => address && setDestination(address)}
        />
      </div>
      <div>
        <label htmlFor="dates" className="text-lg">
          When does your wanderlust plan be?
        </label>
        <div className="flex flex-row space-x-6 mt-2">
          <MonthPicker onMonthSelect={(month) => month && setMonth(month)} />
          <YearPicker
            value={year}
            onYearSelect={(year) => year && setYear(year)}
          />
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="rounded-lg border-0 bg-violet-900 px-6 py-3 text-base text-white shadow-lg shadow-slate-300 transition hover:bg-violet-300 hover:text-slate-900 hover:shadow-violet-300 dark:bg-violet-300 dark:text-black dark:shadow-sm dark:shadow-violet-300 dark:hover:bg-violet-400 sm:py-2"
      >
        Discover Your Perfect Getaway!
      </button>
    </div>
  );
}
