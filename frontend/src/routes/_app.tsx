import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { fetchMe } from "@/queries/useMe";

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
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="p-6">
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
