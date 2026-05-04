import { DataTable, DataTableColumnMenu } from "@/components/data-table/data-table";
import {
  DetailFields,
  DetailSection,
  EntityDetailDialog,
} from "@/components/data-table/entity-detail-dialog";
import { ListSearchInput } from "@/components/data-table/list-search-input";
import { TreatmentSessionReportPanel } from "@/components/session-report/treatment-session-report-panel";
import { Badge } from "@/components/ui/badge";
import { FormError } from "@/components/record-sheet/create-record-form-controls";
import {
  CreateTreatmentSessionReportSheet,
  CreateTreatmentSessionSheet,
} from "@/components/record-sheet/create-record-sheet";
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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { formatIsoDate, formatIsoDateTime, titleCase } from "@/lib/utils";
import { useTreatmentSessions } from "@/queries/useSession";
import { useTreatmentSessionDetail } from "@/queries/useTreatmentSessionDetail";
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
  validateSearch: (search: Record<string, unknown>): { sessionId?: string } => ({
    sessionId:
      typeof search.sessionId === "string" && search.sessionId.length > 0
        ? search.sessionId
        : undefined,
  }),
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
  const navigate = useNavigate({ from: Route.fullPath });
  const { sessionId } = Route.useSearch();

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

  const detailOpen = Boolean(sessionId);
  const detailQuery = useTreatmentSessionDetail(sessionId);

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

  const openSessionDetail = useCallback(
    (id: string) => {
      navigate({
        search: (prev) => ({ ...(prev as object), sessionId: id }) as typeof prev,
        replace: true,
      });
    },
    [navigate],
  );

  const closeSessionDetail = useCallback(() => {
    navigate({
      search: (prev) => {
        const next = { ...(prev as Record<string, unknown>) };
        delete next.sessionId;
        return next as typeof prev;
      },
      replace: true,
    });
  }, [navigate]);

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
                <DropdownMenuItem onClick={() => openSessionDetail(session.id)}>
                  View detail
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    console.log("session table: export / print", { sessionId: session.id });
                  }}
                >
                  <Printer className="mr-2 size-4" />
                  Print
                </DropdownMenuItem>
                {!session.report ? (
                  <DropdownMenuItem onClick={() => openAddReport(session)}>
                    Add report
                  </DropdownMenuItem>
                ) : null}
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
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [openAddReport, openSessionDetail, quickStatusMutation],
  );

  const sessionFull = detailQuery.data?.treatmentSession ?? null;
  const detailLoadError =
    detailOpen &&
    sessionId &&
    !detailQuery.isLoading &&
    !detailQuery.isFetching &&
    sessionFull === null;

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
        onRowClick={(row) => openSessionDetail(row.id)}
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
      <EntityDetailDialog
        open={detailOpen}
        onOpenChange={(open) => {
          if (!open) closeSessionDetail();
        }}
        title={sessionFull ? `Session #${sessionFull.session_no}` : "Session"}
        description={
          sessionFull
            ? `${formatIsoDate(sessionFull.session_date)} · ${sessionFull.status.replace(/_/g, " ")}`
            : undefined
        }
        contentClassName="sm:max-w-2xl"
      >
        {detailQuery.isLoading || detailQuery.isFetching ? (
          <p className="text-muted-foreground text-sm">Loading session…</p>
        ) : detailLoadError ? (
          <FormError message="Session could not be loaded. It may have been removed." />
        ) : sessionFull ? (
          <>
            <DetailSection
              title="Session & contacts"
              description="Scheduling, people involved, and administrative notes."
              actions={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log("session detail: export / print", { sessionId: sessionFull.id });
                  }}
                >
                  <Printer className="size-4" />
                  Print
                </Button>
              }
            >
              <DetailFields
                rows={[
                  { label: "Session no.", value: String(sessionFull.session_no) },
                  { label: "Session date", value: formatIsoDate(sessionFull.session_date) },
                  { label: "Status", value: sessionFull.status.replace(/_/g, " ") },
                  { label: "Patient", value: sessionFull.patient.full_name },
                  { label: "Medical record no.", value: sessionFull.patient.medical_record_no },
                  {
                    label: "Date of birth",
                    value: formatIsoDate(sessionFull.patient.date_of_birth),
                  },
                  { label: "Gender", value: titleCase(sessionFull.patient.gender) },
                  ...(sessionFull.patient.phone
                    ? [{ label: "Patient phone", value: sessionFull.patient.phone }]
                    : []),
                  ...(sessionFull.patient.email
                    ? [{ label: "Patient email", value: sessionFull.patient.email }]
                    : []),
                  ...(sessionFull.patient.address
                    ? [
                        {
                          label: "Address",
                          value: (
                            <span className="whitespace-pre-wrap">
                              {sessionFull.patient.address}
                            </span>
                          ),
                        },
                      ]
                    : []),
                  { label: "Therapist", value: sessionFull.staff.full_name },
                  ...(sessionFull.staff.specialization
                    ? [{ label: "Specialization", value: sessionFull.staff.specialization }]
                    : []),
                  ...(sessionFull.staff.license_no
                    ? [{ label: "License no.", value: sessionFull.staff.license_no }]
                    : []),
                  ...(sessionFull.note?.trim()
                    ? [
                        {
                          label: "Session note",
                          value: <span className="whitespace-pre-wrap">{sessionFull.note}</span>,
                        },
                      ]
                    : []),
                  { label: "Created", value: formatIsoDateTime(sessionFull.created_at) },
                  { label: "Updated", value: formatIsoDateTime(sessionFull.updated_at) },
                ]}
              />
            </DetailSection>
            <TreatmentSessionReportPanel session={sessionFull} />
          </>
        ) : null}
      </EntityDetailDialog>
    </main>
  );
}
