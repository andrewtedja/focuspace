"use client";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { AppSidebar } from "~/app/_components/app_sidebar";
import { WidgetManagerProvider } from "~/lib/widget-manager-provider";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [addingPage, setAddingPage] = useState(false);
  const [removingPage, setRemovingPage] = useState(false);
  const [disabled, setDisabled] = useState(false);
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
