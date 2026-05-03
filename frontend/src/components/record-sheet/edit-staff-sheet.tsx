import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { StaffsQuery, UpdateStaffInput } from "@/graphql/graphql";
import { updateStaff } from "@/mutations/update";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SubmitEvent } from "react";
import { useState } from "react";
import { FormError } from "./create-record-form-controls";
import { parseEditStaffForm } from "./form-schemas";

type StaffRow = StaffsQuery["staffs"]["nodes"][number];

export function EditStaffSheet({
  staff,
  open,
  onOpenChange,
}: {
  staff: StaffRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string>();

  const mutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateStaffInput }) => updateStaff(id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["staffs"] });
      onOpenChange(false);
    },
  });

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!staff) return;
    setError(undefined);
    const parsed = parseEditStaffForm(new FormData(event.currentTarget));
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid form");
      return;
    }
    try {
      await mutation.mutateAsync({
        id: staff.id,
        input: parsed.data,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update staff");
    }
  }

  if (!staff) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit staff</SheetTitle>
          <SheetDescription>Update profile fields for this staff member.</SheetDescription>
        </SheetHeader>
        <form key={staff.id} onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <FieldGroup className="gap-5 px-4 sm:px-8">
            <Field>
              <FieldLabel htmlFor="edit-staff-email">Email</FieldLabel>
              <Input
                id="edit-staff-email"
                value={staff.user.email}
                readOnly
                disabled
                className="opacity-80"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="edit-staff-full-name">Full name</FieldLabel>
              <Input
                id="edit-staff-full-name"
                name="full_name"
                required
                defaultValue={staff.full_name}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="edit-staff-license">License no</FieldLabel>
              <Input
                id="edit-staff-license"
                name="license_no"
                defaultValue={staff.license_no ?? ""}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="edit-staff-specialization">Specialization</FieldLabel>
              <Input
                id="edit-staff-specialization"
                name="specialization"
                defaultValue={staff.specialization ?? ""}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="edit-staff-phone">Phone</FieldLabel>
              <Input
                id="edit-staff-phone"
                name="phone"
                type="tel"
                defaultValue={staff.phone ?? ""}
              />
            </Field>
            <FormError message={error} />
          </FieldGroup>
          <SheetFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving…" : "Save changes"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
