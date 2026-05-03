import type { EmergencyContactInput } from "@/graphql/graphql";

export function optional(value: string) {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

export function requiredFormValue(form: FormData, name: string) {
  const value = form.get(name);
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${name.replaceAll("_", " ")} is required`);
  }
  return value;
}

export function optionalFormValue(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" ? optional(value) : undefined;
}

/**
 * Reads `emergency_contact_name`, `emergency_contact_phone`, `emergency_contact_relation`.
 * Returns `undefined` if all are empty; otherwise all three must be non-empty.
 */
export function optionalEmergencyContactFromForm(
  form: FormData,
): EmergencyContactInput | undefined {
  const name = optional(String(form.get("emergency_contact_name") ?? ""));
  const phone = optional(String(form.get("emergency_contact_phone") ?? ""));
  const relation = optional(String(form.get("emergency_contact_relation") ?? ""));
  if (!name && !phone && !relation) return undefined;
  if (!name || !phone || !relation) {
    throw new Error(
      "Emergency contact: enter name, phone, and relationship, or leave all three empty",
    );
  }
  return { name, phone, relation };
}

export function toDateTime(value: string) {
  return new Date(value).toISOString();
}

export function toDate(value: string) {
  return new Date(`${value}T00:00:00`).toISOString();
}

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/** Value suitable for `datetime-local` parsing and `new Date()` in the browser. */
export function toDatetimeLocalString(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}
