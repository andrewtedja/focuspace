"use client";
import type React from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  BookOpen,
  Coffee,
  User,
  LogOut,
  Sparkle,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Boxes,
  Plus,
  Wallpaper,
  CopyPlus,
  Crown,
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
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import WidgetToolkit from "./WidgetToolkit";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { useState } from "react";
import Image from "next/image";
import { useWidgetManager } from "~/lib/widget-manager-context";
import AddWidgetButton from "./addWidgetButton";

const mainItems = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "My Room",
    url: "",
    icon: BookOpen,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "Get Plus++",
    url: "#",
    icon: Gem,
    className:
      "glow relative overflow-hidden bg-gradient-to-r from-[#86B3D1] to-[#7EB6A4] text-white transition-all duration-300 ease-out  hover:shadow-xl hover:shadow-[#86B3D1]/50  hover:text-[#f7f7f7] active:shadow-none active:text-[#f7f7f7]",
  },
];

export function AppSidebar({
  collapsible = "icon",
  setAddingPage,
  setRemovingPage,
  disabled,
  ...props
}: {
  collapsible?: "offcanvas" | "icon" | "none";
  setAddingPage?: (val: boolean) => void;
  setRemovingPage?: (val: boolean) => void;
  disabled?: boolean;
} & React.ComponentProps<typeof Sidebar>) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { currentPageId } = useWidgetManager();
  return (
    <Sidebar
      className="bg-[#ffffff] text-black backdrop-blur-xl"
      collapsible={collapsible}
      {...props}
    >
      <SidebarHeader className="border-sidebar-border flex h-16 items-center justify-center border-b">
        <div className="flex items-center gap-2 px-2">
          <SidebarTrigger />
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-md font-bold">FocuSpace</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs">Navigation</SidebarGroupLabel>
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
                      className="flex w-full items-center justify-between"
                      onClick={() => setOpen(!open)}
                    >
                      <div className="flex items-center gap-2">
                        <Boxes className="h-7 w-7" />
                        <span className="text-sm">Widget Controls</span>
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
                        label="Add Todo/Timer"
                        widgetName="TodolistComponent"
                        w={3}
                        h={3}
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

      <SidebarFooter className="border-sidebar-border border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <a href="#" className="flex items-center justify-between">
              <div
                className="flex items-center gap-2"
                onClick={() => router.push("/profile")}
              >
                <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-200 group-data-[collapsible=icon]:hidden">
                  <Image
                    src="/images/landing/avatar.png"
                    alt="User avatar"
                    className="h-full w-full object-cover"
                    width={40}
                    height={40}
                  />
                </div>
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-medium">Theo Kurniady</span>
                  <span className="text-xs text-muted-foreground">Student</span>
                </div>
              </div>
              <LogOut className="h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
            </a>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
