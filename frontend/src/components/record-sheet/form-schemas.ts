import type {
  CreatePatientInput,
  CreateTreatmentSessionInput,
  CreateTreatmentSessionReportInput,
  UpdateStaffInput,
} from "@/graphql/graphql";
import { z } from "zod";

export function formField(form: FormData, name: string): string {
  return String(form.get(name) ?? "");
}

const trimmedOptional = z
  .string()
  .transform((s) => s.trim())
  .transform((s) => (s.length > 0 ? s : undefined));

const optionalEmailField = z
  .string()
  .transform((s) => s.trim())
  .superRefine((val, ctx) => {
    if (val.length === 0) return;
    if (!z.string().email().safeParse(val).success) {
      ctx.addIssue({ code: "custom", message: "Invalid email" });
    }
  })
  .transform((s) => (s.length === 0 ? undefined : s));

const dateOfBirthSchema = z
  .string()
  .trim()
  .min(1, "Date of birth is required")
  .superRefine((val, ctx) => {
    const d = new Date(`${val}T00:00:00`);
    if (Number.isNaN(d.getTime())) {
      ctx.addIssue({ code: "custom", message: "Invalid date of birth" });
    }
  })
  .transform((val) => new Date(`${val}T00:00:00`).toISOString());

export const createPatientFormSchema = z
  .object({
    full_name: z.string().trim().min(1, "Full name is required"),
    date_of_birth: dateOfBirthSchema,
    gender: z.enum(["MALE", "FEMALE"]),
    phone: trimmedOptional,
    email: optionalEmailField,
    address: trimmedOptional,
    emergency_contact_name: z.string(),
    emergency_contact_phone: z.string(),
    emergency_contact_relation: z.string(),
  })
  .superRefine((data, ctx) => {
    const n = data.emergency_contact_name.trim();
    const p = data.emergency_contact_phone.trim();
    const r = data.emergency_contact_relation.trim();
    if (!n && !p && !r) return;
    if (!n || !p || !r) {
      ctx.addIssue({
        code: "custom",
        message: "Emergency contact: enter name, phone, and relationship, or leave all three empty",
      });
    }
  })
  .transform((data): CreatePatientInput => {
    const n = data.emergency_contact_name.trim();
    const p = data.emergency_contact_phone.trim();
    const r = data.emergency_contact_relation.trim();
    const emergency_contact = n && p && r ? { name: n, phone: p, relation: r } : undefined;
    return {
      full_name: data.full_name,
      date_of_birth: data.date_of_birth,
      gender: data.gender,
      phone: data.phone,
      email: data.email,
      address: data.address,
      emergency_contact,
    };
  });

export function parseCreatePatientForm(form: FormData) {
  return createPatientFormSchema.safeParse({
    full_name: formField(form, "full_name"),
    date_of_birth: formField(form, "date_of_birth"),
    gender: formField(form, "gender"),
    phone: formField(form, "phone"),
    email: formField(form, "email"),
    address: formField(form, "address"),
    emergency_contact_name: formField(form, "emergency_contact_name"),
    emergency_contact_phone: formField(form, "emergency_contact_phone"),
    emergency_contact_relation: formField(form, "emergency_contact_relation"),
  });
}

export const createStaffFormSchema = z.object({
  full_name: z.string().trim().min(1, "Full name is required"),
  email: z.string().trim().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["ADMIN", "RECEPTIONIST", "THERAPIST"]),
  license_no: trimmedOptional,
  phone: trimmedOptional,
  specialization: trimmedOptional,
});

export type CreateStaffFormValues = z.infer<typeof createStaffFormSchema>;

export function parseCreateStaffForm(form: FormData) {
  return createStaffFormSchema.safeParse({
    full_name: formField(form, "full_name"),
    email: formField(form, "email"),
    password: formField(form, "password"),
    role: formField(form, "role"),
    license_no: formField(form, "license_no"),
    phone: formField(form, "phone"),
    specialization: formField(form, "specialization"),
  });
}

export const editStaffFormSchema = z
  .object({
    full_name: z.string().trim().min(1, "Full name is required"),
    license_no: trimmedOptional,
    phone: trimmedOptional,
    specialization: trimmedOptional,
  })
  .transform(
    (d): UpdateStaffInput => ({
      full_name: d.full_name,
      license_no: d.license_no,
      phone: d.phone,
      specialization: d.specialization,
    }),
  );

export function parseEditStaffForm(form: FormData) {
  return editStaffFormSchema.safeParse({
    full_name: formField(form, "full_name"),
    license_no: formField(form, "license_no"),
    phone: formField(form, "phone"),
    specialization: formField(form, "specialization"),
  });
}

export const createTreatmentSessionReportFormSchema = z
  .object({
    session_id: z.string().trim().min(1, "Session is required"),
    anamnesis: trimmedOptional,
    mechanism_of_injury: trimmedOptional,
    actual_condition: trimmedOptional,
    examination: trimmedOptional,
    diagnosis: trimmedOptional,
    intervention: trimmedOptional,
    planning_and_education: trimmedOptional,
  })
  .transform(
    (d): CreateTreatmentSessionReportInput => ({
      session_id: d.session_id,
      anamnesis: d.anamnesis,
      mechanism_of_injury: d.mechanism_of_injury,
      actual_condition: d.actual_condition,
      examination: d.examination,
      diagnosis: d.diagnosis,
      intervention: d.intervention,
      planning_and_education: d.planning_and_education,
    }),
  );

export function parseCreateTreatmentSessionReportForm(form: FormData) {
  return createTreatmentSessionReportFormSchema.safeParse({
    session_id: formField(form, "session_id"),
    anamnesis: formField(form, "anamnesis"),
    mechanism_of_injury: formField(form, "mechanism_of_injury"),
    actual_condition: formField(form, "actual_condition"),
    examination: formField(form, "examination"),
    diagnosis: formField(form, "diagnosis"),
    intervention: formField(form, "intervention"),
    planning_and_education: formField(form, "planning_and_education"),
  });
}

export const createTreatmentSessionFormSchema = z
  .object({
    patient_id: z.string().trim().min(1, "Patient is required"),
    staff_id: z.string().trim().min(1, "Therapist is required"),
    session_date: z.string().trim().min(1, "Date and time is required"),
  })
  .superRefine((data, ctx) => {
    const at = new Date(data.session_date);
    if (Number.isNaN(at.getTime())) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid date and time",
        path: ["session_date"],
      });
      return;
    }
  })
  .transform(
    (data): CreateTreatmentSessionInput => ({
      patient_id: data.patient_id,
      staff_id: data.staff_id,
      session_date: new Date(data.session_date).toISOString(),
    }),
  );

export function parseCreateTreatmentSessionForm(form: FormData) {
  return createTreatmentSessionFormSchema.safeParse({
    patient_id: formField(form, "patient_id"),
    staff_id: formField(form, "staff_id"),
    session_date: formField(form, "session_date"),
  });
}
