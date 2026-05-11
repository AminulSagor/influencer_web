"use client";

import LogoutConfirmButton from "@/components/logout-confirm-button";
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

export function AppSidebar({ items: _items }: { items?: unknown[] }) {
  void _items;
  const pathname = usePathname();
  const locale = useLocale();
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
                        "py-5 border text-[#2D5016] transition-all duration-150 ease-in-out hover:bg-[#7A9B57] hover:text-white hover:[&_svg]:!text-white hover:[&_svg]:!stroke-white [&_svg]:text-current [&_svg]:stroke-current",
                        isActive && "bg-[#7A9B57] text-white [&_svg]:!text-white [&_svg]:!stroke-white"
                      )}
                    >
                      <Link href={href}>
                        <item.icon
                          className={cn(
                            "size-4 shrink-0 transition-colors",
                            isActive && "!text-white !stroke-white"
                          )}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              <SidebarMenuItem>
                <LogoutConfirmButton
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md py-5 px-2 border text-[#2D5016] transition-all duration-150 ease-in-out hover:border-destructive hover:bg-destructive hover:text-white hover:[&_svg]:!text-white hover:[&_svg]:!stroke-white [&_svg]:text-current [&_svg]:stroke-current cursor-pointer"
                  )}
                  loadingChildren={
                    <>
                      <LogOut className="size-4" />
                      <span>Logging out...</span>
                    </>
                  }
                >
                  <LogOut className="size-4" />
                  <span>Logout</span>
                </LogoutConfirmButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}