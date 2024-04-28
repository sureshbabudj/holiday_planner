/* eslint-disable @next/next/no-img-element */
import { Place } from "@/app/api/plan/places";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PlanCard } from "@/components/PlanCard";
import { VacationPlan } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";

interface PlanResponse {
  plan: VacationPlan;
  attractions: Place[];
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
  if (!params.id) {
    return <div>Invalid plan id</div>;
  }

  const cookieStore = cookies();
  const userId = cookieStore.get("userid");
  const searchParamsStr = String(new URLSearchParams(searchParams));

  if (!userId) {
    return <div>User Id not there</div>;
  }

  const planResonse = await getData(params.id, searchParamsStr, userId?.value);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Header />
      {!planResonse ? (
        <div>Error loading plans</div>
      ) : (
        <PlanCard data={planResonse.plan} />
      )}
      <Footer />
    </main>
  );
}
