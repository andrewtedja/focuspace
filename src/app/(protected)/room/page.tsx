import React from "react";
import ProtectedRoute from "~/app/_components/routes/protectedRoute";
import DynamicBackgroundGrid from "~/app/_components/DynamicBackgroundGrid";
import AiBuddy from "~/app/_components/chatbot/AiBuddy";
import { WidgetManagerProvider } from "~/lib/widget-manager-provider";

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
