"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar, SidebarItem } from "@/components/generic-sidebar";
import TopBar from "@/app/[locale]/(brand)/brand/_components/top-bar";

import {
  LayoutDashboard,
  BriefcaseBusiness,
  BarChart3,
  Compass,
  FileText,
  LifeBuoy,
  Settings,
} from "lucide-react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const items: SidebarItem[] = [
    { title: "Dashboard", url: "/brand/dashboard", icon: LayoutDashboard },
    { title: "Campaigns", url: "/brand/campaigns", icon: BriefcaseBusiness },
    { title: "Analytics", url: "/brand/analytics", icon: BarChart3 },
    { title: "Explore", url: "/brand/explore", icon: Compass },
    { title: "Reports", url: "/brand/reports", icon: FileText },
    { title: "Support Center", url: "/brand/support-center", icon: LifeBuoy },
    {
      title: "Account Settings",
      url: "/brand/account-settings",
      icon: Settings,
    },
  ];

  return (
    <SidebarProvider>
      {/* Full viewport height + proper scroll behavior */}
      <div className="flex h-dvh w-full bg-[#F4F5F7]">
        {/* Sidebar */}
        <AppSidebar items={items} />

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top bar (sticky instead of fixed) */}
          <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
            <TopBar />
          </header>

          {/* Page content scrolls */}
          <div className="flex-1 min-w-0 overflow-y-auto">
            <div className="w-full p-4">{children}</div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

