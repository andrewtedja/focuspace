import { HydrateClient } from "~/trpc/server";
// import LandingPage from "./_components/landing-page/LandingPage";

import GuestNavbar from "./_components/navbar/GuestNavbar";
import UserNavbar from "./_components/navbar/UserNavbar";
export default async function Home() {
  return (
    <HydrateClient>
      <div className="min-h-screen bg-[#0E131E] text-white">
        <GuestNavbar />
        {/* <UserNavbar /> */}
      </div>
    </HydrateClient>
  );
}
