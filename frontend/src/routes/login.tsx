import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: PageComponent,
});

function PageComponent() {
  return (
    <main className="min-h-screen w-full grid place-content-center">
      <h1>Login Page</h1>
    </main>
  );
}
