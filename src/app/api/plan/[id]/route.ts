import { cookies } from "next/headers";
import redisClient from "@/lib/redis";

import { NextRequest, NextResponse } from "next/server";
import { PlanResult, VacationPlan } from "@/types";

function getVacationPlanById(pageId: string, plans: VacationPlan[]) {
  return plans.find((plan) => plan.id === pageId);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pageId = params.id;
    const queryParams = new URL(request.url).searchParams;
    const referer = queryParams.get("referer");
    const userId = queryParams.get("user_id");

    if (!pageId || !referer || !userId) {
      throw { error: "Invalid request", pageId, referer, userId };
    }
    const cacheKey = `user:${userId};${referer}`;

    let data = await redisClient.get(cacheKey);
    if (data) {
      const { attractions, vacationPlans } = JSON.parse(data) as Pick<
        PlanResult,
        "vacationPlans" | "attractions"
      >;
      const plan = getVacationPlanById(pageId, vacationPlans);

      if (!plan) {
        throw { error: "Plan not found" };
      }

      return Response.json(
        { plan, attractions },
        {
          status: 200,
        }
      );
    } else {
      throw { error: "Cache miss" };
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
