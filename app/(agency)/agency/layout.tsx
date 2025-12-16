import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

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
          <div className="border-b py-2.5 bg-white">
            <SidebarTrigger />
          </div>
          <div className="bg-[#F4F5F7] grow">
            <div>{children}</div>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
