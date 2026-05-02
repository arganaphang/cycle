import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { login } from "@/mutations/mutationLogin";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { GalleryVerticalEnd } from "lucide-react";
import { useState } from "react";
import { fetchMe } from "@/queries/useMe";

function postLoginPath(redirect: string | undefined): string {
  if (!redirect) return "/";
  try {
    if (redirect.startsWith("/")) return redirect;
    const u = new URL(redirect);
    const origin =
      typeof window !== "undefined" ? window.location.origin : u.origin;
    if (u.origin !== origin) return "/";
    return `${u.pathname}${u.search}${u.hash}`;
  } catch {
    /* ignore */
  }
  return "/";
}

export const Route = createFileRoute("/login")({
  beforeLoad: async ({ search }) => {
    const user = await fetchMe();
    if (user) {
      throw redirect({
        to: postLoginPath(search.redirect),
        replace: true,
      });
    }
  },
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect:
      typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  component: PageComponent,
  ssr: false,
});

function PageComponent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { redirect } = Route.useSearch();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null);
      try {
        await login(value);
        await queryClient.invalidateQueries({ queryKey: ["me"] });
        await router.navigate({
          to: postLoginPath(redirect),
          replace: true,
        });
      } catch (e) {
        setSubmitError(e instanceof Error ? e.message : "Login failed");
      }
    },
  });

  const onLoginSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit();
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <form onSubmit={(e) => onLoginSubmit(e)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <a
                  href="#"
                  className="flex flex-col items-center gap-2 font-medium"
                >
                  <div className="flex size-8 items-center justify-center rounded-md">
                    <GalleryVerticalEnd className="size-6" />
                  </div>
                  <span className="sr-only">Well Known System</span>
                </a>
                <h1 className="text-xl font-bold">Welcome to Cycle System.</h1>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <form.Field
                  name="email"
                  children={(field) => (
                    <Input
                      type="email"
                      placeholder="m@example.com"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      required
                    />
                  )}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <form.Field
                  name="password"
                  children={(field) => (
                    <PasswordInput
                      placeholder="********"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      required
                    />
                  )}
                />
              </Field>
              <Field>
                <Button type="submit">Login</Button>
              </Field>
              {submitError ? (
                <p className="text-sm text-destructive text-center" role="alert">
                  {submitError}
                </p>
              ) : null}
            </FieldGroup>
          </form>
        </div>
      </div>
    </div>
  );
}
