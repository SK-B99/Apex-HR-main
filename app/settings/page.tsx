// app/settings/page.tsx

"use client";

// ✅ No more useState here — showChangePswdForm lives in the ViewModel
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ProtectedRoute from "@/components/protected-route";
import { ChangePswdForm } from "@/components/settings/change-pswd";
import { Button } from "@/components/ui/button";
import { useSettingsViewModel } from "@/viewmodels/useSettingsViewModel"; // ✅ import ViewModel

export default function Page() {
  // ✅ Pull showChangePswdForm and its toggle from the ViewModel instead of local state
  const { showChangePswdForm, toggleChangePswdForm } = useSettingsViewModel();

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

          <div className="flex w-full max-w-4xl flex-1 flex-col gap-4 p-4 pt-0">
            {/* ✅ Removed absolute positioning — flex layout handles alignment correctly on all screen sizes */}
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Settings</h1>
              <Button
                size="sm"
                className="px-3 py-1 text-xs"
                onClick={toggleChangePswdForm} // ✅ use ViewModel toggle
              >
                {showChangePswdForm ? "Cancel" : "Change Password"}
              </Button>
            </div>

            {showChangePswdForm && (
              <section className="flex justify-end">
                <ChangePswdForm />
              </section>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
