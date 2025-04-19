"use client";
import { useState } from "react";
import type React from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  BookOpen,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  Boxes,
  Wallpaper,
  CopyPlus,
  Gem,
  Minus,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import Image from "next/image";
import { useWidgetManager } from "~/lib/widget-manager-context";
import AddWidgetButton from "./addWidgetButton";
import { useSessionStore } from "~/stores/useSessionStore";
import { signOut } from "next-auth/react";
import BackgroundModal from "./BackgroundModal";

const mainItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Focus Room",
    url: "",
    icon: BookOpen,
  },
  {
    title: "My Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "Get Plus++",
    url: "/pricing",
    icon: Gem,
    className:
      "glow relative overflow-hidden bg-gradient-to-r from-[#86B3D1] to-[#7EB6A4] text-white transition-all duration-300 ease-out  hover:shadow-xl hover:shadow-[#86B3D1]/50  hover:text-[#f7f7f7] active:shadow-none active:text-[#f7f7f7]",
  },
];

export function AppSidebar({
  collapsible = "icon",
  setAddingPage,
  setRemovingPage,
  ...props
}: {
  collapsible?: "offcanvas" | "icon" | "none";
  setAddingPage?: (val: boolean) => void;
  setRemovingPage?: (val: boolean) => void;
  disabled?: boolean;
} & React.ComponentProps<typeof Sidebar>) {
  const [open, setOpen] = useState(false);
  const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);
  const router = useRouter();
  const { currentPageId } = useWidgetManager();
  const { user, logout } = useSessionStore();

  return (
    <>
      <Sidebar className="text-[#151515]" collapsible={collapsible} {...props}>
        <SidebarHeader className="flex h-16 items-center justify-center border-b border-sidebar-border">
          <div className="flex items-center gap-2 px-2">
            <SidebarTrigger />
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-md font-bold">Collapse Menu</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs">
              Navigation
            </SidebarGroupLabel>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={item.className}
                  >
                    <a
                      onClick={() => router.push(item.url)}
                      className="flex items-center py-5"
                    >
                      <item.icon className="h-8 w-8" />
                      <span className="text-md">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs">
              Workspace Customization
            </SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Change Background"
                  className="flex w-full cursor-pointer items-center justify-between"
                  onClick={() => setIsBackgroundModalOpen(true)}
                >
                  <a className="flex items-center gap-2 py-2">
                    <Wallpaper className="h-7 w-7 flex-none" />
                    <span className="text-md flex-1">Change Background</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Add Page"
                  className="flex w-full cursor-pointer items-center justify-between"
                  onClick={() => setAddingPage?.(true)}
                >
                  <a className="flex items-center gap-2 py-2">
                    <CopyPlus className="h-7 w-7 flex-none" />
                    <span className="text-md flex-1">Add Page</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Remove Page"
                  className="flex w-full cursor-pointer items-center justify-between"
                  onClick={() => setRemovingPage?.(true)}
                >
                  <a className="flex items-center gap-2 py-2">
                    <Minus className="h-7 w-7 flex-none" />
                    <span className="text-md flex-1">Remove Current</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="">
            <SidebarGroupLabel className="text-xs">Widgets</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <Collapsible defaultOpen className="w-full">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip="Widget Controls"
                        className="flex w-full items-center justify-between transition-all hover:bg-gray-100/50"
                        onClick={() => setOpen(!open)}
                      >
                        <div className="flex items-center gap-2">
                          <Boxes className="h-7 w-7" />
                          <span className="text-sm">Add Tools</span>
                        </div>
                        {open ? (
                          <ChevronRight className="h-7 w-7 text-muted-foreground group-data-[collapsible=icon]:hidden" />
                        ) : (
                          <ChevronDown className="h-7 w-7 text-muted-foreground group-data-[collapsible=icon]:hidden" />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  </SidebarMenuItem>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <AddWidgetButton
                          label="Add Music"
                          widgetName="MusicPlayer"
                          w={4}
                          h={1}
                          page={currentPageId}
                        />
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <AddWidgetButton
                          label="Add Productivity Timer"
                          widgetName="TodolistComponent"
                          w={4}
                          h={2}
                          page={currentPageId}
                        />
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator className="border-sidebar-border" />
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <a href="#" className="flex items-center justify-between">
                <div
                  className="flex items-center gap-2"
                  onClick={() => router.push("/profile")}
                >
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-200 group-data-[collapsible=icon]:hidden">
                    <Image
                      src={user?.image ?? "/images/landing/avatar.png"}
                      alt="User avatar"
                      className="h-full w-full object-cover"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-medium">{user?.name}</span>
                    <span className="text-xs text-muted-foreground">
                      Free Plan
                    </span>
                  </div>
                </div>
                <LogOut
                  onClick={async () => {
                    try {
                      await signOut({}).then(() => logout());
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                  className="h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden"
                />
              </a>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <BackgroundModal
        open={isBackgroundModalOpen}
        onClose={() => setIsBackgroundModalOpen(false)}
      />
    </>
  );
}
