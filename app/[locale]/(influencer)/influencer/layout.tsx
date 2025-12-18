import { SidebarProvider } from "@/components/ui/sidebar";
import TopBar from "./_component/top-bar";
import { AppSidebar } from "@/app/[locale]/(influencer)/influencer/_component/app-sidebar";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full flex flex-col">
          <TopBar />
          <div className="bg-[#F4F5F7] grow ">
            <div>{children}</div>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
