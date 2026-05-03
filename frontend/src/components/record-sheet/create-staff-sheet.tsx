import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { createStaff, createUser } from "@/mutations/create";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SubmitEvent } from "react";
import { useState } from "react";
import { FormError } from "./create-record-form-controls";
import { optionalFormValue, requiredFormValue } from "./form-helpers";
import type { CreateSheetProps } from "./types";

export function CreateStaffSheet({ open, onOpenChange }: CreateSheetProps) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string>();
  const mutation = useMutation({
    mutationFn: async (form: FormData) => {
      const user = await createUser({
        email: requiredFormValue(form, "email"),
        password: requiredFormValue(form, "password"),
        role: requiredFormValue(form, "role") as "ADMIN" | "RECEPTIONIST" | "THERAPIST",
      });

      return createStaff({
        user_id: user.id,
        full_name: requiredFormValue(form, "full_name"),
        license_no: optionalFormValue(form, "license_no"),
        phone: optionalFormValue(form, "phone"),
        specialization: optionalFormValue(form, "specialization"),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["staffs"] });
      onOpenChange(false);
    },
  });

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    try {
      await mutation.mutateAsync(new FormData(event.currentTarget));
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create staff");
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>New Staff</SheetTitle>
          <SheetDescription>Create the login and staff profile.</SheetDescription>
        </SheetHeader>
        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <FieldGroup className="gap-5 px-8">
            <Field>
              <FieldLabel htmlFor="staff-full-name">Full name</FieldLabel>
              <Input id="staff-full-name" name="full_name" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="staff-email">Email</FieldLabel>
              <Input id="staff-email" name="email" type="email" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="staff-password">Password</FieldLabel>
              <PasswordInput id="staff-password" name="password" minLength={8} required />
            </Field>
            <Field>
              <FieldLabel>Role</FieldLabel>
              <Select name="role" defaultValue="THERAPIST">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="THERAPIST">Therapist</SelectItem>
                  <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="staff-license">License no</FieldLabel>
              <Input id="staff-license" name="license_no" />
            </Field>
            <Field>
              <FieldLabel htmlFor="staff-specialization">Specialization</FieldLabel>
              <Input id="staff-specialization" name="specialization" />
            </Field>
            <Field>
              <FieldLabel htmlFor="staff-phone">Phone</FieldLabel>
              <Input id="staff-phone" name="phone" />
            </Field>
            <FormError message={error} />
          </FieldGroup>
          <SheetFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create staff"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
