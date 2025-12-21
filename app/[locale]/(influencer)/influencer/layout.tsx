"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar, SidebarItem } from "@/components/generic-sidebar";
import TopBar from "./_component/top-bar";

import {
  LayoutDashboard,
  BriefcaseBusiness,
  Wallet,
  FileText,
  LifeBuoy,
  Settings,
} from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const items: SidebarItem[] = [
    {
      title: "Dashboard",
      url: "/influencer/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Jobs",
      url: "/influencer/jobs",
      icon: BriefcaseBusiness,
    },
    {
      title: "Earnings",
      url: "/influencer/earnings",
      icon: Wallet,
    },
    {
      title: "Reports",
      url: "/influencer/reports",
      icon: FileText,
    },
    {
      title: "Support Center",
      url: "/influencer/support-center",
      icon: LifeBuoy,
    },
    {
      title: "Account Settings",
      url: "/influencer/account-settings",
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
            <div className="w-full p-4 md:p-6">{children}</div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
