import UserNavbar from "~/app/_components/navbar/UserNavbar";
import ProtectedRoute from "~/app/_components/routes/protectedRoute";
import MenuPage from "~/app/_components/menu/MenuPage";
import Footer from "~/app/_components/footer/Footer";

const Home = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white text-white">
        <UserNavbar />
        <MenuPage />
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Home;
