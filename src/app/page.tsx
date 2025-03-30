import { HydrateClient } from "~/trpc/server";
import LandingGuest from "./_components/landing-page/LandingGuest";

import GuestNavbar from "./_components/navbar/GuestNavbar";
export default async function Home() {
  return (
    <HydrateClient>
      <div className="min-h-[200vh] bg-white text-white">
        <GuestNavbar />
        <LandingGuest />
      </div>
    </HydrateClient>
  );
}
