import { DataTable, DataTableColumnMenu } from "@/components/data-table/data-table";
import { DetailFields, EntityDetailSheet } from "@/components/data-table/entity-detail-sheet";
import { ListSearchInput } from "@/components/data-table/list-search-input";
import { Badge } from "@/components/ui/badge";
import {
  CreateTreatmentSessionReportSheet,
  CreateTreatmentSessionSheet,
} from "@/components/record-sheet/create-record-sheet";
import { useListRouteTableUrl } from "@/hooks/use-list-route-table-url";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { formatIsoDate, formatIsoDateTime, titleCase } from "@/lib/utils";
import { useTreatmentSessions } from "@/queries/useSession";
import type {
  SessionStatus,
  TreatmentSessionSortField,
  TreatmentSessionsQuery,
} from "@/graphql/graphql";
import { updateTreatmentSessionStatus } from "@/mutations/update";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

const SESSION_STATUS_OPTIONS: { value: SessionStatus; label: string }[] = [
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

function treatmentSessionSortField(columnId: string): TreatmentSessionSortField | undefined {
  const map: Record<string, TreatmentSessionSortField> = {
    session_no: "SESSION_NO",
    session_date: "SESSION_DATE",
    status: "STATUS",
    patient: "PATIENT_NAME",
    therapist: "STAFF_NAME",
  };
  return map[columnId];
}

export const Route = createFileRoute("/_app/session")({
  component: PageComponent,
  ssr: false,
});

function statusBadgeVariant(
  status: SessionStatus,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "COMPLETED":
      return "secondary";
    case "CANCELLED":
      return "destructive";
    case "IN_PROGRESS":
      return "default";
    case "SCHEDULED":
    default:
      return "outline";
  }
}

function PageComponent() {
  const queryClient = useQueryClient();
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
  const [createReportOpen, setCreateReportOpen] = useState(false);
  const [reportPresetSession, setReportPresetSession] = useState<
    TreatmentSessionsQuery["treatmentSessions"]["nodes"][number] | null
  >(null);
  const [detail, setDetail] = useState<
    TreatmentSessionsQuery["treatmentSessions"]["nodes"][number] | null
  >(null);

  const quickStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: SessionStatus }) =>
      updateTreatmentSessionStatus(id, { status }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["treatmentSessions"] });
    },
  });

  const openAddReport = useCallback(
    (session: TreatmentSessionsQuery["treatmentSessions"]["nodes"][number]) => {
      setReportPresetSession(session);
      setCreateReportOpen(true);
    },
    [],
  );

  const firstSort = sorting[0];
  const sortBy = firstSort ? treatmentSessionSortField(firstSort.id) : undefined;
  const sortOrder = sortBy && firstSort ? (firstSort.desc ? "DESC" : "ASC") : undefined;

  const { data } = useTreatmentSessions({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    filter: querySearch ? { search: querySearch } : undefined,
    sortBy,
    sortOrder,
  });

  const columns = useMemo<
    ColumnDef<TreatmentSessionsQuery["treatmentSessions"]["nodes"][number]>[]
  >(
    () => [
      {
        accessorKey: "session_no",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={titleCase(column.id)} />
        ),
      },
      {
        accessorKey: "session_date",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={titleCase(column.id)} />
        ),
        cell: ({ row }) => (
          <div className="font-medium">{formatIsoDate(row.getValue("session_date") as string)}</div>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={titleCase(column.id)} />
        ),
        cell: ({ row }) => {
          const status = row.getValue("status") as SessionStatus;
          return <Badge variant={statusBadgeVariant(status)}>{status.replace(/_/g, " ")}</Badge>;
        },
      },
      {
        id: "patient",
        accessorFn: (row) => row.patient.full_name,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Patient" />,
      },
      {
        id: "therapist",
        accessorFn: (row) => row.staff.full_name,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Therapist" />,
      },
      {
        id: "actions",
        enableSorting: false,
        cell: ({ row }) => {
          const session = row.original;

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
                <DropdownMenuItem onClick={() => setDetail(session)}>View detail</DropdownMenuItem>
                <DropdownMenuItem onClick={() => openAddReport(session)}>
                  Add report
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Change status</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {SESSION_STATUS_OPTIONS.map(({ value, label }) => (
                      <DropdownMenuItem
                        key={value}
                        disabled={session.status === value || quickStatusMutation.isPending}
                        onClick={() =>
                          quickStatusMutation.mutate({
                            id: session.id,
                            status: value,
                          })
                        }
                      >
                        {label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(session.id)}>
                  Copy session ID
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [openAddReport, quickStatusMutation],
  );

  return (
    <main className="min-w-0 space-y-4">
      <DataTable
        columns={columns}
        data={data?.treatmentSessions.nodes ?? []}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        sorting={sorting}
        onSortingChange={onSortingChange}
        totalCount={data?.treatmentSessions.total_count ?? 0}
        onRowClick={(row) => setDetail(row)}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            <ListSearchInput
              id="session-search"
              value={searchDraft}
              onChange={onSearchChange}
              placeholder="Patient, therapist, session #…"
              aria-label="Search sessions"
              className="sm:w-72"
            />
            <Button className="w-full shrink-0 sm:w-auto" onClick={() => setCreateOpen(true)}>
              <Plus />
              New session
            </Button>
            <DataTableColumnMenu />
          </div>
        </div>
      </DataTable>
      <CreateTreatmentSessionSheet open={createOpen} onOpenChange={setCreateOpen} />
      <CreateTreatmentSessionReportSheet
        open={createReportOpen}
        onOpenChange={(open) => {
          setCreateReportOpen(open);
          if (!open) setReportPresetSession(null);
        }}
        presetSessionId={reportPresetSession?.id}
        presetSessionLabel={
          reportPresetSession
            ? `#${reportPresetSession.session_no} · ${reportPresetSession.patient.full_name}`
            : undefined
        }
      />
      <EntityDetailSheet
        open={detail !== null}
        onOpenChange={(open) => {
          if (!open) setDetail(null);
        }}
        title={detail ? `Session #${detail.session_no}` : "Session"}
        description={
          detail
            ? `${formatIsoDate(detail.session_date)} · ${detail.status.replace(/_/g, " ")}`
            : undefined
        }
      >
        {detail ? (
          <DetailFields
            rows={[
              { label: "Session no.", value: String(detail.session_no) },
              { label: "Session date", value: formatIsoDate(detail.session_date) },
              { label: "Status", value: detail.status.replace(/_/g, " ") },
              { label: "Patient", value: detail.patient.full_name },
              { label: "Patient ID", value: detail.patient.id },
              { label: "Therapist", value: detail.staff.full_name },
              { label: "Therapist ID", value: detail.staff.id },
              { label: "Session ID", value: detail.id },
              { label: "Created", value: formatIsoDateTime(detail.created_at) },
              { label: "Updated", value: formatIsoDateTime(detail.updated_at) },
            ]}
          />
        ) : null}
      </EntityDetailSheet>
    </main>
  );
}
