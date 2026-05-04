import { TreatmentSessionReportPrintView } from "@/components/session-report/treatment-session-print-views";
import { FormError } from "@/components/record-sheet/create-record-form-controls";
import { createFileRoute } from "@tanstack/react-router";
import { useTreatmentSessionReportDetail } from "@/queries/useTreatmentSessionReportDetail";

export const Route = createFileRoute("/preview/report/$reportId")({
  component: PreviewReportPage,
  ssr: false,
});

function PreviewReportPage() {
  const { reportId } = Route.useParams();
  const detailQuery = useTreatmentSessionReportDetail(reportId);
  const report = detailQuery.data?.treatmentSessionReport ?? null;
  const loadError = !detailQuery.isLoading && !detailQuery.isFetching && report === null;

  return (
    <>
      {detailQuery.isLoading || detailQuery.isFetching ? (
        <p className="text-muted-foreground text-sm">Loading report…</p>
      ) : loadError ? (
        <FormError message="Report could not be loaded. It may have been removed." />
      ) : report ? (
        <TreatmentSessionReportPrintView report={report} />
      ) : null}
    </>
  );
}
