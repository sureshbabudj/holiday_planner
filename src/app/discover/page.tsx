/* eslint-disable @next/next/no-img-element */
import React from "react";
import { ImageCarousel } from "../plans/ImageCarousel";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const ImageCarouselWrap = () => {
  return (
    <div className="flex flex-col lg:flex-row w-full overflow-hidden flex-grow">
      {/* Image Carousel */}
      <div className="lg:w-1/2 lg:max-w-1/2 lg:overflow-hidden xl:w-1/2 xl:max-w-1/2 xl:overflow-hidden">
        <ImageCarousel
          images={[
            "https://via.placeholder.com/800x600",
            "https://via.placeholder.com/800x600",
            "https://via.placeholder.com/800x600",
          ]}
        />
      </div>
      {/* Content Column */}
      <div className="lg:w-1/2 lg:max-w-1/2 lg:overflow-y-auto xl:w-1/2 xl:max-w-1/2 xl:overflow-y-auto">
        {/* Content here */}
        <div className="h-96 overflow-y-auto min-h-[1600px]">
          {/* Add your content here */}
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <main className="">
      <div className="flex flex-col h-screen justify-between">
        <Header />
        <div className="flex flex-row h-full relative">
          <div className="h-full w-[40%] absolute top-0 left-0">
            <img
              className="h-full object-cover"
              src="https://via.placeholder.com/800x600"
              alt=""
            />
          </div>
          <div className="flex-grow min-h-full h-[2000px] ms-[40%]">
            Content
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Page;
