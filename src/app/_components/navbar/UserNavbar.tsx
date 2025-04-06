"use client";
import { useRouter } from "next/navigation";
import { User, LogOut, Settings, HelpCircle, ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";
import { useSessionStore } from "~/stores/useSessionStore";
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
  const { user, logout } = useSessionStore();

  return (
    <nav className="sticky top-0 z-50 flex h-20 w-full items-center bg-[#F5F7FA] px-6 text-[#2D3748] shadow-sm backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Logo */}
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#86B3D1] to-[#95BAAA]"></div>
          </div>
          <span className="text-xl font-bold text-[#2D3748]">FocuSpace</span>
        </div>

        <div className="hidden items-center space-x-6 md:flex">
          <a
            onClick={() => router.push("/")}
            className="px-2 py-1 text-[#4A5568] transition-colors hover:text-[#7B9EA8]"
          >
            Dashboard
          </a>
          <a
            onClick={() => router.push("/")}
            className="px-2 py-1 text-[#4A5568] transition-colors hover:text-[#7B9EA8]"
          >
            My Space
          </a>
          <a
            onClick={() => router.push("/")}
            className="px-2 py-1 text-[#4A5568] transition-colors hover:text-[#7B9EA8]"
          >
            AI Buddy
          </a>
          <a
            onClick={() => router.push("/")}
            className="px-2 py-1 text-[#4A5568] transition-colors hover:text-[#7B9EA8]"
          >
            Discover
          </a>
          <a
            onClick={() => router.push("/")}
            className="px-2 py-1 text-[#4A5568] transition-colors hover:text-[#95BAAA]"
          >
            Pricing
          </a>
        </div>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center space-x-2 rounded-full bg-[#E9EEF2] px-4 py-2 hover:bg-[#A7BBC7]/30 focus:outline-none"
            >
              <Avatar className="h-8 w-8 border-0">
                <AvatarImage
                  src="/placeholder.svg?height=32&width=32"
                  alt="User"
                />
                <AvatarFallback className="bg-gradient-to-r from-[#86B3D1] to-[#95BAAA] text-white">
                  <User size={16} />
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium text-[#2D3748] md:inline">
                Hi, {user?.name}
              </span>
              <ChevronDown className="h-4 w-4 text-[#718096]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="mt-1 w-64 rounded-xl border-[#E9EEF2] bg-white shadow-md"
            align="end"
          >
            <DropdownMenuLabel className="text-[#718096]">
              <p className="text-xs">Signed in as</p>
              <p className="truncate font-medium text-[#4A5568]">
                {user?.email}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#E9EEF2]" />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer text-[#4A5568] hover:bg-[#F5F7FA] focus:bg-[#f5f7fa]"
                onClick={() => router.push("/profile")}
              >
                <User className="mr-2 h-4 w-4 text-[#86B3D1]" />
                <span>Your Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-[#4A5568] hover:bg-[#F5F7FA] focus:bg-[#F5F7FA]"
                onClick={() => router.push("/settings")}
              >
                <Settings className="mr-2 h-4 w-4 text-[#95BAAA]" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-[#4A5568] hover:bg-[#F5F7FA] focus:bg-[#F5F7FA]"
                onClick={() => router.push("/help")}
              >
                <HelpCircle className="mr-2 h-4 w-4 text-[#A7BBC7]" />
                <span>Help & Support</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-[#E9EEF2]" />
            <DropdownMenuItem
              className="cursor-pointer text-[#f1523d] hover:bg-[#F5F7FA] focus:bg-[#F5F7FA] focus:text-[#d9675a]"
              onClick={async () => {
                try {
                  await signOut({}).then(() => logout());
                } catch (error) {
                  console.log(error);
                }
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
