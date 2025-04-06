"use client";
import { useState } from "react";
import { Search, Plus, ArrowRight, Star } from "lucide-react";

const MenuPageDark = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const rooms = [
    {
      id: 1,
      name: "focusroom",
      desc: "Cozy space with gentle sounds",
      backgroundImage: "/images/spaces/lofi.jpg",
    },
    {
      id: 2,
      name: "focusroom",
      desc: "Minimalist environment with soft lighting",
      backgroundImage: "/images/spaces/lofi.jpg",
    },
    {
      id: 3,
      name: "focusroom",
      desc: "Visual aids for math",
      backgroundImage: "/images/spaces/lofi.jpg",
    },
    {
      id: 4,
      name: "focusroom",
      desc: "Dark theme for evening",
      backgroundImage: "/images/spaces/lofi.jpg",
    },
    {
      id: 5,
      name: "focusroom",
      desc: "Distraction-free writing",
      backgroundImage: "/images/spaces/lofi.jpg",
    },
    {
      id: 6,
      name: "focusroom",
      desc: "Interactive experiments",
      backgroundImage: "/images/spaces/lofi.jpg",
    },
    {
      id: 7,
      name: "focusroom",
      desc: "Specialized fonts and audio",
      backgroundImage: "/images/spaces/lofi.jpg",
    },
    {
      id: 8,
      name: "focusroom",
      desc: "Structured environment",
      backgroundImage: "/images/spaces/lofi.jpg",
    },
    {
      id: 9,
      name: "focusroom",
      desc: "Soothing pink noise",
      backgroundImage: "/images/spaces/lofi.jpg",
    },
    {
      id: 10,
      name: "focusroom",
      desc: "White noise background",
      backgroundImage: "/images/spaces/lofi.jpg",
    },
    {
      id: 11,
      name: "focusroom",
      desc: "Immersive timeline",
      backgroundImage: "/images/spaces/lofi.jpg",
    },
    {
      id: 12,
      name: "focusroom",
      desc: "Colorful space with ideas",
      backgroundImage: "/images/spaces/lofi.jpg",
    },
    {
      id: 13,
      name: "focusroom",
      desc: "Task-oriented environment",
      backgroundImage: "/images/spaces/lofi.jpg",
    },
    {
      id: 14,
      name: "focusroom",
      desc: "Organized space with notes",
      backgroundImage: "/images/spaces/lofi.jpg",
    },
    {
      id: 15,
      name: "focusroom",
      desc: "Minimal distractions",
      backgroundImage: "/images/spaces/lofi.jpg",
    },
    {
      id: 16,
      name: "focusroom",
      desc: "Collaborative environment",
      backgroundImage: "/images/spaces/lofi.jpg",
    },
    {
      id: 17,
      name: "focusroom",
      desc: "Creative environment",
      backgroundImage: "/images/spaces/lofi.jpg",
    },
    {
      id: 18,
      name: "focusroom",
      desc: "Curated instrumental playlists",
      backgroundImage: "/images/spaces/lofi.jpg",
    },
    {
      id: 19,
      name: "focusroom",
      desc: "Bright environment",
      backgroundImage: "/images/spaces/lofi.jpg",
    },
  ];
  const categories = [
    { id: "all", name: "All Spaces" },
    {
      id: "favorites",
      name: "Favorites",
      icon: <Star size={14} className="mr-1" />,
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#E9EEF2] to-[#F2F5F8] pb-20 text-[#151515]">
      {/* Main content */}
      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div>
          <div className="mb-8">
            <div className="mb-4 inline-block rounded-full border border-[#6183ac]/30 bg-[#F5F7FA] px-4 py-1.5 text-sm font-medium text-[#4A5568]">
              For Neurodivergent Minds
            </div>
            <h1 className="mb-2 text-3xl font-bold">
              Your{" "}
              <span className="bg-gradient-to-r from-[#63B3ED] to-[#48BB78] bg-clip-text text-transparent">
                learning
              </span>{" "}
              spaces
            </h1>
            <p className="max-w-2xl text-gray-600">
              Select a room or create a new customized learning environment
              tailored to your cognitive preferences
            </p>
          </div>

          <div className="mt-6 flex flex-row items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveFilter(category.id)}
                  className={`flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                    activeFilter === category.id
                      ? "bg-[#86B3D1] text-[#ffffff] hover:bg-[#96bedb]"
                      : "bg-[#1E293B] text-[#CBD5E0]"
                  }`}
                >
                  {category.icon && category.icon}
                  {category.name}
                </button>
              ))}
            </div>
            {/* Search and create new room */}
            <div className="flex items-center">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search rooms..."
                  className="w-full rounded-lg border border-[#BCD0D7] bg-white py-2 pl-10 pr-4 text-sm focus:border-[#86B3D1] focus:outline-none focus:ring-2 focus:ring-[#86B3D1]/20"
                />
                <Search
                  size={18}
                  className="absolute left-3 top-2.5 text-[#7B9EA8]"
                />
              </div>
              <button
                type="button"
                className="ml-4 flex items-center rounded-full bg-[#86B3D1] px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-[#96bedb]"
              >
                <Plus size={18} className="mr-1" />
                <span>Create Space</span>
              </button>
            </div>
          </div>
        </div>

        {/* Rooms grid */}
        <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-3">
          {/* Rooms */}
          {rooms.map((room) => (
            <div
              key={room.id}
              className="animated-border relative mt-2 cursor-pointer overflow-visible rounded-xl bg-[#2D3748] shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-[#63B3ED]/20"
            >
              <div
                className="relative aspect-[4/3] overflow-hidden rounded-xl bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${room.backgroundImage})`,
                  padding: "1rem",
                }}
              >
                {/* Add the gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000] to-transparent" />

                <button className="absolute right-3 top-3 z-10 rounded-full bg-[#1E293B]/80 p-1.5 backdrop-blur-sm transition-all hover:bg-[#63B3ED]/80">
                  <Star size={16} className={"fill-[#E2E8F0]"} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-lg font-semibold text-[#E2E8F0]">
                    {room.name}
                  </h3>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="line-clamp-2 text-xs text-[#E2E8F0]">
                      {room.desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Create New Room */}
          <div className="group relative mt-2 flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-xl border border-[#CBD5E0] bg-white p-4 backdrop-blur-sm transition-all hover:border-[#4A90E2] hover:shadow-lg hover:shadow-[#4A90E2]/10">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF8FF] transition-colors group-hover:bg-[#BEE3F8]">
              <Plus size={28} className="text-[#4A90E2]" />
            </div>
            <span className="text-lg font-medium text-[#4A90E2]">
              Create new space
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MenuPageDark;
