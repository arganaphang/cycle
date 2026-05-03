import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent } from "@/components/ui/popover";
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
import { createPatient } from "@/mutations/create";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import type { SubmitEvent } from "react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { DatePickerFieldTrigger, FormError } from "./create-record-form-controls";
import {
  optionalEmergencyContactFromForm,
  optionalFormValue,
  requiredFormValue,
  toDate,
} from "./form-helpers";
import type { CreateSheetProps } from "./types";

export function CreatePatientSheet({ open, onOpenChange }: CreateSheetProps) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string>();
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>();
  const mutation = useMutation({
    mutationFn: createPatient,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["patients"] });
      onOpenChange(false);
    },
  });

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    const form = new FormData(event.currentTarget);
    try {
      await mutation.mutateAsync({
        full_name: requiredFormValue(form, "full_name"),
        date_of_birth: toDate(requiredFormValue(form, "date_of_birth")),
        gender: requiredFormValue(form, "gender") as "FEMALE" | "MALE",
        phone: optionalFormValue(form, "phone"),
        email: optionalFormValue(form, "email"),
        address: optionalFormValue(form, "address"),
        emergency_contact: optionalEmergencyContactFromForm(form),
      });
      event.currentTarget.reset();
      setDateOfBirth(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create patient");
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>New Patient</SheetTitle>
          <SheetDescription>Create a patient record.</SheetDescription>
        </SheetHeader>
        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <FieldGroup className="gap-5 px-8">
            <Field>
              <FieldLabel htmlFor="patient-full-name">Full name</FieldLabel>
              <Input id="patient-full-name" name="full_name" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="patient-date-of-birth">Date of birth</FieldLabel>
              <Popover>
                <DatePickerFieldTrigger id="patient-date-of-birth" empty={!dateOfBirth}>
                  <CalendarIcon />
                  <span className="min-w-0 flex-1 truncate">
                    {dateOfBirth ? format(dateOfBirth, "PPP") : "Pick a date"}
                  </span>
                </DatePickerFieldTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateOfBirth}
                    onSelect={setDateOfBirth}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <input
                type="hidden"
                name="date_of_birth"
                value={dateOfBirth ? format(dateOfBirth, "yyyy-MM-dd") : ""}
              />
            </Field>
            <Field>
              <FieldLabel>Gender</FieldLabel>
              <Select name="gender" defaultValue="MALE">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="patient-phone">Phone</FieldLabel>
              <Input id="patient-phone" name="phone" />
            </Field>
            <Field>
              <FieldLabel htmlFor="patient-email">Email</FieldLabel>
              <Input id="patient-email" name="email" type="email" />
            </Field>
            <Field>
              <FieldLabel htmlFor="patient-address">Address</FieldLabel>
              <Textarea id="patient-address" name="address" />
            </Field>
            <div className="space-y-1 border-t border-border/60 pt-5">
              <p className="text-sm font-medium">Emergency contact</p>
              <p className="text-muted-foreground text-xs">
                Optional. If you add a contact, include name, phone, and relationship.
              </p>
            </div>
            <Field>
              <FieldLabel htmlFor="emergency-contact-name">Name</FieldLabel>
              <Input id="emergency-contact-name" name="emergency_contact_name" autoComplete="off" />
            </Field>
            <Field>
              <FieldLabel htmlFor="emergency-contact-phone">Phone</FieldLabel>
              <Input
                id="emergency-contact-phone"
                name="emergency_contact_phone"
                type="tel"
                autoComplete="off"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="emergency-contact-relation">Relationship</FieldLabel>
              <Input
                id="emergency-contact-relation"
                name="emergency_contact_relation"
                placeholder="e.g. Spouse, parent"
                autoComplete="off"
              />
            </Field>
            <FormError message={error} />
          </FieldGroup>
          <SheetFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create patient"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
