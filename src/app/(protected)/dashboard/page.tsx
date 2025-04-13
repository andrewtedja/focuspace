import { HydrateClient } from "~/trpc/server";
import UserNavbar from "~/app/_components/navbar/UserNavbar";
import { useSessionStore } from "~/stores/useSessionStore";
import ProtectedRoute from "~/app/_components/routes/protectedRoute";
import MenuPage from "~/app/_components/menu/MenuPage";
import Footer from "~/app/_components/footer/Footer";
import { WidgetManagerProvider } from "~/lib/widget-manager-provider";

const Home = () => {
  return (
    <WidgetManagerProvider>
      <ProtectedRoute>
        <div className="min-h-screen bg-white text-white">
          <UserNavbar />
          <MenuPage />
          <Footer />
        </div>
      </ProtectedRoute>
    </WidgetManagerProvider>
  );
};

export default Home;
