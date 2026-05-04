import { AppSidebar } from "@/components/shell/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { createFileRoute, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { fetchMe } from "@/queries/useMe";

const APP_SECTION_TITLES: Record<string, string> = {
  "/patient": "Patients",
  "/staff": "Staff",
  "/session": "Sessions",
  "/report": "Reports",
};

export const Route = createFileRoute("/_app")({
  // Avoid SSR auth check: fetchMe uses browser cookies and fails on the server,
  // which incorrectly sent users to /login then back to / via already-logged-in redirect.
  ssr: false,
  beforeLoad: async ({ location }) => {
    const user = await fetchMe();

    if (!user) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }

    // Pass user to child routes
    return { user };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const sectionTitle = APP_SECTION_TITLES[pathname];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-1 flex-col">
        <header className="flex min-h-11 shrink-0 items-center gap-2 border-b border-border/60 px-4 py-2 sm:min-h-12 sm:gap-3 sm:px-6 sm:py-0">
          <SidebarTrigger />
          {sectionTitle ? (
            <h1 className="min-w-0 truncate text-base font-semibold tracking-tight sm:text-lg">
              {sectionTitle}
            </h1>
          ) : null}
        </header>
        <div className="flex min-h-0 flex-1 flex-col px-4 py-4 sm:p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
