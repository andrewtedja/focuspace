"use client";

import React from "react";
import { useSessionStore } from "~/stores/useSessionStore";
import { signOut } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import ProtectedRoute from "~/app/_components/routes/protectedRoute";
import GridCarouselLayout from "~/app/_components/gridCarousel";
import { WidgetManagerProvider } from "~/lib/widget-manager-provider";

const Page = () => {
  const router = useRouter();
  const { user, logout } = useSessionStore();

  return (
    <ProtectedRoute>
      <div className="h-screen w-full">
        {/* <span className="break-words">
          session store: {JSON.stringify(user)}
        </span>
        <div className="flex gap-4 py-4">
          <Button
            onClick={async () => {
              try {
                await signOut().then(() => logout());
              } catch (error) {
                console.log(error);
              }
            }}
          >
            Sign Out
          </Button>
          <Button
            onClick={() => {
              router.push("/settings");
            }}
          >
            Go to settings
          </Button>
        </div> */}
        <WidgetManagerProvider>
          <GridCarouselLayout />
        </WidgetManagerProvider>
      </div>
    </ProtectedRoute>
  );
};

export default Page;
