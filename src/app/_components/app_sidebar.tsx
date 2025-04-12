import { Home, BookOpen, Coffee, User, LogOut, BookMarked } from "lucide-react";

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
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-sidebar-border h-16 border-b">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#86B3D1] text-white">
            <BookMarked className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold">FocusSpace</span>
            <span className="text-xs text-muted-foreground">
              Stay productive
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
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-2"
                    >
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
            <SidebarMenuButton asChild>
              <a href="#" className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-200">
                    <img
                      src="/placeholder.svg?height=32&width=32"
                      alt="User avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Alex Johnson</span>
                    <span className="text-xs text-muted-foreground">
                      Student
                    </span>
                  </div>
                </div>
                <LogOut className="h-4 w-4 text-muted-foreground text-red-500" />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
