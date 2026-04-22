import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: PageComponent,
});

function PageComponent() {
  return (
    <main className="min-h-screen w-full grid place-content-center">
      <h1>Home Page</h1>
    </main>
  );
}
