"use client";

import {
  LayoutDashboard,
  BriefcaseBusiness,
  Wallet,
  BarChart3,
  LifeBuoy,
  Settings,
  ChevronDown,
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

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  {
    title: "Dashboard",
    url: "/agency/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Jobs",
    icon: BriefcaseBusiness,
    children: [
      { title: "All Jobs", url: "/agency/jobs" },
      { title: "Create Job", url: "/agency/jobs/create" },
      { title: "Job Requests", url: "/agency/jobs/requests" },
    ],
  },
  {
    title: "Earnings",
    url: "/agency/earnings",
    icon: Wallet,
  },
  {
    title: "Reports",
    icon: BarChart3,
    children: [
      { title: "Monthly Reports", url: "/agency/reports/monthly" },
      { title: "Yearly Reports", url: "/agency/reports/yearly" },
    ],
  },
  {
    title: "Support Center",
    url: "/agency/support-center",
    icon: LifeBuoy,
  },
  {
    title: "Account Settings",
    icon: Settings,
    children: [
      { title: "Profile", url: "/agency/account-settings/profile" },
      { title: "Security", url: "/agency/account-settings/security" },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

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
                  pathname.startsWith(child.url)
                );

                const isActive = item.url
                  ? pathname.startsWith(item.url)
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
                          "py-5 hover:bg-[#7A9B57] hover:text-white border",
                          isActive && "bg-[#7A9B57] text-white"
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
                      <AccordionTrigger className="px-3 py-5 hover:bg-[#7A9B57] hover:text-white data-[state=open]:bg-[#7A9B57] data-[state=open]:text-white p-2 hover:no-underline font-normal hover:cursor-pointer border ">
                        <div className="flex items-center gap-2 ">
                          <item.icon />
                          <span>{item.title}</span>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="space-y-1 mt-2">
                        {item.children!.map((child) => {
                          const isSubActive = pathname.startsWith(child.url);

                          return (
                            <Link
                              key={child.title}
                              href={child.url}
                              className={cn(
                                "block rounded-md px-3 py-2 text-sm transition hover:bg-[#7A9B57] hover:text-white border ml-4",
                                isSubActive && "bg-[#7A9B57] text-white"
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
