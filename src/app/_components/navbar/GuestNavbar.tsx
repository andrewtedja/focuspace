"use client";
import { useRouter } from "next/navigation";

const GuestNavbar = () => {
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 flex h-20 w-full items-center bg-[#F5F7FA] px-6 text-[#2D3748] shadow-sm backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* logo */}
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#86B3D1] to-[#95BAAA]"></div>
          </div>
          <span className="text-xl font-bold text-[#2D3748]">FocuSpace</span>
        </div>

        <div className="flex items-center space-x-8">
          <a
            onClick={() => router.push("/")}
            className="text-md font-normal text-[#4A5568] transition-colors hover:text-[#7B9EA8]"
          >
            Home
          </a>
          <a
            onClick={() => router.push("/")}
            className="text-md font-normal text-[#4A5568] transition-colors hover:text-[#7B9EA8]"
          >
            Features
          </a>
          <a
            onClick={() => router.push("/")}
            className="text-md font-normal text-[#4A5568] transition-colors hover:text-[#7B9EA8]"
          >
            About Us
          </a>
          <a
            onClick={() => router.push("/")}
            className="text-md font-normal text-[#4A5568] transition-colors hover:text-[#7B9EA8]"
          >
            Community
          </a>
          <a
            onClick={() => router.push("/")}
            className="text-md font-normal text-[#4A5568] transition-colors hover:text-[#7B9EA8]"
          >
            Pricing
          </a>
        </div>

        <div className="flex items-center space-x-4">
          <button
            className="ease text-btn-base md:text-btn-lg text-trypan-blue-900 !font-body flex min-w-[180px] flex-row items-center justify-center gap-2.5 whitespace-nowrap rounded-xl border-[1px] border-black/40 bg-white p-3.5 !text-sm font-semibold transition duration-200 hover:border-black/60 hover:bg-gray-100"
            onClick={() => router.push("/auth/login")}
          >
            Sign In
          </button>
          <button
            className="ease text-md flex min-w-[180px] flex-row items-center justify-center gap-2.5 whitespace-nowrap rounded-xl bg-gradient-to-r from-[#86B3D1] to-[#95BAAA] p-3.5 font-medium text-white transition duration-200 hover:from-[#7B9EA8] hover:to-[#89AB9E]"
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
