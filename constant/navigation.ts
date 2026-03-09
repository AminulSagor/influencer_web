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

import type { SidebarItem } from "@/types/app_sidebar-type";

export const verifiedSidebarItems: SidebarItem[] = [
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

export const unVerifiedSidebarItems: SidebarItem[] = [
  { title: "Unverified", url: "/brand/unverified", icon: ShieldOff },
  {
    title: "Account Settings",
    url: "/brand/account-settings",
    icon: Settings,
  },
];

export function getBrandSidebarItems(
  isVerified: boolean,
  locale: string,
): SidebarItem[] {
  const items = isVerified ? verifiedSidebarItems : unVerifiedSidebarItems;

  return items.map((item) => ({
    ...item,
    url: `/${locale}${item.url}`,
  }));
}