import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
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
import {
  createPatient,
  createStaff,
  createTreatmentSession,
  createTreatmentSessionReport,
  createUser,
} from "@/mutations/create";
import { usePatients } from "@/queries/usePatient";
import { useStaffs } from "@/queries/useStaff";
import { useTreatmentSessions } from "@/queries/useSession";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FormEvent } from "react";
import { useState } from "react";

type CreateSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function optional(value: string) {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

function requiredFormValue(form: FormData, name: string) {
  const value = form.get(name);
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${name.replaceAll("_", " ")} is required`);
  }
  return value;
}

function optionalFormValue(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" ? optional(value) : undefined;
}

function toDateTime(value: string) {
  return new Date(value).toISOString();
}

function toDate(value: string) {
  return new Date(`${value}T00:00:00`).toISOString();
}

function FormError({ message }: { message?: string }) {
  return message ? <FieldError>{message}</FieldError> : null;
}

export function CreatePatientSheet({ open, onOpenChange }: CreateSheetProps) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string>();
  const mutation = useMutation({
    mutationFn: createPatient,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["patients"] });
      onOpenChange(false);
    },
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
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
      });
      event.currentTarget.reset();
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
              <Input id="patient-date-of-birth" name="date_of_birth" type="date" required />
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
              <Input id="patient-address" name="address" />
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

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
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

export function CreateTreatmentSessionSheet({ open, onOpenChange }: CreateSheetProps) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string>();
  const patients = usePatients({ limit: 100, offset: 0 });
  const staffs = useStaffs({ limit: 100, offset: 0 });
  const mutation = useMutation({
    mutationFn: createTreatmentSession,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["treatmentSessions"] });
      onOpenChange(false);
    },
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    const form = new FormData(event.currentTarget);
    try {
      await mutation.mutateAsync({
        patient_id: requiredFormValue(form, "patient_id"),
        staff_id: requiredFormValue(form, "staff_id"),
        session_date: toDateTime(requiredFormValue(form, "session_date")),
      });
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create session");
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>New Session</SheetTitle>
          <SheetDescription>Schedule a treatment session.</SheetDescription>
        </SheetHeader>
        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <FieldGroup className="gap-5 px-8">
            <Field>
              <FieldLabel>Patient</FieldLabel>
              <Select name="patient_id" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {(patients.data?.patients.nodes ?? []).map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Therapist</FieldLabel>
              <Select name="staff_id" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select therapist" />
                </SelectTrigger>
                <SelectContent>
                  {(staffs.data?.staffs.nodes ?? []).map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="session-date">Date and time</FieldLabel>
              <Input id="session-date" name="session_date" type="datetime-local" required />
            </Field>
            <FormError message={error} />
          </FieldGroup>
          <SheetFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create session"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export function CreateTreatmentSessionReportSheet({ open, onOpenChange }: CreateSheetProps) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string>();
  const sessions = useTreatmentSessions({ limit: 100, offset: 0 });
  const mutation = useMutation({
    mutationFn: createTreatmentSessionReport,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["treatmentSessionReports"] });
      onOpenChange(false);
    },
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    const form = new FormData(event.currentTarget);
    try {
      await mutation.mutateAsync({
        session_id: requiredFormValue(form, "session_id"),
        anamnesis: optionalFormValue(form, "anamnesis"),
        mechanism_of_injury: optionalFormValue(form, "mechanism_of_injury"),
        actual_condition: optionalFormValue(form, "actual_condition"),
        examination: optionalFormValue(form, "examination"),
        diagnosis: optionalFormValue(form, "diagnosis"),
        intervention: optionalFormValue(form, "intervention"),
        planning_and_education: optionalFormValue(form, "planning_and_education"),
      });
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create report");
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>New Report</SheetTitle>
          <SheetDescription>Create a treatment session report.</SheetDescription>
        </SheetHeader>
        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <FieldGroup className="gap-5 px-8">
            <Field>
              <FieldLabel>Session</FieldLabel>
              <Select name="session_id" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select session" />
                </SelectTrigger>
                <SelectContent>
                  {(sessions.data?.treatmentSessions.nodes ?? []).map((session) => (
                    <SelectItem key={session.id} value={session.id}>
                      #{session.session_no} - {session.patient.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            {[
              ["anamnesis", "Anamnesis"],
              ["mechanism_of_injury", "Mechanism of injury"],
              ["actual_condition", "Actual condition"],
              ["examination", "Examination"],
              ["diagnosis", "Diagnosis"],
              ["intervention", "Intervention"],
              ["planning_and_education", "Planning and education"],
            ].map(([name, label]) => (
              <Field key={name}>
                <FieldLabel htmlFor={`report-${name}`}>{label}</FieldLabel>
                <textarea
                  id={`report-${name}`}
                  name={name}
                  className="min-h-20 w-full border border-input bg-transparent p-2 text-sm outline-none focus-visible:border-ring"
                />
              </Field>
            ))}
            <FormError message={error} />
          </FieldGroup>
          <SheetFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create report"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
