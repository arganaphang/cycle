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
import { parseCreateTreatmentSessionReportForm } from "./form-schemas";
import type { CreateSheetProps } from "./types";

type CreateTreatmentSessionReportSheetProps = CreateSheetProps & {
  /** When set, session is fixed (e.g. opened from a session row). */
  presetSessionId?: string;
  presetSessionLabel?: string;
};

export function CreateTreatmentSessionReportSheet({
  open,
  onOpenChange,
  presetSessionId,
  presetSessionLabel,
}: CreateTreatmentSessionReportSheetProps) {
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
    const formEl = event.currentTarget;
    setError(undefined);
    const parsed = parseCreateTreatmentSessionReportForm(new FormData(formEl));
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid form");
      return;
    }
    try {
      await mutation.mutateAsync(parsed.data);
      formEl.reset();
      setSelectedSessionId("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create report");
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>New Report</SheetTitle>
          <SheetDescription>Create a treatment session report.</SheetDescription>
        </SheetHeader>
        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <FieldGroup className="gap-5 px-4 sm:px-8">
            <Field>
              <FieldLabel htmlFor="create-report-session">Session</FieldLabel>
              {presetSessionId ? (
                <>
                  <input type="hidden" name="session_id" value={presetSessionId} />
                  <p
                    id="create-report-session"
                    className="border-b border-input py-2 text-sm text-foreground"
                  >
                    {presetSessionLabel ?? `#${presetSessionId}`}
                  </p>
                </>
              ) : (
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
              )}
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
