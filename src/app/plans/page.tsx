/* eslint-disable @next/next/no-img-element */

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PlansInfiniteScroll } from "@/components/PlansInfiniteScroll";
import { PlanResult } from "@/types";
import axios from "axios";
import { ImageCarousel } from "./ImageCarousel";
import { cookies } from "next/headers";

async function getData(
  searchParams: string,
  userId: string
): Promise<PlanResult | null> {
  try {
    const api = axios.create({
      baseURL: "http://localhost:8101",
      withCredentials: true, // Include credentials (cookies) in requests
    });
    const url = `/api/plan?${searchParams}&user_id=${userId}`;
    // const url = `http://localhost:8101/api/dummy?${searchParams}`;
    const res = await api.get(url);
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export interface PlanSearchParams extends URLSearchParams {
  home: string;
  destination: string;
  year: string;
  country_code: string;
}

export default async function Page({
  searchParams,
}: {
  searchParams: PlanSearchParams;
}) {
  const cookieStore = cookies();
  const userId = cookieStore.get("userid");

  if (!userId?.value) {
    return <div>No User ID</div>;
  }

  const searchParamsStr = String(new URLSearchParams(searchParams));
  const planResonse = await getData(searchParamsStr, userId.value);

  if (!planResonse) {
    return <div>Error loading plans</div>;
  }

  const { currentPage, totalPages, totalPlans, vacationPlans, attractions } =
    planResonse;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Header />
      {!planResonse ? (
        <div>Error loading plans</div>
      ) : (
        <>
          <ImageCarousel
            images={[
              ...attractions
                .filter((i) => i.photos && i.photos.length && i.photos[0].url)
                .map((i) => i.photos[0].url!),
            ]}
          >
            <div className="text-center text-white py-20">
              <h1 className="text-4xl lg:text-6xl font-bold mb-4 [text-shadow:_0_.25rem_0_rgb(0_0_0_/_100%)]">
                Discover Your Perfect Vacation
              </h1>
              <p className="text-xl lg:text-2xl mb-8 [text-shadow:_0_.15rem_0_rgb(0_0_0_/_100%)]">
                Explore our carefully crafted vacation plans &amp; <br />
                make the most out of your holidays.
              </p>
            </div>
          </ImageCarousel>
          <PlansInfiniteScroll
            className="-mt-[calc(100vh/2.25)] z-10 ml-8 mr-4"
            searchParams={searchParamsStr}
            vacationPlans={vacationPlans}
            currentPage={currentPage}
            totalPages={totalPages}
            totalPlans={totalPlans}
            home={searchParams.home}
            destination={searchParams.destination}
            year={searchParams.year}
            userId={userId.value}
          />
        </>
      )}
      <Footer />
    </main>
  );
}
