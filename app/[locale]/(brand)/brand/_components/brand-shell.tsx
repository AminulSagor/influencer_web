"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { GenericAppSidebar } from "@/components/generic-sidebar";
import TopBar from "@/app/[locale]/(brand)/brand/_components/top-bar";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  BarChart3,
  Compass,
  FileText,
  LifeBuoy,
  Settings,
  ShieldOff,
} from "lucide-react";
import type { SidebarItem } from "@/types/app-sidebar-types";
import { useLocale } from "next-intl";

export default function BrandShell({
  children,
  isVerified,
}: {
  children: React.ReactNode;
  isVerified: boolean;
}) {
  const verifiedSidebarItems: SidebarItem[] = [
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

  const unVerifiedSidebarItems: SidebarItem[] = [
    { title: "Unverified", url: "/brand/unverified", icon: ShieldOff },
    {
      title: "Account Settings",
      url: "/brand/account-settings",
      icon: Settings,
    },
  ];

  const locale = useLocale();

  const items = (
    isVerified ? verifiedSidebarItems : unVerifiedSidebarItems
  ).map((i) => ({
    ...i,
    url: `/${locale}${i.url}`,
  }));

  return (
    <SidebarProvider>
      <div className="flex h-dvh w-full bg-[#F4F5F7]">
        <GenericAppSidebar items={items} />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
            <TopBar />
          </header>

          <div className="flex-1 min-w-0 overflow-y-auto">
            <div className="w-full p-4">{children}</div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
