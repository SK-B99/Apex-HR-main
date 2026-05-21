"use client";

import { useState } from "react";
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

export default function Page() {
  const [showChangePswdForm, setShowChangePswdForm] = useState(false);

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
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Settings</h1>
              <Button
                size="sm"
                className="absolute right-4 px-3 py-1 text-xs"
                onClick={() => setShowChangePswdForm(!showChangePswdForm)}
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
