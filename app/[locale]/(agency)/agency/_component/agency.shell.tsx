"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import TopBar from "./top-bar";
import { getAgencySidebarItems } from "@/constant/navigation";
import { useLocale } from "next-intl";
const AgencyShell = ({
  children,
  isVerified,
}: {
  children: React.ReactNode;
  isVerified: boolean;
}) => {
  const locale = useLocale();
  const items = getAgencySidebarItems(isVerified, locale);
  return (
    <div>
      <SidebarProvider>
        <AppSidebar items={items} />
        <main className="w-full flex flex-col">
          <TopBar />
          <div className="bg-[#F4F5F7] grow ">
            <div>{children}</div>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
};

export default AgencyShell;
