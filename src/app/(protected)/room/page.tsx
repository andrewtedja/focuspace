import React from "react";
import ProtectedRoute from "~/app/_components/routes/protectedRoute";
import DynamicBackgroundGrid from "~/app/_components/DynamicBackgroundGrid";

// Main page component
const Page = () => {
  return (
    <ProtectedRoute>
      <DynamicBackgroundGrid />
    </ProtectedRoute>
  );
};

export default Page;
