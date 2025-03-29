import { HydrateClient } from "~/trpc/server";
import LandingPage from "./_components/landing-page/LandingPage";

import GuestNavbar from "./_components/navbar/GuestNavbar";
import UserNavbar from "./_components/navbar/UserNavbar";
export default async function Home() {
  return (
    <HydrateClient>
      <div className="min-h-[200vh] bg-gray-950 text-white">
        {/* <GuestNavbar /> */}
        <UserNavbar />
        <LandingPage />
      </div>
    </HydrateClient>
  );
}
