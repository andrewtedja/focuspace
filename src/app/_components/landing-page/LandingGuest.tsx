"use client";
import React, { useEffect, useState } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import Features from "./Features";
import Image from "next/image";
import clsx from "clsx";

import Rating from "./Rating";
import CTA from "./CTA";
import Footer from "../footer/Footer";
import Pricing from "./Pricing";

const LandingPage = () => {
  const [displaySpace, setDisplaySpace] = useState(0);

  const spaces = [
    {
      name: "Flow Room",
      description: "Unlock deep focus with zero distractions",
      imagePath: "/images/spaces/adhd-3.png",
    },
    {
      name: "Zen Garden",
      description:
        "Find inner peace with soothing rain and crackling fireplace",
      imagePath: "/images/spaces/adhd-3.png",
    },
    {
      name: "Rainy Jazz Cafe",
      description: "Relax with the smooth sounds of jazz and gentle rain",
      imagePath: "/images/spaces/adhd-3.png",
    },
    {
      name: "Traveler's Rest",
      description: "Take a break with the warm feel of a campfire",
      imagePath: "/images/spaces/adhd-3.png",
    },
    {
      name: "Lo-Fi Room",
      description: "Study with Lo-Fi girl & Lo-Fi music",
      imagePath: "/images/spaces/adhd-3.png",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplaySpace((prev) => (prev + 1) % spaces.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [spaces.length]);

  return (
    <main className="bg-[#BCD0D7] text-[#2D3748]">
      <div className="min-h-screen bg-[#BCD0D7] py-20 text-[#2D3748]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div className="space-y-8">
              <div>
                <div className="mb-4 inline-block rounded-full border border-[#86B3D1]/30 bg-[#E9EEF2] px-4 py-1.5 text-sm font-medium text-[#7B9EA8]">
                  For Neurodivergent Minds
                </div>
                <p className="mb-3 text-4xl font-bold tracking-tight md:text-6xl">
                  Your{" "}
                  <span className="bg-gradient-to-r from-[#5A8CA3] to-[#4d6b90] bg-clip-text text-transparent">
                    perfect
                  </span>
                </p>
                <p className="mb-2 text-6xl font-bold tracking-tight">
                  learning
                </p>
                <p className="mb-4 text-6xl font-bold tracking-tight">
                  environment
                </p>
                <p className="max-w-md text-lg text-[#4A5568] md:text-xl">
                  Focus, Learn, and Thrive
                </p>
              </div>

              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <button className="group flex items-center justify-center rounded-full bg-[#86B3D1] px-6 py-3 font-medium text-white transition-all hover:scale-105 hover:bg-[#8fbecb] hover:shadow-lg hover:shadow-[#86B3D1]/30 active:bg-[#86B3D1]">
                  <span>Create Your Space</span>
                  <ChevronRight
                    size={18}
                    className="ml-2 transition-transform group-hover:translate-x-1"
                  />
                </button>
                <button className="group relative overflow-hidden rounded-full border border-[#A7BBC7] bg-white px-6 py-3 text-[#7B9EA8]">
                  <span className="absolute inset-0 w-0 bg-[#9ebb89] transition-all duration-300 ease-out group-hover:w-full group-active:bg-[#8da779]"></span>
                  <span className="relative transition-colors duration-300 ease-out group-hover:text-[#F9FBFD]">
                    Explore Spaces
                  </span>
                </button>
              </div>
            </div>

            <div className="relative h-96 overflow-hidden rounded-2xl shadow-2xl shadow-gray-950/50">
              {spaces.map((space, index) => (
                <div
                  key={index}
                  className={clsx(
                    "duration-1500 absolute inset-0 transition-opacity",
                    {
                      "z-10 opacity-100": index === displaySpace,
                      "z-0 opacity-0": index !== displaySpace,
                    },
                  )}
                >
                  s
                  <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#000000]/100 to-transparent opacity-100"></div>
                  <Image
                    src={space.imagePath}
                    alt={space.name}
                    fill
                    className="h-full w-full object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute bottom-0 left-0 z-30 p-6">
                    <h3 className="mb-2 text-2xl font-bold text-white">
                      {space.name}
                    </h3>
                    <p className="max-w-md text-[#F5F7FA]">
                      {space.description}
                    </p>
                  </div>
                </div>
              ))}

              <div className="absolute bottom-6 right-6 z-30 flex space-x-2">
                {spaces.map((_, index) => (
                  <button
                    key={index}
                    className={clsx("h-2 w-2 rounded-full transition-all", {
                      "w-6 bg-white": index === displaySpace,
                      "bg-white/40": index !== displaySpace,
                    })}
                    onClick={() => setDisplaySpace(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Features />
      <Rating />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
};

export default LandingPage;
