"use client";
import { useState, useEffect } from "react";
import { Search, Plus, ArrowRight, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import CreateSpaceModal from "./CreateSpaceModal";
import { initialRooms } from "~/data/rooms";
import { motion } from "framer-motion";

const MenuPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [rooms, setRooms] = useState(initialRooms);
  // * Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

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

  const handleCreateSpace = () => {
    router.push(`/room?id=7`);
  };

  const getFilteredRooms = () => {
    let filtered = [...rooms];

    if (activeFilter === "favorites") {
      filtered = filtered.filter((room) => room.isFavorite);
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((room) =>
        room.name.toLowerCase().includes(query),
      );
    }

    return filtered.sort((a, b) => Number(b.isFavorite) - Number(a.isFavorite));
  };

  const filteredRooms = getFilteredRooms();

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
      <main className="container relative mx-auto px-4 py-12">
        <div>
          <div className="mb-8">
            <div className="mb-4 inline-block rounded-full border border-[#6183ac]/30 bg-[#F5F7FA] px-4 py-1.5 text-sm font-medium text-[#4A5568]">
              For Neurodivergent Minds
            </div>

            <h1 className="mb-2 text-5xl font-bold tracking-tight">
              Your{" "}
              <span className="relative">
                <span className="z-5 relative bg-gradient-to-r from-[#63B3ED] to-[#48BB78] bg-clip-text text-transparent">
                  learning
                </span>
                <span className="absolute bottom-0 left-0 z-0 h-2 w-full bg-gradient-to-r from-[#63B3ED]/20 to-[#48BB78]/20 blur-sm"></span>
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
                  className={`flex items-center rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
                    activeFilter === category.id
                      ? "bg-[#86B3D1] text-[#F8F8FF] hover:bg-[#96bedb]"
                      : "bg-[#1E293B] text-[#CBD5E0]"
                  }`}
                >
                  {category.icon && category.icon}
                  {category.name}
                </button>
              ))}
            </div>

            <div className="mb-4 flex items-center">
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search rooms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-[#BCD0D7] bg-[#F8F8FF] py-2 pl-10 pr-4 text-sm shadow-sm transition-all focus:border-[#86B3D1] focus:outline-none focus:ring-2 focus:ring-[#86B3D1]/20"
                />
                <Search
                  size={18}
                  className="absolute left-3 top-2.5 text-[#7B9EA8]"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="ml-4 flex min-w-[160px] items-center justify-center rounded-full bg-gradient-to-r from-[#86B3D1] to-[#7EB6A4] px-4 py-3 text-sm font-medium text-[#F8F8FF] shadow-sm transition-all hover:from-[#89b6d3] hover:to-[#95d4c0] hover:shadow-md"
              >
                <Plus size={18} className="mr-1.5" />
                <span className="whitespace-nowrap">Create Your Space</span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-2 h-72 animate-pulse rounded-xl bg-[#E2E8F0]"
              ></motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-5">
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                // space groups
                <motion.div
                  key={room.id}
                  onClick={() => router.push(`/room?id=${room.id}`)}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/50 to-transparent transition-all group-hover:via-[#000000]/20" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 transition-all duration-300 group-hover:-translate-y-[2rem]">
                      <h3 className="text-2xl font-semibold text-[#E2E8F0]">
                        {room.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-[#E2E8F0]">
                        {room.desc}
                      </p>
                    </div>

                    {/* Arrow button (stays in place) */}
                    <motion.button
                      className="absolute bottom-5 right-5 z-10 transform rounded-full bg-[#63B3ED] p-1.5 text-[#0F172A] opacity-0 transition-all duration-300 hover:bg-[#90CDF4] group-hover:opacity-100"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowRight size={20} />
                    </motion.button>
                    {/* star btn */}
                    <motion.button
                      className="group absolute right-5 top-5 group-hover:opacity-100"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(room.id);
                      }}
                    >
                      <Star
                        size={24}
                        className={clsx("transition-all", {
                          "opaci fill-yellow-500 text-yellow-500":
                            room.isFavorite,
                          "text-[#CBD5E0] opacity-0 hover:text-yellow-500 group-hover:opacity-100":
                            !room.isFavorite,
                        })}
                      />
                    </motion.button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="col-span-3 flex flex-col items-center justify-center p-10"
              >
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF8FF]">
                  <Search size={28} className="text-[#4A90E2]" />
                </div>
                <span className="text-lg font-medium text-[#4A90E2]">
                  No rooms found
                </span>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setSearchQuery("")}
                    className="mt-3 rounded-full bg-[#EDF2F7] px-4 py-1.5 text-sm text-[#4A5568]"
                  >
                    Clear search
                  </motion.button>
                )}
              </motion.div>
            )}

            {filteredRooms.length > 0 && (
              <div
                onClick={() => setIsModalOpen(true)}
                className="group relative mt-2 flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-xl border border-[#CBD5E0] bg-[#F8F8FF] p-4 backdrop-blur-sm transition-all hover:border-[#4A90E2] hover:shadow-lg hover:shadow-[#4A90E2]/10"
              >
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF8FF] transition-colors group-hover:bg-[#BEE3F8]">
                  <Plus size={28} className="text-[#4A90E2]" />
                </div>
                <span className="text-lg font-medium text-[#4A90E2]">
                  Create new space
                </span>
              </div>
            )}
          </div>
        )}
      </main>

      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#E0F2FE]/90 to-transparent"></div>

      {/* Create Space Modal */}
      <CreateSpaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateSpace={handleCreateSpace}
      />
    </div>
  );
};

export default MenuPage;
