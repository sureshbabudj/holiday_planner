import { PlaceDetails } from "@/app/api/places/details/route";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const debounce = <T extends (...args: any[]) => any>(
  callback: T,
  waitFor: number
) => {
  let timeout: any = 0;
  return (...args: Parameters<T>): ReturnType<T> => {
    let result: any;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      result = callback(...args);
    }, waitFor);
    return result;
  };
};

export function findCountry(details: PlaceDetails): string | undefined {
  const countryComponent = details.result.address_components.find((component) =>
    component.types.includes("country")
  );
  return countryComponent?.short_name;
}
