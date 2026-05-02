import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ location }) => {
    const user = {}; // TODO: remove this

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
