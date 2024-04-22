"use client";

import { PlanResult, VacationPlan } from "@/types";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { PlanCard } from "./PlanCard";
import { Skeleton } from "./ui/skeleton";

interface PlansInfiniteScrollProps {
  vacationPlans: VacationPlan[];
  currentPage: number;
  searchParams: string;
  totalPages: number;
  totalPlans: number;
}

export function PlansInfiniteScroll({
  vacationPlans,
  currentPage,
  searchParams,
  totalPages,
  totalPlans,
}: PlansInfiniteScrollProps) {
  const [plans, setPlans] = useState<VacationPlan[]>(vacationPlans);
  const [page, setPage] = useState(currentPage);
  const [hasMore, setHasMore] = useState(totalPages !== currentPage);

  const loader = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const url = `http://localhost:8101/api/plan?${searchParams}&page=${page}`;
        // const url = `http://localhost:8101/api/dummy?${searchParams}&page=${page}`;
        const res = await axios.get(url);
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

  return (
    <div className="w-full">
      <div className="container mx-auto flex w-full items-stretch py-4 px-6 flex-wrap">
        {plans && plans.map((plan) => <PlanCard data={plan} key={plan.id} />)}
      </div>

      {hasMore && (
        <div ref={loader} className="container mx-auto">
          <Skeleton className="h-10 w-full"></Skeleton>
        </div>
      )}
    </div>
  );
}
