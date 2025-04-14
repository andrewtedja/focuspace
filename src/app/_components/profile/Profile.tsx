"use client";
import { useState } from "react";
import Image from "next/image";
import { Pencil, Gem, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const ProfileSection = () => {
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const [selectedFont, setSelectedFont] = useState("Lexend");

  const fontOptions = [
    { id: "Lexend", display: "Lexend" },
    { id: "Open Dyslexic", display: "Open Dyslexic" },
  ];

  return (
    <div className="fixed inset-0 z-10 flex h-full w-full flex-col items-center justify-center rounded-none bg-[url('/images/spaces/placeholder/adhd-2.jpg')] bg-cover bg-center bg-no-repeat text-center shadow-lg backdrop-blur-sm">
      <div className="absolute inset-0 z-[-1] bg-black/85"></div>
      <div
        className="group relative mb-6 h-64 w-64 overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-lg transition-transform duration-300 hover:scale-105"
        onMouseEnter={() => setIsAvatarHovered(true)}
        onMouseLeave={() => setIsAvatarHovered(false)}
      >
        <Image
          fill
          className="object-cover"
          src="/images/spaces/placeholder/zen.jpg"
          alt="Profile Picture"
        />
        {/* <div
          className={`absolute bottom-4 left-0 right-0 cursor-pointer bg-gradient-to-t from-black/80 to-black/40 py-2 text-xs font-medium text-white backdrop-blur-sm transition-all ${
            isAvatarHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Pencil className="mx-auto mb-1 h-4 w-4" />
          Change Photo
        </div> */}
      </div>
      {/*  Name  */}
      <h1 className="relative m-0 text-3xl font-bold tracking-tight text-[#F8F8FF]">
        Name
      </h1>

      <div className="mt-4 flex justify-center gap-3">
        <div className="relative flex items-center rounded-full bg-[#FFD397] px-5 py-2 text-base font-medium text-black shadow-sm">
          <Gem className="mr-1.5 h-5 w-5" />
          <span className="font-semibold">Plus++</span>
        </div>

        {/* Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="to- inline-flex items-center gap-2 rounded-full bg-[#A2B6A0] px-5 py-2 text-base font-medium text-white shadow-sm transition-all">
              <span>Chosen Font:</span>
              <span className="font-semibold">{selectedFont}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 cursor-pointer rounded-xl border-gray-200 shadow-lg duration-200 animate-in fade-in-80">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-base font-medium text-gray-500">
                Choose Font Style
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {fontOptions.map((font) => (
                <DropdownMenuItem
                  key={font.id}
                  onSelect={() => setSelectedFont(font.id)}
                  className={`flex items-center justify-between hover:bg-gray-50 ${
                    selectedFont === font.id
                      ? "bg-indigo-50 text-indigo-600"
                      : ""
                  }`}
                >
                  <span>{font.display}</span>
                  {selectedFont === font.id && (
                    <span className="text-indigo-600">
                      <Check size={20} />
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ProfileSection;
