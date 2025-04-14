"use client";
import { SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "~/app/_components/app_sidebar";
import { WidgetManagerProvider } from "~/lib/widget-manager-provider";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [, setAddingPage] = useState(false);
  const [, setRemovingPage] = useState(false);
  const [disabled] = useState(false);
  return (
    <WidgetManagerProvider>
      <SidebarProvider>
        <AppSidebar
          setAddingPage={setAddingPage}
          setRemovingPage={setRemovingPage}
          disabled={disabled}
        />
        <main className="relative min-h-screen w-full">{children}</main>
      </SidebarProvider>
    </WidgetManagerProvider>
  );
}
