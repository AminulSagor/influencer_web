"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { GenericAppSidebar } from "@/components/generic-sidebar";

import {
  LayoutDashboard,
  BriefcaseBusiness,
  Wallet,
  FileText,
  LifeBuoy,
  Settings,
  ShieldOff,
} from "lucide-react";
import { SidebarItem } from "@/types/app_sidebar-type";
import TopBar from "@/app/[locale]/(influencer)/influencer/_component/top-bar";
import { useLocale } from "next-intl";

export default function InfluencerShell({
  children,
  isVerified,
}: {
  children: React.ReactNode;
  isVerified: boolean;
}) {
  const locale = useLocale();
  const verifiedSidebarItems: SidebarItem[] = [
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

  const unVerifiedSidebarItems: SidebarItem[] = [
    { title: "Unverified", url: "/influencer/unverified", icon: ShieldOff },
    {
      title: "Account Settings",
      url: "/influencer/account-settings",
      icon: Settings,
    },
  ];

  const items = (
    isVerified ? verifiedSidebarItems : unVerifiedSidebarItems
  ).map((i) => ({
    ...i,
    url: `/${locale}${i.url}`,
  }));

  return (
    <SidebarProvider>
      {/* Full viewport height + proper scroll behavior */}
      <div className="flex w-full">
        {/* Sidebar */}
        <GenericAppSidebar items={items} />

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top bar (sticky instead of fixed) */}
          <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
            <TopBar />
          </header>

          {/* Page content scrolls */}
          <div className="flex-1 min-w-0 overflow-x-hidden">
            <div className="w-full p-4 bg-[#F4F5F7] h-full">{children}</div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
