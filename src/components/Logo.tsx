import React from "react";
import { Agbalumo } from "next/font/google";
import { cn } from "@/lib/utils";
import { TreePalmIcon } from "lucide-react";

const logoFont = Agbalumo({ subsets: ["latin"], weight: ["400"] });

export function Logo() {
  return (
    <div
      className={cn(
        logoFont.className,
        "flex flex-row w-full text-xl font-extrabold sm:w-fit items-center"
      )}
    >
      <span className="rounded-lg bg-violet-500 text-white w-8 h-8 p-1 me-2">
        <TreePalmIcon />
      </span>
      <span className="text-violet-500">Holiday</span>
      <span className="dark:text-slate-300">Planner</span>
    </div>
  );
}
