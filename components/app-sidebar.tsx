"use client";

import { useLogout } from "@/hooks/useLogout";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Wallet,
  BarChart3,
  LifeBuoy,
  Settings,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

const items = [
  {
    title: "Dashboard",
    url: "/agency/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Jobs",
    url: "/agency/jobs",
    icon: BriefcaseBusiness,
  },
  {
    title: "Earnings",
    url: "/agency/earnings",
    icon: Wallet,
  },
  {
    title: "Reports",
    url: "/agency/reports",
    icon: BarChart3,
  },
  {
    title: "Support Center",
    url: "/agency/support-center",
    icon: LifeBuoy,
  },
  {
    title: "Account Settings",
    url: "/agency/account-settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const { logout, loading: logoutLoading } = useLogout();

  return (
    <Sidebar>
      <SidebarContent className="bg-white">
        <SidebarHeader>
          <h2 className="text-lg font-semibold text-[#2D5016]">BrandGuru</h2>
        </SidebarHeader>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const href = `/${locale}${item.url}`;
                const isActive = pathname.includes(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "py-5 border transition-all duration-150 ease-in-out hover:bg-[#7A9B57] hover:text-white",
                        isActive && "bg-[#7A9B57] text-white"
                      )}
                    >
                      <Link href={href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              <SidebarMenuItem>
                <SidebarMenuButton
                  className={cn(
                    "py-5 border transition-all duration-150 ease-in-out hover:bg-[#7A9B57] hover:text-white cursor-pointer",
                    logoutLoading && "opacity-50 pointer-events-none"
                  )}
                  onClick={logout}
                >
                  <LogOut />
                  <span>{logoutLoading ? "Logging out..." : "Logout"}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}