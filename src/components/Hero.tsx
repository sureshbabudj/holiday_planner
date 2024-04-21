import { CheckIcon } from "lucide-react";
import React from "react";
import { PlanForm } from "./PlanForm";

const benefits: string[] = [
  "Various types of coffee beans",
  "Coworking area",
  "Meeting room",
];

export default function Hero() {
  return (
    <section className="container mx-auto flex flex-col items-center px-8 py-16 sm:flex-row-reverse sm:px-12">
      <div className="mb-8 w-full sm:mb-0 sm:w-1/2 sm:pl-4 md:pl-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Plan Your Dream Vacation Around This Year's Holidays"
          className="rounded-lg sm:rounded-br-[80px] sm:rounded-tl-[120px]"
          src="https://images.unsplash.com/photo-1613425653628-23fd58c3c2b1?q=80&w=600"
        />
      </div>
      <div className="mr-4 w-full text-center sm:w-1/2 sm:text-left">
        <h1 className="mb-6 text-3xl font-bold leading-tight dark:text-slate-50 md:text-4xl">
          Plan Your Dream Vacation Around This Year&apos;s Holidays!
        </h1>
        <div className="mb-2 leading-relaxed text-slate-400 dark:text-slate-400">
          Tired of the same old routine?
          <div className="text-violet-700 text-xl mb-4">
            Let&apos;s unlock the world&apos;s hidden gems all while maximizing
            your precious vacation days.
          </div>
        </div>
        <PlanForm />
        <blockquote className="mt-10 p-4 my-4 bg-gray-50 border-l-4 border-gray-300">
          <p className="text-xl italic font-medium leading-relaxed text-gray-900">
            Not all those who wander are lost. - J.R.R. Tolkien
          </p>
        </blockquote>
      </div>
    </section>
  );
}
