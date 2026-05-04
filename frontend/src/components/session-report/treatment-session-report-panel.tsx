import { Button } from "@/components/ui/button";
import type { TreatmentSessionDetailQuery } from "@/graphql/graphql";
import { downloadSessionReportPdf } from "@/lib/session-report-pdf";
import { formatIsoDateTime } from "@/lib/utils";
import { FileDown } from "lucide-react";

type SessionDetail = NonNullable<TreatmentSessionDetailQuery["treatmentSession"]>;

function ReportField({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-muted-foreground font-medium">{label}</p>
      <p className="mt-1 whitespace-pre-wrap">{value?.trim() ? value : "—"}</p>
    </div>
  );
}

export function TreatmentSessionReportPanel({ session }: { session: SessionDetail }) {
  return (
    <>
      <div className="border-border/60 flex flex-wrap items-center gap-2 border-t pt-4">
        <Button type="button" variant="secondary" onClick={() => downloadSessionReportPdf(session)}>
          <FileDown />
          Export PDF
        </Button>
        {!session.report ? (
          <span className="text-muted-foreground text-sm">
            No clinical report on file yet — PDF includes session details only.
          </span>
        ) : null}
      </div>

      <section className="space-y-4 pt-6">
        <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Clinical documentation
        </h3>
        {session.report ? (
          <div className="space-y-4 text-sm">
            <ReportField label="Anamnesis" value={session.report.anamnesis} />
            <ReportField label="Mechanism of injury" value={session.report.mechanism_of_injury} />
            <ReportField label="Actual condition" value={session.report.actual_condition} />
            <ReportField label="Examination" value={session.report.examination} />
            <ReportField label="Diagnosis" value={session.report.diagnosis} />
            <ReportField label="Intervention" value={session.report.intervention} />
            <ReportField
              label="Planning and education"
              value={session.report.planning_and_education}
            />
            <p className="text-muted-foreground pt-2 text-xs">
              Report updated {formatIsoDateTime(session.report.updated_at)}
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm italic">
            No clinical report has been filed for this session yet.
          </p>
        )}
      </section>
    </>
  );
}
