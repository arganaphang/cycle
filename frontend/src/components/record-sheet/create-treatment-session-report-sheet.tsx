import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { createTreatmentSessionReport } from "@/mutations/create";
import { useTreatmentSessions } from "@/queries/useSession";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SubmitEvent } from "react";
import { useMemo, useState } from "react";
import { FormError, FormIdCombobox } from "./create-record-form-controls";
import { optionalFormValue, requiredFormValue } from "./form-helpers";
import type { CreateSheetProps } from "./types";

export function CreateTreatmentSessionReportSheet({ open, onOpenChange }: CreateSheetProps) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string>();
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const sessions = useTreatmentSessions({ limit: 100, offset: 0 });
  const sessionItems = useMemo(
    () =>
      (sessions.data?.treatmentSessions.nodes ?? []).map((session) => ({
        value: session.id,
        label: `#${session.session_no} - ${session.patient.full_name}`,
      })),
    [sessions.data?.treatmentSessions.nodes],
  );
  const mutation = useMutation({
    mutationFn: createTreatmentSessionReport,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["treatmentSessionReports"],
      });
      onOpenChange(false);
    },
  });

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
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
      setSelectedSessionId("");
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
              <FieldLabel htmlFor="create-report-session">Session</FieldLabel>
              <FormIdCombobox
                id="create-report-session"
                name="session_id"
                placeholder="Search session…"
                emptyText="No sessions match."
                value={selectedSessionId}
                onValueChange={setSelectedSessionId}
                items={sessionItems}
                required
              />
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
