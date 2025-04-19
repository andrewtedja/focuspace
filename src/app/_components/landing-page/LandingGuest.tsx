"use client";
import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import Features from "./Features";
import Image from "next/image";
import clsx from "clsx";
import Rating from "./Rating";
import CTA from "./CTA";
import Footer from "../footer/Footer";
import Pricing from "./Pricing";
import { useRouter } from "next/navigation";
import About from "./About";
import { motion } from "framer-motion";

const LandingPage = () => {
  const [displaySpace, setDisplaySpace] = useState(0);
  const router = useRouter();
  const spaces = [
    {
      name: "Cozy Dorm",
      description: "Gentle sounds and a calm atmosphere for focus",
      imagePath: "/images/spaces/placeholder/1.png",
    },
    {
      name: "Riverside Room",
      description: "Minimalist environment with ambient noise",
      imagePath: "/images/spaces/placeholder/cozers.png",
    },
    {
      name: "Rainy Jazz Cafe",
      description: "Relax with the smooth sounds of jazz and gentle rain",
      imagePath: "/images/spaces/placeholder/2.jpg",
    },
    {
      name: "Flow Room",
      description: "Unlock deep focus with zero distractions",
      imagePath: "/images/spaces/placeholder/adhd-2.jpg",
    },
    {
      name: "Lo-Fi Space",
      description: "Study with Lo-Fi girl & Lo-Fi music",
      imagePath: "/images/spaces/placeholder/lofi.png",
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
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <div className="mb-4 inline-block rounded-full border border-[#86B3D1]/30 bg-[#E9EEF2] px-5 py-2 text-sm font-medium text-[#7B9EA8] shadow-sm">
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

              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
                <button
                  className="group flex items-center justify-center rounded-full bg-[#86B3D1] px-6 py-3 font-medium text-white transition-transform duration-200 hover:scale-105 hover:bg-[#8fbecb] hover:shadow-lg hover:shadow-[#86B3D1]/30 active:bg-[#86B3D1]"
                  onClick={() => router.push("/dashboard")}
                >
                  <span>Create Your Space</span>
                  <ChevronRight
                    size={18}
                    className="ml-2 transition-transform group-hover:translate-x-1"
                  />
                </button>
                <button
                  className="group relative overflow-hidden rounded-full border border-[#A7BBC7] bg-white px-6 py-3 text-[#7B9EA8] transition-colors duration-300"
                  onClick={() => router.push("/dashboard")}
                >
                  <span className="absolute inset-0 w-0 bg-[#9ebb89] transition-all ease-out group-hover:w-full group-active:bg-[#8da779]"></span>
                  <span className="relative transition-colors group-hover:text-[#F9FBFD]">
                    View Demo
                  </span>
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative h-96 overflow-hidden rounded-2xl shadow-2xl shadow-gray-950/50"
            >
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
                  <div className="absolute inset-0 z-20 bg-gradient-to-t from-black to-transparent opacity-90"></div>
                  <Image
                    src={space.imagePath}
                    alt={space.name}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute bottom-0 left-0 z-30 p-6">
                    <h3 className="mb-2 text-2xl font-bold text-white drop-shadow-lg">
                      {space.name}
                    </h3>
                    <p className="max-w-md text-[#F5F7FA] drop-shadow">
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
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <motion.div
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              exit={{ x: 100 }}
              transition={{ duration: 0.5 }}
              className="mt-8 rounded-2xl border border-[#E9EEF2] bg-white/80 p-6 shadow-lg backdrop-blur-sm"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-between md:flex-row"
              >
                <motion.div
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  exit={{ y: -100 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-wrap justify-center gap-8 md:justify-start"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center md:items-start"
                  >
                    <span className="bg-gradient-to-r from-[#5A8CA3] to-[#4d6b90] bg-clip-text text-3xl font-bold text-transparent">
                      10k+
                    </span>
                    <span className="text-sm text-gray-600">Active Users</span>
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center md:items-start"
                  >
                    <span className="bg-gradient-to-r from-[#5A8CA3] to-[#4d6b90] bg-clip-text text-3xl font-bold text-transparent">
                      4.9
                    </span>
                    <div className="flex items-center">
                      <div className="mr-1 flex items-center text-yellow-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className="text-sm">
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center md:items-start"
                  >
                    <span className="bg-gradient-to-r from-[#5A8CA3] to-[#4d6b90] bg-clip-text text-3xl font-bold text-transparent">
                      96%
                    </span>
                    <span className="text-sm text-gray-600">
                      Focus Improvement
                    </span>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <Features />
      <About />
      <Rating />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
};

export default LandingPage;
