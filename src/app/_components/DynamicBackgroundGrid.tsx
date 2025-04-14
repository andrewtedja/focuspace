"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import GridCarouselLayout from "~/app/_components/gridCarousel";
import { initialRooms } from "~/data/rooms";
import { api } from "~/trpc/react";
import { useSessionStore } from "~/stores/useSessionStore";
import { WidgetManagerProvider } from "~/lib/widget-manager-provider";
import { SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "./app_sidebar";
import AiBuddy from "./chatbot/AiBuddy";

const PrivateBackground = () => {
  const router = useRouter();
  const { user } = useSessionStore();

  const { data: userData, isLoading } = api.user.getUserById.useQuery({
    id: user?.id ?? "",
  });

  if (isLoading) return null;

  const customBg = userData?.bg;
  if (!customBg) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div
      className="relative h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${customBg})` }}
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

const PublicBackground = ({ id }: { id: number }) => {
  const router = useRouter();

  const room = initialRooms.find((r) => r.id === id);
  const bg = room?.backgroundImage;

  if (!bg) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div
      className="relative h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
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

const DynamicBackgroundGrid = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idFromParams = Number(searchParams.get("id"));
  const [, setAddingPage] = useState(false);
  const [, setRemovingPage] = useState(false);
  const [disabled] = useState(false);

  useEffect(() => {
    if (
      idFromParams !== 7 &&
      (idFromParams < 1 || idFromParams > initialRooms.length + 1)
    ) {
      router.push("/dashboard");
    }
  }, [idFromParams, router]);

  if (idFromParams === 7) {
    return (
      <WidgetManagerProvider>
        <AiBuddy>
          <SidebarProvider>
            <AppSidebar
              setAddingPage={setAddingPage}
              setRemovingPage={setRemovingPage}
              disabled={disabled}
            />
            <PrivateBackground></PrivateBackground>
          </SidebarProvider>
        </AiBuddy>
      </WidgetManagerProvider>
    );
  }

  if (idFromParams >= 1 && idFromParams <= initialRooms.length + 1) {
    return (
      <WidgetManagerProvider>
        <AiBuddy>
          <SidebarProvider>
            <AppSidebar
              setAddingPage={setAddingPage}
              setRemovingPage={setRemovingPage}
              disabled={disabled}
            />
            <PublicBackground id={idFromParams}></PublicBackground>
          </SidebarProvider>
        </AiBuddy>
      </WidgetManagerProvider>
    );
  }

  // Just return null when redirecting (so we don't see a flash of UI)
  return null;
};

export default DynamicBackgroundGrid;
