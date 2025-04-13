"use client";
import { useState } from "react";
import Image from "next/image";
import { Pencil, Cog, Share } from "lucide-react";

const ProfileSection = () => {
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  return (
    <div className="mb-8 flex flex-col items-center text-center">
      <div
        className="relative mb-6 h-36 w-36 overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-lg"
        onMouseEnter={() => setIsAvatarHovered(true)}
        onMouseLeave={() => setIsAvatarHovered(false)}
      >
        <Image
          fill
          className="object-cover"
          src="/images/avatars/avatar-placeholder.png"
          alt="Profile Picture"
        />
        <div
          className={`absolute bottom-0 left-0 right-0 cursor-pointer bg-black bg-opacity-60 py-2 text-sm text-white transition-opacity ${
            isAvatarHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          Change Photo
        </div>
      </div>

      {/* Profile Name */}
      <h1 className="m-0 text-3xl font-bold text-gray-900">dsa</h1>

      {/* Profile Badges */}
      <div className="mt-2 flex justify-center gap-2">
        <div className="inline-flex items-center rounded-full bg-indigo-600 px-3 py-1 text-xs font-medium text-white">
          <Pencil className="mr-1 h-3.5 w-3.5" />
          Member since 2020
        </div>
        <div className="inline-flex items-center rounded-full border border-indigo-600 px-3 py-1 text-xs font-medium text-indigo-600">
          <Cog className="mr-1 h-3.5 w-3.5" />
          Pro User
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-2">
        <button className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
          <Pencil className="mr-2 h-4 w-4" />
          Edit Profile
        </button>
        <button className="inline-flex items-center justify-center rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
          <Cog className="mr-2 h-4 w-4" />
          Settings
        </button>
        <button className="inline-flex items-center justify-center rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
          <Share className="mr-2 h-4 w-4" />
          Share
        </button>
      </div>
    </div>
  );
};

export default ProfileSection;
