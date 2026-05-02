import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { createFileRoute } from "@tanstack/react-router";
import { GalleryVerticalEnd } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: PageComponent,
  ssr: false,
});

function PageComponent() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      console.log(value);
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
            </FieldGroup>
          </form>
        </div>
      </div>
    </div>
  );
}
