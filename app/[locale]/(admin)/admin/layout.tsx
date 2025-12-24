import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import TopBar from "../../(agency)/agency/_component/top-bar";

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
