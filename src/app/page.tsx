import { HydrateClient } from "~/trpc/server";
import LandingPage from "./_components/landing-page/LandingPage";

import GuestNavbar from "./_components/navbar/GuestNavbar";
import UserNavbar from "./_components/navbar/UserNavbar";
export default async function Home() {
  return (
    <HydrateClient>
      <div className="min-h-[200vh] bg-gray-950 text-white">
        {/* <div className="pointer-events-none fixed h-full w-full overflow-hidden">
          <div className="absolute left-1/4 top-1/3 h-64 w-64 animate-pulse rounded-full bg-sky-600 opacity-20 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/3 h-96 w-96 animate-pulse rounded-full bg-blue-600 opacity-10 blur-3xl delay-700"></div>
        </div> */}

        <GuestNavbar />
        {/* <UserNavbar /> */}
        <LandingPage />
      </div>
    </HydrateClient>
  );
}
