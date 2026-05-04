import { Separator } from "@/components/ui/separator";
import type { TreatmentSessionReportDetailQuery } from "@/graphql/graphql";
import { OFFICE_BRANCHES } from "@/lib/constants";
import { cn, formatIsoDate, formatIsoDateTime } from "@/lib/utils";
import { MapPin, Phone } from "lucide-react";
import type { ReactNode } from "react";

type ReportDetail = NonNullable<TreatmentSessionReportDetailQuery["treatmentSessionReport"]>;

function PrintSection({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("print-report-section break-inside-avoid space-y-4", className)}>
      <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

function VisitField({
  label,
  value,
  className,
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-foreground mt-2 text-sm font-medium leading-snug tracking-tight">
        {value ?? "—"}
      </p>
    </div>
  );
}

function ClinicalField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="py-5">
      <h3 className="text-foreground text-[0.7rem] font-semibold uppercase tracking-wide">
        {label}
      </h3>
      <p
        className={cn(
          "text-foreground/95 mt-2.5 min-h-5 text-sm leading-[1.65] tracking-tight",
          "whitespace-pre-wrap",
        )}
      >
        {value ?? "—"}
      </p>
    </div>
  );
}

export function TreatmentSessionReportPrintView({ report }: { report: ReportDetail }) {
  const session = report.treatment_session;

  return (
    <article className="print-preview-document text-foreground">
      <header className="mb-8 sm:mb-10">
        <h1 className="text-foreground mt-3 text-balance text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
          Physiotherapy Treatment Update
        </h1>
        <div className="text-muted-foreground mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
          <span className="text-foreground text-base font-medium">{session.patient.full_name}</span>
          <span className="text-border select-none" aria-hidden>
            ·
          </span>
          <span>Session {session.session_no}</span>
          <span className="text-border select-none" aria-hidden>
            ·
          </span>
          <time dateTime={session.session_date}>{formatIsoDate(session.session_date)}</time>
        </div>
      </header>

      <Separator />

      <div className="mt-8 flex flex-col gap-8 sm:mt-10 sm:gap-10">
        <PrintSection title="Visit context">
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-7">
            <VisitField label="Patient" value={session.patient.full_name} />
            <VisitField label="Medical record no." value={session.patient.medical_record_no} />
            <VisitField
              label="Session"
              value={`#${session.session_no} · ${formatIsoDate(session.session_date)}`}
            />
            <VisitField label="Status" value={session.status.replace(/_/g, " ")} />
            <VisitField
              className="sm:col-span-2"
              label="Therapist"
              value={session.staff.full_name}
            />
          </div>
        </PrintSection>

        <Separator />

        <PrintSection title="Clinical documentation">
          <div className="divide-y divide-border">
            <ClinicalField label="Anamnesis" value={report.anamnesis} />
            <ClinicalField label="Mechanism of injury" value={report.mechanism_of_injury} />
            <ClinicalField label="Actual condition" value={report.actual_condition} />
            <ClinicalField label="Examination" value={report.examination} />
            <ClinicalField label="Diagnosis" value={report.diagnosis} />
            <ClinicalField label="Intervention" value={report.intervention} />
            <ClinicalField label="Planning and education" value={report.planning_and_education} />
          </div>
          <Separator className="mt-8" />
          <div className="text-muted-foreground flex flex-wrap gap-x-6 gap-y-1 pt-6 text-xs">
            <span>
              <span className="font-medium text-foreground/80">Created</span>{" "}
              {formatIsoDateTime(report.created_at)}
            </span>
            <span>
              <span className="font-medium text-foreground/80">Last updated</span>{" "}
              {formatIsoDateTime(report.updated_at)}
            </span>
          </div>
        </PrintSection>
      </div>

      <footer className="from-[#23b1ca] to-[#14a9c3] text-white mt-12 overflow-hidden rounded-xl bg-linear-to-b px-5 py-8 shadow-sm sm:px-8 sm:py-10 print:mt-8 print:rounded-none print:px-4 print:py-6 print:shadow-none">
        <div className="border-white/15 border-b pb-6">
          <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-white/70 uppercase">
            Physiorehab
          </p>
          <h2 className="mt-2 text-balance text-lg font-semibold tracking-tight sm:text-xl">
            Office branches
          </h2>
        </div>
        <ul className="mt-8 grid list-none grid-cols-1 gap-x-10 gap-y-8 text-sm sm:grid-cols-2">
          {OFFICE_BRANCHES.map((branch) => (
            <li key={branch.name} className="min-w-0">
              <div className="flex gap-3">
                <MapPin
                  className="text-white/55 mt-0.5 size-4 shrink-0"
                  strokeWidth={2}
                  aria-hidden
                />
                <div className="min-w-0 space-y-1.5">
                  <p className="font-semibold leading-snug text-white">{branch.name}</p>
                  <p className="text-white/95 text-xs leading-snug whitespace-pre-line">
                    {branch.address}
                  </p>
                  <a
                    className="text-white/90 hover:text-white mt-1 inline-flex items-center gap-1.5 text-xs underline-offset-2 print:text-white"
                    href={`tel:${branch.phone.replace(/\s/g, "")}`}
                  >
                    <Phone className="size-3.5 shrink-0 opacity-80" aria-hidden />
                    {branch.phone}
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <p className="text-white/70 mt-8 border-t border-white/15 pt-6 text-center text-xs sm:text-left">
          <a
            className="text-white/90 decoration-white/40 underline transition-colors hover:text-white hover:decoration-white"
            href="https://linktr.ee/physiorehab.clinic"
            rel="noopener noreferrer"
            target="_blank"
          >
            linktr.ee/physiorehab.clinic
          </a>
        </p>
      </footer>
    </article>
  );
}
