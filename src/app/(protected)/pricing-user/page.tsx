import React from "react";
import ProtectedRoute from "~/app/_components/routes/protectedRoute";
import Pricing from "~/app/_components/landing-page/Pricing";
import UserNavbar from "~/app/_components/navbar/UserNavbar";

const page = () => {
  return (
    <ProtectedRoute>
      <UserNavbar />
      <Pricing />
    </ProtectedRoute>
  );
};

export default page;
