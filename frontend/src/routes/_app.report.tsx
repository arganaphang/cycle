import { DataTable, DataTableColumnMenu } from "@/components/data-table/data-table";
import {
  DetailFields,
  DetailSection,
  EntityDetailDialog,
} from "@/components/data-table/entity-detail-dialog";
import { ListSearchInput } from "@/components/data-table/list-search-input";
import { CreateTreatmentSessionReportSheet } from "@/components/record-sheet/create-record-sheet";
import { useListRouteTableUrl } from "@/hooks/use-list-route-table-url";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { formatIsoDate, formatIsoDateTime, titleCase } from "@/lib/utils";
import { useTreatmentSessionReports } from "@/queries/useReport";
import type {
  TreatmentSessionReportSortField,
  TreatmentSessionReportsQuery,
} from "@/graphql/graphql";
import { useMemo, useState } from "react";

function treatmentSessionReportSortField(
  columnId: string,
): TreatmentSessionReportSortField | undefined {
  const map: Record<string, TreatmentSessionReportSortField> = {
    patient: "PATIENT_NAME",
    session_date: "SESSION_DATE",
    diagnosis: "DIAGNOSIS",
    created_at: "CREATED_AT",
  };
  return map[columnId];
}

export const Route = createFileRoute("/_app/report")({
  component: PageComponent,
  ssr: false,
});

function PageComponent() {
  const navigate = useNavigate();
  const {
    pagination,
    onPaginationChange,
    sorting,
    onSortingChange,
    searchDraft,
    onSearchChange,
    querySearch,
  } = useListRouteTableUrl({ defaultPageSize: 20 });

  const [createOpen, setCreateOpen] = useState(false);
  const [detail, setDetail] = useState<
    TreatmentSessionReportsQuery["treatmentSessionReports"]["nodes"][number] | null
  >(null);

  const firstSort = sorting[0];
  const sortBy = firstSort ? treatmentSessionReportSortField(firstSort.id) : undefined;
  const sortOrder = sortBy && firstSort ? (firstSort.desc ? "DESC" : "ASC") : undefined;

  const { data } = useTreatmentSessionReports({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    filter: querySearch ? { search: querySearch } : undefined,
    sortBy,
    sortOrder,
  });

  const columns = useMemo<
    ColumnDef<TreatmentSessionReportsQuery["treatmentSessionReports"]["nodes"][number]>[]
  >(
    () => [
      {
        id: "patient",
        accessorFn: (row) => row.treatment_session.patient.full_name,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Patient" />,
      },
      {
        id: "session_no",
        accessorFn: (row) => row.treatment_session.session_no,
        enableSorting: false,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Session #" />,
      },
      {
        id: "session_date",
        accessorFn: (row) => row.treatment_session.session_date,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Session date" />,
        cell: ({ row }) => (
          <div className="font-medium">
            {formatIsoDate(row.original.treatment_session.session_date)}
          </div>
        ),
      },
      {
        accessorKey: "diagnosis",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={titleCase(column.id)} />
        ),
        cell: ({ row }) => {
          const text = row.getValue("diagnosis") as string | null;
          return (
            <div className="max-w-[240px] truncate text-muted-foreground" title={text ?? undefined}>
              {text ?? "—"}
            </div>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={titleCase(column.id)} />
        ),
        cell: ({ row }) => (
          <div className="font-medium">{formatIsoDate(row.getValue("created_at") as string)}</div>
        ),
      },
      {
        id: "actions",
        enableSorting: false,
        cell: ({ row }) => {
          const report = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                }
              ></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setDetail(report)}>View details</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    navigate({
                      to: "/session",
                      search: { sessionId: report.treatment_session.id },
                    })
                  }
                >
                  Open session & report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [navigate],
  );

  return (
    <main className="min-w-0 space-y-4">
      <DataTable
        columns={columns}
        data={data?.treatmentSessionReports.nodes ?? []}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        sorting={sorting}
        onSortingChange={onSortingChange}
        totalCount={data?.treatmentSessionReports.total_count ?? 0}
        onRowClick={(row) => setDetail(row)}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            <ListSearchInput
              id="report-search"
              value={searchDraft}
              onChange={onSearchChange}
              placeholder="Patient, session #, diagnosis…"
              aria-label="Search reports"
              className="sm:w-72"
            />
            <Button className="w-full shrink-0 sm:w-auto" onClick={() => setCreateOpen(true)}>
              <Plus />
              New report
            </Button>
            <DataTableColumnMenu />
          </div>
        </div>
      </DataTable>
      <CreateTreatmentSessionReportSheet open={createOpen} onOpenChange={setCreateOpen} />
      <EntityDetailDialog
        open={detail !== null}
        onOpenChange={(open) => {
          if (!open) setDetail(null);
        }}
        title={detail ? `Report · ${detail.treatment_session.patient.full_name}` : "Report"}
        description={
          detail
            ? `Session #${detail.treatment_session.session_no} · ${formatIsoDate(detail.treatment_session.session_date)}`
            : undefined
        }
        contentClassName="sm:max-w-xl"
      >
        {detail ? (
          <div className="flex flex-col gap-7">
            <DetailSection
              title="Diagnosis"
              description="Primary clinical impression for this visit."
            >
              {detail.diagnosis?.trim() ? (
                <div className="text-sm leading-relaxed">
                  <p className="whitespace-pre-wrap font-bold underline">{detail.diagnosis}</p>
                </div>
              ) : (
                <p className="text-muted-foreground bg-muted/25 rounded-xl border border-dashed border-border/80 px-4 py-5 text-center text-sm">
                  No diagnosis recorded for this report.
                </p>
              )}
            </DetailSection>

            <DetailSection title="Visit context" description="Who was seen and when.">
              <DetailFields
                rows={[
                  { label: "Patient", value: detail.treatment_session.patient.full_name },
                  {
                    label: "Session",
                    value: `#${detail.treatment_session.session_no} · ${formatIsoDate(detail.treatment_session.session_date)}`,
                  },
                ]}
              />
            </DetailSection>

            <DetailSection title="Record" description="Identifiers and audit timestamps.">
              <DetailFields
                rows={[
                  { label: "Report ID", value: detail.id },
                  { label: "Patient ID", value: detail.treatment_session.patient.id },
                  { label: "Session ID", value: detail.treatment_session.id },
                  { label: "Created", value: formatIsoDateTime(detail.created_at) },
                  { label: "Updated", value: formatIsoDateTime(detail.updated_at) },
                ]}
              />
            </DetailSection>
          </div>
        ) : null}
      </EntityDetailDialog>
    </main>
  );
}
