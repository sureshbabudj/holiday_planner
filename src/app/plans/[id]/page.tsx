import { Place } from "@/app/api/plan/places";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { VacationPlan } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";
import { PlanDetails } from "./PlanDetails";
import { PlaceDetails } from "@/app/api/places/details/route";

export interface PlanResponse {
  plan: VacationPlan;
  attractions: Place[];
  home: PlaceDetails;
  destination: PlaceDetails;
}

async function getData(
  pageId: string,
  searchParams: string,
  userId: string
): Promise<PlanResponse | null> {
  try {
    const api = axios.create({
      baseURL: "http://localhost:8101",
      withCredentials: true, // Include credentials (cookies) in requests
    });
    const url = `/api/plan/${pageId}?${searchParams}&user_id=${userId}`;
    const res = await api.get(url);
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: URLSearchParams;
}) {
  async function getPlan(): Promise<{
    planResponse: PlanResponse | null;
    error: Error | null;
  }> {
    try {
      if (!params.id) {
        throw { message: "Invalid plan id" };
      }

      const cookieStore = cookies();
      const userId = cookieStore.get("userid");
      const searchParamsStr = String(new URLSearchParams(searchParams));

      if (!userId) {
        throw { message: "User Id not available" };
      }

      const planResponse = await getData(
        params.id,
        searchParamsStr,
        userId?.value
      );
      if (!planResponse) {
        throw { message: "No plan available for the request" };
      }
      return { planResponse, error: null };
    } catch (error: any) {
      return { planResponse: null, error };
    }
  }

  const { planResponse, error } = await getPlan();
  let html;
  if (!planResponse) html = <div>{error?.message}</div>;
  else html = <PlanDetails plan={planResponse} />;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Header />
      {html}
      <Footer />
    </main>
  );
}
