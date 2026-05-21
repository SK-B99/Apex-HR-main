"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
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

const data = {
  user: {
    name: "Company",
    email: "HR Admin",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "ApexHR",
      logo: GalleryVerticalEnd,
      plan: "Code Raccoon",
    },
  ],
  navMain: [
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
  ],
  projects: [
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
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
