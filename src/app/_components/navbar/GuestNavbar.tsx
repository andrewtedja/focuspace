"use client";
import { useRouter } from "next/navigation";

const GuestNavbar = () => {
  const router = useRouter();

  return (
    <nav className="z-1000 fixed w-full bg-gray-950/90 px-6 py-4 text-white backdrop-blur-md">
      {/* left */}
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* logo Sementara */}
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          </div>
          <span className="text-xl font-bold">FocuSpace</span>
        </div>

        <div className="items-center space-x-8">
          <a
            onClick={() => router.push("/")}
            className="text-sm font-normal transition-colors hover:text-indigo-400"
          >
            Home
          </a>
          <a
            onClick={() => router.push("/")}
            className="text-sm font-normal transition-colors hover:text-indigo-400"
          >
            Features
          </a>
          <a
            onClick={() => router.push("/")}
            className="text-sm font-normal transition-colors hover:text-indigo-400"
          >
            About Us
          </a>
          <a
            onClick={() => router.push("/")}
            className="text-sm font-normal transition-colors hover:text-indigo-400"
          >
            Community
          </a>
          <a
            onClick={() => router.push("/")}
            className="text-sm font-normal text-[#ffed93] transition-all hover:text-opacity-80"
          >
            Pricing
          </a>
        </div>

        <div className="flex items-center space-x-4">
          <button
            className="rounded-md bg-gray-800 px-6 py-3 text-sm font-medium transition-colors hover:bg-gray-700"
            onClick={() => router.push("/auth/login")}
          >
            Sign In
          </button>
          <button
            className="rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-medium text-white transition-all hover:from-indigo-500 hover:to-purple-500"
            onClick={() => router.push("/auth/login")}
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default GuestNavbar;
