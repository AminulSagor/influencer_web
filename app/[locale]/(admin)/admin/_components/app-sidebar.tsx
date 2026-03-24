"use client";

import { useLogout } from "@/hooks/useLogout";

import { BriefcaseBusiness, LayoutDashboard, Settings } from "lucide-react";

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

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoVerified } from "react-icons/go";
import { GrAnalytics } from "react-icons/gr";
import { HiOutlineUsers } from "react-icons/hi";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { MdOutlineReportGmailerrorred } from "react-icons/md";

const items = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Campaigns",
    icon: BriefcaseBusiness,
    url: "/admin/campaigns",
  },
  {
    title: "Verification Center",
    url: "/admin/verification-center",
    icon: GoVerified,
  },
  {
    title: "Users",
    icon: HiOutlineUsers,
    children: [
      { title: "Influencer", url: "/admin/users/influencer" },
      { title: "Agency", url: "/admin/users/agency" },
      { title: "Brands", url: "/admin/users/brand" },
    ],
  },
  {
    title: "Finance & Analytics",
    url: "/admin/finance-analytics",
    icon: GrAnalytics,
  },
  {
    title: "Reports",
    icon: MdOutlineReportGmailerrorred,
    url: "/admin/reports",
  },
  {
    title: "Account Settings",
    icon: Settings,
    url: "/admin/account-settings",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { logout, loading: logoutLoading } = useLogout();

  // Handle locale prefix for matching
  const normalizedPathname = pathname.replace(/^\/(?:en|bn)/, "") || "/";

  return (
    <Sidebar>
      <SidebarContent className="bg-white">
        <SidebarHeader>
          <h2 className="text-lg font-semibold text-[#2D5016]">BrandGuru</h2>
        </SidebarHeader>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, index) => {
                const hasChildren = !!item.children;

                // 🔥 Auto-open accordion if child route is active
                const isChildActive = item.children?.some((child) =>
                  normalizedPathname.startsWith(child.url)
                );

                const isActive = item.url
                  ? normalizedPathname.startsWith(item.url)
                  : isChildActive;

                // ======================
                // 🔹 SIMPLE MENU
                // ======================
                if (!hasChildren) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          "py-5 hover:bg-light-green hover:text-white border",
                          isActive && "bg-light-green text-white"
                        )}
                      >
                        <Link href={item.url!}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                // ======================
                // 🔹 NESTED MENU
                // ======================
                return (
                  <Accordion
                    key={item.title}
                    type="single"
                    collapsible
                    defaultValue={isChildActive ? `item-${index}` : undefined}
                  >
                    <AccordionItem value={`item-${index}`} className="border-0">
                      <AccordionTrigger className="px-3 py-5 hover:bg-light-green hover:text-white data-[state=open]:bg-light-green data-[state=open]:text-white p-2 hover:no-underline font-normal hover:cursor-pointer border ">
                        <div className="flex items-center gap-2 ">
                          <item.icon />
                          <span>{item.title}</span>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="space-y-1 mt-2">
                        {item.children!.map((child) => {
                          const isSubActive = normalizedPathname.startsWith(child.url);

                          return (
                            <Link
                              key={child.title}
                              href={child.url}
                              className={cn(
                                "block rounded-md px-3 py-2 text-sm transition hover:bg-light-green hover:text-white border ml-4",
                                isSubActive && "bg-light-green text-white"
                              )}
                            >
                              {child.title}
                            </Link>
                          );
                        })}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                );
              })}

              {/* Logout button */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  className={cn(
                    "py-5 hover:bg-light-green hover:text-white border cursor-pointer",
                    logoutLoading && "opacity-50 pointer-events-none"
                  )}
                  onClick={logout}
                >
                  <RiLogoutCircleRLine />
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
