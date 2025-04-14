import React from "react";
import UserNavbar from "~/app/_components/navbar/UserNavbar";
import ProfileSection from "~/app/_components/profile/Profile";

const page = () => {
  return (
    <div>
      <UserNavbar />
      <ProfileSection />
    </div>
  );
};

export default page;
