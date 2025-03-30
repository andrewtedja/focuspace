import { HydrateClient } from "~/trpc/server";
import LandingUser from "~/app/_components/landing-page/LandingUser";
import UserNavbar from "~/app/_components/navbar/UserNavbar";
import { useSessionStore } from "~/stores/useSessionStore";

const Home = () => {
  return (
    <div className="min-h-[200vh] bg-white text-white">
      <UserNavbar />
      <LandingUser />
    </div>
  );
};

export default Home;
