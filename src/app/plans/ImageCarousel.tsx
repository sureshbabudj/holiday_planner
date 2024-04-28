/* eslint-disable @next/next/no-img-element */

"use client";
import {
  ArrowLeft,
  ArrowLeftCircle,
  ArrowRight,
  ArrowRightCircle,
} from "lucide-react";
import React, { useState } from "react";

interface props {
  images: string[];
}

export const ImageCarousel = ({
  images,
  children,
}: React.PropsWithChildren<props>) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full h-screen">
      <div className="overflow-hidden h-3/4">
        <div className="">
          <img
            className=" w-full object-fill object-end top-0"
            src={images[currentImageIndex]}
            alt={`Image ${currentImageIndex + 1}`}
          />
        </div>
      </div>
      <div className="gradient h-10 w-full bottom-0"></div>
      <div className="absolute top-0 left-0 w-full h-full flex justify-center p-6 z-20">
        {children}
      </div>
      <div className="absolute top-0 left-0 w-full h-full flex justify-between items-center px-6 z-30">
        <button
          className="text-white bg-black rounded-full p-1 opacity-30 hover:opacity-100 text-xs"
          onClick={prevImage}
        >
          <ArrowLeft />
        </button>

        <button
          className="text-white bg-black rounded-full p-1 opacity-30 hover:opacity-100 text-xs"
          onClick={nextImage}
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  );
};
