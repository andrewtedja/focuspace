import React from "react";
import UserNavbar from "~/app/_components/navbar/UserNavbar";
import ProfileSection from "~/app/_components/profile/Profile";
import ProtectedRoute from "~/app/_components/routes/protectedRoute";

const page = () => {
  return (
    <div>
      <ProtectedRoute>
        <UserNavbar />
        <ProfileSection />
      </ProtectedRoute>
    </div>
  );
};

export default page;
