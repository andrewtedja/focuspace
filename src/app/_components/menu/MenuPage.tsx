"use client";
import { useState } from "react";
import { Search, Plus, ArrowRight, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

const MenuPageDark = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const router = useRouter();

  // database: id, name, desc, backgroundImage, category, isFavorite
  const [rooms, setRooms] = useState([
    {
      id: 1,
      name: "Cozy Dorm",
      desc: "Gentle sounds and a calm atmosphere for focus",
      backgroundImage: "/images/spaces/placeholder/room1.png",
      isFavorite: false,
    },
    {
      id: 2,
      name: "Rainy Jazz Cafe",
      desc: "Cozy cafe with gentle sounds and jazz music",
      backgroundImage: "/images/spaces/placeholder/cafe.jpg",
      isFavorite: false,
    },
    {
      id: 3,
      name: "Focus Room",
      desc: "Minimalist environment with ambient noise",
      backgroundImage: "/images/spaces/placeholder/adhd-2.jpg",
      isFavorite: false,
    },
    {
      id: 4,
      name: "Traveler's Rest",
      desc: "Dark theme for evening",
      backgroundImage: "/images/spaces/placeholder/traveler.png",
      isFavorite: false,
    },
    {
      id: 5,
      name: "focusroom",
      desc: "Distraction-free writing",
      backgroundImage: "/images/spaces/placeholder/lofi.jpg",
      isFavorite: false,
    },
    {
      id: 6,
      name: "focusroom",
      desc: "Interactive experiments",
      backgroundImage: "/images/spaces/placeholder/lofi.jpg",
      isFavorite: false,
    },
    {
      id: 7,
      name: "focusroom",
      desc: "Specialized fonts and audio",
      backgroundImage: "/images/spaces/placeholder/lofi.jpg",
      isFavorite: false,
    },
    {
      id: 8,
      name: "focusroom",
      desc: "Structured environment",
      backgroundImage: "/images/spaces/placeholder/lofi.jpg",
      isFavorite: false,
    },
    {
      id: 9,
      name: "focusroom",
      desc: "Soothing pink noise",
      backgroundImage: "/images/spaces/placeholder/lofi.jpg",
      isFavorite: false,
    },
    {
      id: 10,
      name: "focusroom",
      desc: "White noise background",
      backgroundImage: "/images/spaces/placeholder/lofi.jpg",
      isFavorite: false,
    },
    {
      id: 11,
      name: "focusroom",
      desc: "Immersive timeline",
      backgroundImage: "/images/spaces/placeholder/lofi.jpg",
      isFavorite: false,
    },
    {
      id: 12,
      name: "focusroom",
      desc: "Colorful space with ideas",
      backgroundImage: "/images/spaces/placeholder/lofi.jpg",
      isFavorite: false,
    },
    {
      id: 13,
      name: "focusroom",
      desc: "Task-oriented environment",
      backgroundImage: "/images/spaces/placeholder/lofi.jpg",
      isFavorite: false,
    },
    {
      id: 14,
      name: "focusroom",
      desc: "Organized space with notes",
      backgroundImage: "/images/spaces/placeholder/lofi.jpg",
      isFavorite: false,
    },
    {
      id: 15,
      name: "focusroom",
      desc: "Minimal distractions",
      backgroundImage: "/images/spaces/placeholder/lofi.jpg",
      isFavorite: false,
    },
    {
      id: 16,
      name: "focusroom",
      desc: "Collaborative environment",
      backgroundImage: "/images/spaces/placeholder/lofi.jpg",
      isFavorite: false,
    },
    {
      id: 17,
      name: "focusroom",
      desc: "Creative environment",
      backgroundImage: "/images/spaces/placeholder/lofi.jpg",
      isFavorite: false,
    },
    {
      id: 18,
      name: "focusroom",
      desc: "Curated instrumental playlists",
      backgroundImage: "/images/spaces/placeholder/lofi.jpg",
      isFavorite: false,
    },
    {
      id: 19,
      name: "focusroom",
      desc: "Bright environment",
      backgroundImage: "/images/spaces/placeholder/lofi.jpg",
      isFavorite: false,
    },
  ]);

  const toggleFavorite = (id: number) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id === id) {
          return {
            ...room,
            isFavorite: !room.isFavorite,
          };
        } else {
          return room;
        }
      }),
    );
  };

  const filteredRooms =
    activeFilter === "favorites"
      ? rooms.filter((room) => room.isFavorite)
      : [...rooms].sort((a, b) => Number(b.isFavorite) - Number(a.isFavorite));

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
            <div className="mb-4 flex items-center">
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
                className="ml-4 flex min-w-[160px] items-center justify-center rounded-full bg-[#86B3D1] px-4 py-3 text-sm font-medium text-white transition-all hover:bg-[#96bedb]"
              >
                <Plus size={18} className="mr-1.5" />
                <span className="whitespace-nowrap">Create Space</span>
              </button>
            </div>
          </div>
        </div>

        {/* Rooms grid */}
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-3">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              // space groups
              <div
                key={room.id}
                // onClick={() => router.push(`/room/${room.id}?`)}
                onClick={() => router.push(`/room`)} // temporary
                className="animated-border group relative mt-2 cursor-pointer overflow-visible rounded-xl bg-[#2D3748] shadow-md shadow-black/65 transition-all duration-500 hover:scale-105 hover:shadow-[#63B3ED]/20"
              >
                <div
                  className="relative aspect-[4/3] overflow-hidden rounded-xl bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${room.backgroundImage})`,
                    padding: "1rem",
                  }}
                >
                  {/* overlay (adjust yang via kalau mo ubah) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/50 to-transparent transition-all group-hover:via-[#000000]/30" />

                  <div className="absolute bottom-0 left-0 right-0 px-6 py-1 transition-all duration-300 group-hover:-translate-y-[2rem] group-hover:pb-6">
                    <h3 className="text-2xl font-semibold text-[#E2E8F0]">
                      {room.name}
                    </h3>

                    {/* Description shows on hover */}
                    <p className="mt-1 line-clamp-2 translate-y-2 text-sm text-[#E2E8F0] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {room.desc}
                    </p>
                  </div>

                  {/* Arrow button (stays in place) */}
                  <button className="absolute bottom-5 right-5 z-10 transform rounded-full bg-[#63B3ED] p-1.5 text-[#0F172A] opacity-0 transition-all duration-300 hover:bg-[#90CDF4] group-hover:opacity-100">
                    <ArrowRight size={16} />
                  </button>
                  {/* star btn */}
                  <button
                    className="group absolute right-5 top-5 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(room.id);
                    }}
                  >
                    <Star
                      size={24}
                      className={clsx("transition-all", {
                        "fill-yellow-500 text-yellow-500": room.isFavorite,
                        "text-[#CBD5E0] hover:text-yellow-500":
                          !room.isFavorite,
                      })}
                    />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 flex flex-col items-center justify-center p-10">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF8FF]">
                <Search size={28} className="text-[#4A90E2]" />
              </div>
              <span className="text-lg font-medium text-[#4A90E2]">
                No rooms found
              </span>
            </div>
          )}

          {filteredRooms.length > 0 && (
            <div className="group relative mt-2 flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-xl border border-[#CBD5E0] bg-white p-4 backdrop-blur-sm transition-all hover:border-[#4A90E2] hover:shadow-lg hover:shadow-[#4A90E2]/10">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF8FF] transition-colors group-hover:bg-[#BEE3F8]">
                <Plus size={28} className="text-[#4A90E2]" />
              </div>
              <span className="text-lg font-medium text-[#4A90E2]">
                Create new space
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MenuPageDark;
