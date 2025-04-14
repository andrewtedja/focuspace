import React from "react";
import ProtectedRoute from "~/app/_components/routes/protectedRoute";
import GridCarouselLayout from "~/app/_components/gridCarousel";
import { useWidgetManager } from "~/lib/widget-manager-context";
import AiBuddy from "~/app/_components/chatbot/AiBuddy";
import { WidgetManagerProvider } from "~/lib/widget-manager-provider";

const DynamicBackgroundGrid = () => {
  const { pages, currentPageId } = useWidgetManager();

  const currentPage = pages.find((page) => page.id === currentPageId);
  const backgroundImage =
    currentPage?.backgroundImage ?? "/images/spaces/placeholder/cozers.png";
  const overlayOpacity = currentPage?.backgroundOverlayOpacity ?? 0;

  return (
    <div
      className="relative h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* This adds a semi-transparent black overlay (customizable in sidebar) */}
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

// Main page component
const Page = () => {
  return (
    <ProtectedRoute>
      <WidgetManagerProvider>
        <AiBuddy>
          <DynamicBackgroundGrid />
        </AiBuddy>
      </WidgetManagerProvider>
    </ProtectedRoute>
  );
};

export default Page;
