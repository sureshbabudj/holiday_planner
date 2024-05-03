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
      <div className="mb-8 w-full sm:mb-0 hidden md:block sm:w-1/2 sm:pl-4 md:pl-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Plan Your Dream Vacation Around This Year's Holidays"
          className="rounded-lg sm:rounded-br-[80px] sm:rounded-tl-[120px]"
          src="https://images.unsplash.com/photo-1613425653628-23fd58c3c2b1?q=80&w=600"
        />
      </div>
      <div className="mr-4 w-full text-center sm:w-1/2 sm:text-left">
        <h1 className="mb-6 text-3xl font-bold leading-tight dark:text-slate-50 md:text-4xl bg-gradient-to-r from-indigo-400 to-pink-600 bg-clip-text text-transparent">
          Plan Your Dream Vacation Around This Year&apos;s Holidays{" "}
          <span className="relative whitespace-nowrap text-violet-500 dark:text-violet-300">
            <svg
              aria-hidden="true"
              viewBox="0 0 418 42"
              className="absolute top-2/3 left-0 h-[0.58em] w-full fill-violet-500 dark:fill-orange-300/60"
              preserveAspectRatio="none"
            >
              <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.780 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.540-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.810 23.239-7.825 27.934-10.149 28.304-14.005 .417-4.348-3.529-6-16.878-7.066Z"></path>
            </svg>
            <span className="relative">with AI</span>
          </span>
        </h1>

        <div className="mb-2 leading-relaxed text-slate-400 dark:text-slate-400">
          Tired of the same old routine?
          <div className="text-violet-700 text-xl mb-4">
            Let&apos;s unlock the world&apos;s hidden gems all while maximizing
            your precious vacation days.
          </div>
        </div>
        <PlanForm />
        <blockquote className="mt-10 p-4 text-center">
          <p className="mt-1 text-xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-xl">
            Not all those
            <span className="px-2 py-1 relative inline-block">
              <svg
                className="stroke-current bottom-0 absolute text-rose-300 -translate-x-2"
                viewBox="0 0 410 18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6.4c16.8 16.8 380.8-11.2 397.6 5.602"
                  stroke-width="12"
                  fill="none"
                  fill-rule="evenodd"
                  stroke-linecap="round"
                ></path>
              </svg>
              <span className="relative">who wander</span>
            </span>
            are lost
          </p>
        </blockquote>
      </div>
    </section>
  );
}
