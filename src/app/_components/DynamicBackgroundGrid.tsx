"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import GridCarouselLayout from "~/app/_components/gridCarousel";
import { useWidgetManager } from "~/lib/widget-manager-context";

const DynamicBackgroundGrid = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idFromParams = Number(searchParams.get("id"));
  const [isLoading, setIsLoading] = useState(true);

  const { pages, currentPageId, addPage } = useWidgetManager();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Debug logging
  //   console.log("ID from params:", idFromParams);
  //   console.log("Available pages:", pages);
  //   console.log("Current page ID in context:", currentPageId);

  // Find the page in the pages array
  const currentPage = pages.find((page) => page.id === idFromParams);

  // Redirect to the homepage if the page doesn't exist
  useEffect(() => {
    if (!isLoading && !currentPage && idFromParams !== 0) {
      console.error(
        `Page with ID ${idFromParams} not found. Pages available:`,
        pages,
      );
      const timer = setTimeout(() => router.push("/dashboard"), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentPage, idFromParams, router, isLoading, pages]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <h2 className="text-xl font-medium">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!currentPage) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-bold">Room not found</h2>
          <p>
            The requested room could not be found. Redirecting to Dashboard...
          </p>
        </div>
      </div>
    );
  }

  const backgroundImage =
    currentPage?.backgroundImage ?? "/images/spaces/placeholder/cozers.png";
  const overlayOpacity = currentPage?.backgroundOverlayOpacity ?? 0;

  return (
    <div
      className="relative h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity / 100 }}
      />
      <div className="relative z-10 h-full w-full">
        <GridCarouselLayout />
      </div>
    </div>
  );
};

export default DynamicBackgroundGrid;
