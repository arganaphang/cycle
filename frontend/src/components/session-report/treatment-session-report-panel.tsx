import { DetailFields, DetailSection } from "@/components/data-table/entity-detail-dialog";
import type { TreatmentSessionDetailQuery } from "@/graphql/graphql";
import { formatIsoDateTime } from "@/lib/utils";

type SessionDetail = NonNullable<TreatmentSessionDetailQuery["treatmentSession"]>;

export function TreatmentSessionReportPanel({ session }: { session: SessionDetail }) {
  const report = session.report;

  return (
    <DetailSection
      title="Clinical documentation"
      description={
        report
          ? "Assessment and treatment notes for this session."
          : "Add a report from the session list when this session has no clinical note yet."
      }
    >
      {report ? (
        <>
          <DetailFields
            rows={[
              { label: "Anamnesis", value: report.anamnesis },
              { label: "Mechanism of injury", value: report.mechanism_of_injury },
              { label: "Actual condition", value: report.actual_condition },
              { label: "Examination", value: report.examination },
              { label: "Diagnosis", value: report.diagnosis },
              { label: "Intervention", value: report.intervention },
              {
                label: "Planning and education",
                value: report.planning_and_education,
              },
              {
                label: "Last updated",
                value: formatIsoDateTime(report.updated_at),
              },
            ]}
          />
        </>
      ) : (
        <p className="text-muted-foreground bg-muted/30 rounded-lg border border-dashed border-border/70 px-4 py-6 text-center text-sm leading-relaxed">
          No clinical report has been filed for this session yet.
        </p>
      )}
    </DetailSection>
  );
}
