import {
  LayoutDashboard,
  BriefcaseBusiness,
  BarChart3,
  Compass,
  FileText,
  LifeBuoy,
  Settings,
  ShieldOff,
  Wallet,
} from "lucide-react";
import type { SidebarItem } from "@/types/app_sidebar-type";

//----------------brand panel---------------------------//
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

//----------------agency panel---------------------------//
export const verifiedAgencySidebarItems: SidebarItem[] = [
  { title: "Dashboard", url: "/agency/dashboard", icon: LayoutDashboard },
  { title: "Jobs", url: "/agency/jobs", icon: BriefcaseBusiness },
  { title: "Earnings", url: "/agency/earnings", icon: Wallet },
  { title: "Reports", url: "/agency/reports", icon: BarChart3 },
  { title: "Support Center", url: "/agency/support-center", icon: LifeBuoy },
  {
    title: "Account Settings",
    url: "/agency/account-settings",
    icon: Settings,
  },
];

export const unVerifiedAgencySidebarItems: SidebarItem[] = [
  { title: "Unverified", url: "/agency/unverified", icon: ShieldOff },
  {
    title: "Account Settings",
    url: "/agency/account-settings",
    icon: Settings,
  },
];

export function getAgencySidebarItems(
  isVerified: boolean,
  locale: string,
): SidebarItem[] {
  const items = isVerified
    ? verifiedAgencySidebarItems
    : unVerifiedAgencySidebarItems;

  return items.map((item) => ({
    ...item,
    url: `/${locale}${item.url}`,
  }));
}

//----------------------others---------------------//
