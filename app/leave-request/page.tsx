// app/leave-request/page.tsx

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ProtectedRoute from "@/components/protected-route"; // ✅ added
import NewRequest from "@/components/leave-request/new-request";
import RequestFilters from "@/components/leave-request/requests-filters";
import LeaveRequestCards from "@/components/leave-request/leave-request-cards";

export default function Page() {
  return (
    <ProtectedRoute>
      {" "}
      {/* ✅ was missing — all protected pages need this */}
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
            </div>
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <section className="w-full">
              <NewRequest />
            </section>

            <section className="w-full">
              <RequestFilters />
            </section>

            <section className="w-full">
              <LeaveRequestCards />
            </section>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
