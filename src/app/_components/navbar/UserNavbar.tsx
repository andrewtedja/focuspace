"use client";
import { useRouter } from "next/navigation";
import { User, LogOut, Settings, HelpCircle, ChevronDown } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const UserNavbar = () => {
  const router = useRouter();

  return (
    <nav className="fixed z-50 w-full bg-gray-950/90 px-6 py-4 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* logo Sementara */}
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          </div>
          <span className="text-xl font-bold">FocuSpace</span>
        </div>

        {/* Links */}
        <div className="items-center space-x-8 text-sm">
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

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center space-x-2 rounded-full bg-gray-800 px-3 py-2 transition-colors hover:bg-gray-700"
            >
              <Avatar className="h-8 w-8 border-0">
                <AvatarImage
                  src="/placeholder.svg?height=32&width=32"
                  alt="User"
                />
                <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-600">
                  <User size={16} />
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline">
                Username
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="mt-1 w-56 border-gray-700 bg-gray-800"
            align="end"
          >
            <DropdownMenuLabel className="text-gray-400">
              <p className="text-xs">Signed in as</p>
              <p className="truncate font-medium">user@example.com</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuGroup className="text-white hover:text-white">
              <DropdownMenuItem
                className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700"
                onClick={() => router.push("/profile")}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Your Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700"
                onClick={() => router.push("/settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700"
                onClick={() => router.push("/help")}
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem
              className="cursor-pointer text-red-400 hover:bg-gray-700 focus:bg-gray-700 focus:text-red-400"
              onClick={() => {
                // Add logout logic here
                router.push("/auth/login");
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default UserNavbar;
