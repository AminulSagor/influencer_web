"use client";

import Loader from "@/components/spin-loader";
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
import LogoutConfirmButton from "@/components/logout-confirm-button";
import { cn } from "@/lib/utils";
import { SidebarItem } from "@/types/app_sidebar-type";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const stripLocale = (path: string) =>
  path.replace(/^\/(en|bn)(?=\/|$)/, "") || "/";

const isActiveRoute = (currentPath: string, itemPath: string) => {
  const current = stripLocale(currentPath);
  const target = stripLocale(itemPath);

  if (target === "/") return current === "/";

  // exact match or nested routes
  return current === target || current.startsWith(`${target}/`);
};

export function GenericAppSidebar({ items }: { items: SidebarItem[] }) {
  const pathname = usePathname();
  const normalizedPath = stripLocale(pathname);

  // show logout on all influencer/brand routes (locale removed)
  const showLogout =
    normalizedPath.startsWith("/influencer") || normalizedPath.startsWith("/brand");

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
                  const active = isActiveRoute(pathname, item.url);
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuSubButton
                        asChild
                        className={cn(
                          "py-5 border text-[#2D5016] transition-all duration-150 hover:bg-[#7A9B57] hover:text-white hover:[&_svg]:!text-white hover:[&_svg]:!stroke-white [&_svg]:text-current [&_svg]:stroke-current",
                          active && "bg-[#7A9B57] text-white [&_svg]:!text-white [&_svg]:!stroke-white"
                        )}
                      >
                        <Link href={item.url} className="flex items-center gap-2">
                          <Icon
                            className={cn(
                              "w-5 h-5 shrink-0 transition-colors",
                              active && "!text-white !stroke-white"
                            )}
                          />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuItem>
                  );
                })}

                {/* ================= LOGOUT (ACTION, NOT LINK) ================= */}
                {showLogout && (
                  <div>
                    <LogoutConfirmButton
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md border px-2 py-3",
                        "text-[#2D5016] transition hover:border-destructive hover:bg-destructive hover:text-white hover:[&_svg]:!text-white hover:[&_svg]:!stroke-white [&_svg]:text-current [&_svg]:stroke-current"
                      )}
                      loadingChildren={
                        <>
                          <LogOut className="w-5 h-5" />
                          <span className="font-medium"><Loader /></span>
                        </>
                      }
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Logout</span>
                    </LogoutConfirmButton>
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
