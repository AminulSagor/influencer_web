"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { SidebarItem } from "@/types/app-sidebar-types";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";



export function GenericAppSidebar({ items }: { items: SidebarItem[] }) {
  const pathname = usePathname();
  const router = useRouter();

  // remove locale (/en | /bn)
  const normalizedPath = pathname.replace(/^\/(en|bn)/, "");

  // show logout on all influencer routes
  const showLogout = normalizedPath.startsWith("/influencer") || normalizedPath.startsWith("/brand");

  const handleLogout = () => {
    // clear auth here
    router.push("/login");
  };

  return (
    <Sidebar>
      <SidebarContent className="bg-white flex flex-col justify-between">
        {/* ================= NAVIGATION ================= */}
        <div>
          <SidebarHeader>
            <h2 className="text-lg font-semibold text-[#2D5016]">BrandGuru</h2>
          </SidebarHeader>

          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const isActive = normalizedPath.startsWith(item.url);
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuSubButton
                        asChild
                        className={cn(
                          "py-5 border transition-all duration-150 hover:bg-[#7A9B57] hover:text-white",
                          isActive && "bg-[#7A9B57] text-white"
                        )}
                      >
                        <Link
                          href={item.url}
                          className="flex items-center gap-2"
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuItem>
                  );
                })}
                {/* ================= LOGOUT (ACTION, NOT LINK) ================= */}
                {showLogout && (
                  <div className="">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-md border px-2 py-3
                         text-[#2D5016] hover:bg-red-50 hover:text-red-600
                         transition"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
