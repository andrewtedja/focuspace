"use client";
import React from "react";
import { useSessionStore } from "~/stores/useSessionStore";
import { signOut } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import ProtectedRoute from "~/app/_components/routes/protectedRoute";
import { WidgetManagerProvider } from "~/lib/widget-manager-provider";
import { GridStackProvider } from "~/lib/grid-stack-provider";
import { GridStackRenderProvider } from "~/lib/grid-stack-render-provider";
import MultiPageDashboard from "~/app/_components/gridCarousel";

const gridOptions = {
  acceptWidgets: true,
  margin: 8,
  cellHeight: 122,
  row: 4,
  column: 12,
  float: true,
  removable: true,
  // children: [],
};

const page = () => {
  const router = useRouter();
  const { user, logout } = useSessionStore();
  return (
    <ProtectedRoute>
      <GridStackProvider initialOptions={gridOptions}>
        <WidgetManagerProvider>
          <GridStackRenderProvider>
            <span className="break-words">
              session store: {JSON.stringify(user)}
            </span>
            <br></br>
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
            <br></br>
            <Button
              onClick={() => {
                router.push("/settings");
              }}
            >
              Go to settings
            </Button>
            <div className="h-fit w-screen px-20">
              <MultiPageDashboard></MultiPageDashboard>
            </div>
          </GridStackRenderProvider>
        </WidgetManagerProvider>
      </GridStackProvider>
    </ProtectedRoute>
  );
};

export default page;
