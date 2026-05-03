import { DataTable } from "@/components/data-table/data-table";
import { ListSearchInput } from "@/components/data-table/list-search-input";
import { Badge } from "@/components/ui/badge";
import { CreateTreatmentSessionSheet } from "@/components/record-sheet/create-record-sheet";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { titleCase } from "@/lib/utils";
import { useTreatmentSessions } from "@/queries/useSession";
import type { SessionStatus, TreatmentSessionsQuery } from "@/graphql/graphql";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_app/session")({
  component: PageComponent,
  ssr: false,
});

function formatDate(iso: string) {
  const d = new Date(iso);
  let month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return [year, month, day].join("-");
}

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

export const columns: ColumnDef<TreatmentSessionsQuery["treatmentSessions"]["nodes"][number]>[] = [
  {
    accessorKey: "session_no",
    header: ({ column }) => <DataTableColumnHeader column={column} title={titleCase(column.id)} />,
  },
  {
    accessorKey: "session_date",
    header: ({ column }) => <DataTableColumnHeader column={column} title={titleCase(column.id)} />,
    cell: ({ row }) => (
      <div className="font-medium">{formatDate(row.getValue("session_date"))}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title={titleCase(column.id)} />,
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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(session.id)}>
              Copy session ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>View session</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function PageComponent() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [createOpen, setCreateOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput.trim(), 300);

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [debouncedSearch]);

  const { data } = useTreatmentSessions({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    filter: debouncedSearch.length > 0 ? { search: debouncedSearch } : undefined,
  });

  return (
    <main className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold">Sessions</h1>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <ListSearchInput
            id="session-search"
            value={searchInput}
            onChange={setSearchInput}
            placeholder="Patient, therapist, session #…"
            aria-label="Search sessions"
            className="sm:w-72"
          />
          <Button className="shrink-0" onClick={() => setCreateOpen(true)}>
            <Plus />
            New session
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data?.treatmentSessions.nodes ?? []}
        pagination={pagination}
        onPaginationChange={setPagination}
        totalCount={data?.treatmentSessions.total_count ?? 0}
      />
      <CreateTreatmentSessionSheet open={createOpen} onOpenChange={setCreateOpen} />
    </main>
  );
}
