import * as React from "react";

import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BookOpenIcon,
  LifeBuoyIcon,
  TerminalIcon,
  UsersIcon,
  CalendarIcon,
  DumbbellIcon,
} from "lucide-react";
import { getRouteApi } from "@tanstack/react-router";

const appRoute = getRouteApi("/_app");

const data = {
  navMain: [
    {
      title: "Patients",
      url: "/patient",
      icon: <UsersIcon />,
    },
    {
      title: "Reports",
      url: "/report",
      icon: <CalendarIcon />,
    },
    {
      title: "Treatment Session",
      url: "/session",
      icon: <BookOpenIcon />,
    },
    {
      title: "Staff",
      url: "/staff",
      icon: <DumbbellIcon />,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: <LifeBuoyIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = appRoute.useRouteContext();
  const displayName = user.email.split("@")[0] ?? user.email;

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="#" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <TerminalIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Phisio Rehab</span>
                <span className="truncate text-xs">Clinic</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ name: displayName, email: user.email, avatar: "" }} />
      </SidebarFooter>
    </Sidebar>
  );
}
