import { HydrateClient } from "~/trpc/server";
import LandingUser from "~/app/_components/landing-page/LandingUser";
import UserNavbar from "~/app/_components/navbar/UserNavbar";
import { useSessionStore } from "~/stores/useSessionStore";
import ProtectedRoute from "~/app/_components/routes/protectedRoute";

const Home = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-[200vh] bg-white text-white">
        <UserNavbar />
        <LandingUser />
      </div>
    </ProtectedRoute>
  );
};

export default Home;
