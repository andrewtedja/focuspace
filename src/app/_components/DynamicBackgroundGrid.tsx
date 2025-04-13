"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import GridCarouselLayout from "~/app/_components/gridCarousel";
import { initialRooms } from "~/data/rooms";
import { api } from "~/trpc/react";
import { useSessionStore } from "~/stores/useSessionStore";

const DynamicBackgroundGrid = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idFromParams = Number(searchParams.get("id"));
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  const { user } = useSessionStore();
  const { data: userData, isLoading: isUserLoading } =
    api.user.getUserById.useQuery({
      id: user?.id ?? "",
    });

  useEffect(() => {
    if (isUserLoading) return;

    const isCustomPage = idFromParams === 7;

    if (isCustomPage) {
      const bg = userData?.bg as string | undefined;
      if (typeof bg === "string" && bg.trim() !== "") {
        setBackgroundImage(bg);
      } else {
        router.push("/dashboard");
      }
    } else {
      const initialRoom = initialRooms.find((room) => room.id === idFromParams);
      const bg = initialRoom?.backgroundImage;
      if (typeof bg === "string" && bg.trim() !== "") {
        setBackgroundImage(bg);
      } else {
        router.push("/dashboard");
      }
    }
  }, [idFromParams, isUserLoading, userData, router]);

  if (isUserLoading || backgroundImage === null) {
    return null; // avoid rendering until fully ready
  }

  return (
    <div
      className="relative h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-black"
        style={{ opacity: 0 }}
      />
      <div className="relative z-10 h-full w-full">
        <GridCarouselLayout />
      </div>
    </div>
  );
};

export default DynamicBackgroundGrid;
