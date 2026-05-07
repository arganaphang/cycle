import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent } from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { createTreatmentSession } from "@/mutations/create";
import { usePatients } from "@/queries/usePatient";
import { useStaffs } from "@/queries/useStaff";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { format, isBefore, startOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import type { ChangeEvent, SubmitEvent } from "react";
import { useMemo, useState } from "react";
import {
  DatePickerFieldTrigger,
  FormError,
  FormIdCombobox,
} from "./create-record-form-controls";
import { parseCreateTreatmentSessionForm } from "./form-schemas";
import { pad2, toDatetimeLocalString } from "./form-helpers";
import type { CreateSheetProps } from "./types";

export function CreateTreatmentSessionSheet({
  open,
  onOpenChange,
}: CreateSheetProps) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string>();
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [sessionAt, setSessionAt] = useState<Date | undefined>();
  const [patientSearchInput, setPatientSearchInput] = useState("");
  const [staffSearchInput, setStaffSearchInput] = useState("");
  const [patientLabelById, setPatientLabelById] = useState<
    Record<string, string>
  >({});
  const [staffLabelById, setStaffLabelById] = useState<Record<string, string>>(
    {},
  );

  const debouncedPatientSearch = useDebounce(patientSearchInput.trim(), 300);
  const debouncedStaffSearch = useDebounce(staffSearchInput.trim(), 300);

  const patients = usePatients({
    limit: 100,
    offset: 0,
    search:
      debouncedPatientSearch.length > 0 ? debouncedPatientSearch : undefined,
  });
  const staffs = useStaffs({
    limit: 100,
    offset: 0,
    search: debouncedStaffSearch.length > 0 ? debouncedStaffSearch : undefined,
  });

  const patientItems = useMemo(() => {
    const nodes = patients.data?.patients.nodes ?? [];
    const list = nodes.map((patient) => ({
      value: patient.id,
      label: patient.full_name,
    }));
    const sid = selectedPatientId;
    const fallback = sid ? patientLabelById[sid] : undefined;
    if (sid && fallback && !list.some((o) => o.value === sid)) {
      return [{ value: sid, label: fallback }, ...list];
    }
    return list;
  }, [patients.data?.patients.nodes, selectedPatientId, patientLabelById]);

  const staffItems = useMemo(() => {
    const nodes = staffs.data?.staffs.nodes ?? [];
    const list = nodes.map((staff) => ({
      value: staff.id,
      label: staff.full_name,
    }));
    const sid = selectedStaffId;
    const fallback = sid ? staffLabelById[sid] : undefined;
    if (sid && fallback && !list.some((o) => o.value === sid)) {
      return [{ value: sid, label: fallback }, ...list];
    }
    return list;
  }, [staffs.data?.staffs.nodes, selectedStaffId, staffLabelById]);
  const mutation = useMutation({
    mutationFn: createTreatmentSession,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["treatmentSessions"] });
      onOpenChange(false);
    },
  });

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    setError(undefined);
    const parsed = parseCreateTreatmentSessionForm(new FormData(formEl));
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "Invalid form";
      setError(msg);
      return;
    }
    try {
      await mutation.mutateAsync(parsed.data);
      formEl.reset();
      setSelectedPatientId("");
      setSelectedStaffId("");
      setSessionAt(undefined);
      setPatientSearchInput("");
      setStaffSearchInput("");
      setPatientLabelById({});
      setStaffLabelById({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create session");
    }
  }

  function onSessionDateSelect(d: Date | undefined) {
    if (!d) {
      setSessionAt(undefined);
      return;
    }
    const next = sessionAt ? new Date(sessionAt) : new Date();
    next.setFullYear(d.getFullYear(), d.getMonth(), d.getDate());
    if (!sessionAt) next.setHours(9, 0, 0, 0);
    setSessionAt(new Date(next));
  }

  function onSessionTimeChange(event: ChangeEvent<HTMLInputElement>) {
    const v = event.target.value;
    if (!v || !sessionAt) return;
    const [h, m] = v.split(":").map(Number);
    const next = new Date(sessionAt);
    next.setHours(h, m, 0, 0);
    setSessionAt(next);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>New Session</SheetTitle>
          <SheetDescription>Schedule a treatment session.</SheetDescription>
        </SheetHeader>
        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <FieldGroup className="gap-5 px-4 sm:px-8">
            <Field>
              <FieldLabel htmlFor="create-session-patient">Patient</FieldLabel>
              <FormIdCombobox
                id="create-session-patient"
                name="patient_id"
                placeholder="Search patient…"
                emptyText="No patients match."
                value={selectedPatientId}
                onValueChange={(id) => {
                  setSelectedPatientId(id);
                  const row = patients.data?.patients.nodes.find(
                    (p) => p.id === id,
                  );
                  if (row) {
                    setPatientLabelById((prev) => ({
                      ...prev,
                      [id]: row.full_name,
                    }));
                    setPatientSearchInput(row.full_name);
                  }
                }}
                items={patientItems}
                required
                serverSearch
                searchQuery={patientSearchInput}
                onSearchQueryChange={setPatientSearchInput}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="create-session-staff">Therapist</FieldLabel>
              <FormIdCombobox
                id="create-session-staff"
                name="staff_id"
                placeholder="Search therapist…"
                emptyText="No staff match."
                value={selectedStaffId}
                onValueChange={(id) => {
                  setSelectedStaffId(id);
                  const row = staffs.data?.staffs.nodes.find(
                    (s) => s.id === id,
                  );
                  if (row) {
                    setStaffLabelById((prev) => ({
                      ...prev,
                      [id]: row.full_name,
                    }));
                    setStaffSearchInput(row.full_name);
                  }
                }}
                items={staffItems}
                required
                serverSearch
                searchQuery={staffSearchInput}
                onSearchQueryChange={setStaffSearchInput}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="session-date-trigger">
                Date and time
              </FieldLabel>
              <Popover>
                <DatePickerFieldTrigger
                  id="session-date-trigger"
                  empty={!sessionAt}
                >
                  <CalendarIcon />
                  <span className="min-w-0 flex-1 truncate">
                    {sessionAt
                      ? format(sessionAt, "PPP '·' HH:mm")
                      : "Pick date and time"}
                  </span>
                </DatePickerFieldTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={sessionAt}
                    onSelect={onSessionDateSelect}
                    captionLayout="dropdown"
                  />
                  <div className="border-t border-border/60 bg-muted/20 px-3 py-2.5">
                    <span className="mb-2 block text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                      Time
                    </span>
                    <Input
                      type="time"
                      aria-label="Session time"
                      disabled={!sessionAt}
                      value={
                        sessionAt
                          ? `${pad2(sessionAt.getHours())}:${pad2(sessionAt.getMinutes())}`
                          : ""
                      }
                      onChange={onSessionTimeChange}
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <input
                type="hidden"
                name="session_date"
                value={sessionAt ? toDatetimeLocalString(sessionAt) : ""}
              />
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
