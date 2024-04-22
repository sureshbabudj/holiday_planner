import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PlansInfiniteScroll } from "@/components/PlansInfiniteScroll";
import { PlanResult, VacationPlan } from "@/types";
import axios from "axios";

async function getData(searchParams: string): Promise<PlanResult | null> {
  try {
    // const url = `http://localhost:8101/api/plan?${searchParams}`;
    const url = `http://localhost:8101/api/dummy?${searchParams}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: URLSearchParams;
}) {
  const searchParamsStr = String(new URLSearchParams(searchParams));
  const planResonse = await getData(searchParamsStr);

  if (!planResonse) {
    return <div>Error loading plans</div>;
  }

  const { currentPage, totalPages, totalPlans, vacationPlans } = planResonse;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Header />
      <PlansInfiniteScroll
        searchParams={searchParamsStr}
        vacationPlans={vacationPlans}
        currentPage={currentPage}
        totalPages={totalPages}
        totalPlans={totalPlans}
      />
      <Footer />
    </main>
  );
}
