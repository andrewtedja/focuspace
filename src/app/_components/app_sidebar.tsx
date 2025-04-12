import type React from "react";
import { Home, BookOpen, Coffee, User, LogOut, Sparkle } from "lucide-react";

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
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "~/components/ui/sidebar";

// Menu items for the main navigation
const mainItems = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Study Room",
    url: "#",
    icon: BookOpen,
  },
  {
    title: "Break Room",
    url: "#",
    icon: Coffee,
  },
  {
    title: "Profile",
    url: "#",
    icon: User,
  },
  {
    title: "Get Plus",
    url: "#",
    icon: Sparkle,
    className:
      "glow relative overflow-hidden bg-gradient-to-r from-[#86B3D1] to-[#7EB6A4] text-white transition-all duration-300 ease-out  hover:shadow-xl hover:shadow-[#86B3D1]/50  hover:text-[#f7f7f7] active:shadow-none active:text-[#f7f7f7]",
  },
];

export function AppSidebar({
  collapsible = "icon",
  ...props
}: { collapsible?: "offcanvas" | "icon" | "none" } & React.ComponentProps<
  typeof Sidebar
>) {
  return (
    <Sidebar collapsible={collapsible} {...props}>
      <SidebarHeader className="border-sidebar-border flex h-16 items-center justify-center border-b">
        <div className="flex items-center gap-2 px-2">
          <SidebarTrigger />
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-md font-bold">FocuSpace</span>
            <span className="text-xs text-muted-foreground">
              Focus, Learn, Thrive
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={item.className}
                  >
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-sidebar-border border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Profile & Logout">
              <a href="#" className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-200">
                    <img
                      src="/images/landing/avatar.png"
                      alt="User avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-medium">Theo Kurniady</span>
                    <span className="text-xs text-muted-foreground">
                      Student
                    </span>
                  </div>
                </div>
                <LogOut className="h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
