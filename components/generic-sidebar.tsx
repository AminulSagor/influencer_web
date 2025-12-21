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
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

export type SidebarItem = {
  title: string;
  url: string;
  icon: LucideIcon; // 🔥 KEY FIX
};

export function AppSidebar({ items }: { items: SidebarItem[] }) {
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
              {items.map((item) => {
                const isActive = pathname.startsWith(item.url);
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuSubButton
                      asChild
                      className={cn(
                        "py-5 border transition-all duration-150 ease-in-out hover:bg-[#7A9B57] hover:text-white",
                        isActive && "bg-[#7A9B57] text-white"
                      )}
                    >
                      <Link href={item.url}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
