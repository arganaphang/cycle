import { Button } from "@/components/ui/button";
import { fetchMe } from "@/queries/useMe";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Printer, X } from "lucide-react";

export const Route = createFileRoute("/preview")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const user = await fetchMe();
    if (!user) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
    return { user };
  },
  component: PreviewLayout,
});

function PreviewLayout() {
  return (
    <div className="bg-background min-h-screen">
      <div className="print-preview-toolbar border-border/60 flex flex-wrap items-center justify-end gap-2 border-b px-4 py-3">
        <Button type="button" variant="outline" size="sm" onClick={() => window.print()}>
          <Printer className="size-4" />
          Print
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => window.close()}>
          <X className="size-4" />
          Close
        </Button>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-8 pb-16 sm:max-w-4xl sm:px-8 sm:py-10">
        <Outlet />
      </div>
    </div>
  );
}
