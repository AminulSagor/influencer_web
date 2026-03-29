import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../_components/app-sidebar";
import { Toaster } from "sonner";
import AdminTopBar from "../_components/top-bar";

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
          <AdminTopBar />
          <div className="bg-[#F4F5F7] grow ">
            <div>
              {children}
              <Toaster richColors position="top-right" />
            </div>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
