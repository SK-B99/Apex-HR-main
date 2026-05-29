// components/app-sidebar.tsx

"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Command,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { getAccessToken, decodeToken } from "@/lib/auth"; // ✅ read real user from JWT

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: SquareTerminal,
    isActive: true,
  },
  {
    title: "Leave Requests",
    url: "/leave-request",
    icon: Bot,
  },
  {
    title: "Approvals",
    url: "/approvals",
    icon: BookOpen,
  },
  {
    title: "Team Calendar",
    url: "/team-calendar",
    icon: Map,
  },
];

const projects = [
  {
    name: "People",
    url: "/people",
    icon: Frame,
  },
  {
    name: "Policies",
    url: "/leave-policies",
    icon: PieChart,
  },
  {
    name: "Audit Log",
    url: "/audit-log",
    icon: Command,
  },
  {
    name: "Settings",
    url: "/settings",
    icon: Settings2,
  },
];

const teams = [
  {
    name: "ApexHR",
    logo: GalleryVerticalEnd,
    plan: "Code Raccoon",
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // ✅ Read real user name, email, and role from the JWT token
  const [user, setUser] = React.useState({
    name: "Loading...",
    email: "",
    avatar: "",
  });

  React.useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    const decoded = decodeToken(token);
    if (!decoded) return;

    // ✅ Build display name from email if no name fields in token
    // JWT has: sub (userId), email, role — use email as fallback name
    setUser({
      name: decoded.email.split("@")[0], // e.g. "johndoe" from "johndoe@company.com"
      email: decoded.email,
      avatar: decoded.email[0]?.toUpperCase() ?? "U",
    });
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        {/* ✅ Now passes real user data from JWT instead of hardcoded "Company" / "HR Admin" */}
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
