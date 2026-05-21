"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ProtectedRoute from "@/components/protected-route";

import StatCards from "@/components/dashboard/stat-cards";
import LeaveBalances from "@/components/dashboard/leave-balances";
import ReqDepChart from "@/components/dashboard/req_dep-chart";
import PendingUpcoming from "@/components/dashboard/pending-upcoming";

export default function Page() {
  // const router = useRouter();
  // const [authorized, setAuthorized] = useState<boolean | null>(null);

  // useEffect(() => {
  //   const checkAuth = () => {
  //     const token = localStorage.getItem("accessToken");

  //     if (!token) {
  //       setAuthorized(false);
  //       router.replace("/");
  //       return;
  //     }

  //     setAuthorized(true);
  //   };

  //   checkAuth();

  //   const handlePageShow = () => {
  //     checkAuth();
  //   };

  //   window.addEventListener("pageshow", handlePageShow);

  //   return () => {
  //     window.removeEventListener("pageshow", handlePageShow);
  //   };
  // }, [router]);

  // if (authorized === null) {
  //   return null;
  // }

  // if (authorized === false) {
  //   return null;
  // }

  return (
    <ProtectedRoute>
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
              <StatCards />
            </section>

            <section className="w-full">
              <LeaveBalances />
            </section>

            <section className="w-full">
              <ReqDepChart />
            </section>

            <section className="w-full">
              <PendingUpcoming />
            </section>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
