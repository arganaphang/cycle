import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/patient/$id")({
  component: PageComponent,
});

function PageComponent() {
  return (
    <main className="min-h-screen w-full grid place-content-center">
      <h1>Patient Detail Page</h1>
    </main>
  );
}
