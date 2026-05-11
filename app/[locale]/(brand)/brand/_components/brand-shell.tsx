"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { GenericAppSidebar } from "@/components/generic-sidebar";
import TopBar from "@/app/[locale]/(brand)/brand/_components/top-bar";
import { useLocale } from "next-intl";
import { getBrandSidebarItems } from "@/constant/navigation";
import NotificationPageRefresh from "@/components/notification-page-refresh";

export default function BrandShell({
  children,
  isVerified,
}: {
  children: React.ReactNode;
  isVerified: boolean;
}) {
  const locale = useLocale();
  const items = getBrandSidebarItems(isVerified, locale);

  return (
    <SidebarProvider>
      <NotificationPageRefresh />
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
