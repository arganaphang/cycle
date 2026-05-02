import { useMe } from "@/queries/useMe";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: PageComponent,
  ssr: false,
});

function PageComponent() {
  const { data, isError, error } = useMe();
  if (isError) {
    return <p>{error.message}</p>;
  }
  return (
    <main className="min-h-screen w-full grid place-content-center">
      <h1>Home Page</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
