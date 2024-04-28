"use client";

import { PlanResult, VacationPlan } from "@/types";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { PlanCard } from "./PlanCard";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import PlanDetail from "@/app/plans/PlanDetail";
import { useRouter } from "next/navigation";
import { PlanSearchParams } from "@/app/plans/page";

interface PlansInfiniteScrollProps
  extends Pick<PlanSearchParams, "home" | "destination" | "year"> {
  vacationPlans: VacationPlan[];
  currentPage: number;
  searchParams: string;
  totalPages: number;
  totalPlans: number;
  className?: string;
  userId: string;
}

export function PlansInfiniteScroll({
  vacationPlans,
  currentPage,
  searchParams,
  totalPages,
  className = "",
  destination,
  home,
  year,
  userId,
  totalPlans,
}: PlansInfiniteScrollProps) {
  const [plans, setPlans] = useState<VacationPlan[]>(vacationPlans);
  const [page, setPage] = useState(currentPage);
  const [hasMore, setHasMore] = useState(totalPages !== currentPage);
  const [openPlan, setOpenPlan] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<null | VacationPlan>(null);

  const loader = useRef(null);

  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const api = axios.create({
          baseURL: "http://localhost:8101",
          withCredentials: true, // Include credentials (cookies) in requests
        });
        const url = `/api/plan?${searchParams}&page=${page}&user_id=${userId}`;
        // const url = `http://localhost:8101/api/dummy?${searchParams}&page=${page}`;
        const res = await api.get(url);
        const vacationPlansResponse = res.data as PlanResult;
        setHasMore(totalPages !== page);
        setPlans((prevData) => [
          ...prevData,
          ...vacationPlansResponse.vacationPlans,
        ]);
      } catch (error) {
        console.error(error);
        return null;
      }
    };
    if (page === currentPage) {
      return;
    }
    loadData();
    console.log({ hasMore });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    // Intersection Observer callback
    const handleObserver: IntersectionObserverCallback = (entities) => {
      const target = entities[0];
      if (target.isIntersecting) {
        setPage((prev) => prev + 1);
      }
    };

    // Options for the Intersection Observer
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    // Create an observer instance linked to the callback function
    const observer = new IntersectionObserver(handleObserver, options);

    // Observe the loader element
    if (loader.current) {
      observer.observe(loader.current);
    }

    // Clean up the observer on component unmount
    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, []);

  const handlePlanClick = (plan: VacationPlan) => {
    if (!home || !destination || !year) {
      return;
    }

    const param = {
      referer: `home:${home.replace(":", ",")};desti:${destination.replace(
        ":",
        ","
      )};year:${year}`,
    };

    const searchParams = new URLSearchParams(param);
    router.push(`/plans/${plan.id}?${searchParams}`);
  };

  return (
    <div className={cn([className])}>
      <div className="flex flex-row items-stretch flex-wrap">
        {plans &&
          plans.map((plan) => (
            <PlanCard
              data={plan}
              key={plan.id}
              onClick={() => handlePlanClick(plan)}
            />
          ))}
      </div>

      {hasMore && (
        <div ref={loader}>
          <Skeleton className="h-10 w-full"></Skeleton>
        </div>
      )}

      {selectedPlan && (
        <PlanDetail
          plan={selectedPlan}
          open={openPlan}
          onClose={() => {
            setSelectedPlan(null);
            setOpenPlan(!openPlan);
          }}
        />
      )}
    </div>
  );
}
