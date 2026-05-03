import { DataTable } from "@/components/data-table/data-table";
import { CreateTreatmentSessionReportSheet } from "@/components/record-sheet/create-record-sheet";
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
import { useTreatmentSessionReports } from "@/queries/useReport";
import type { TreatmentSessionReportsQuery } from "@/graphql/graphql";
import { useState } from "react";

export const Route = createFileRoute("/_app/report")({
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

export const columns: ColumnDef<
  TreatmentSessionReportsQuery["treatmentSessionReports"]["nodes"][number]
>[] = [
  {
    id: "patient",
    accessorFn: (row) => row.treatment_session.patient.full_name,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Patient" />,
  },
  {
    id: "session_no",
    accessorFn: (row) => row.treatment_session.session_no,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Session #" />,
  },
  {
    id: "session_date",
    accessorFn: (row) => row.treatment_session.session_date,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Session date" />,
    cell: ({ row }) => (
      <div className="font-medium">{formatDate(row.original.treatment_session.session_date)}</div>
    ),
  },
  {
    accessorKey: "diagnosis",
    header: ({ column }) => <DataTableColumnHeader column={column} title={titleCase(column.id)} />,
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
    header: ({ column }) => <DataTableColumnHeader column={column} title={titleCase(column.id)} />,
    cell: ({ row }) => <div className="font-medium">{formatDate(row.getValue("created_at"))}</div>,
  },
  {
    id: "actions",
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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(report.id)}>
              Copy report ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>View report</DropdownMenuItem>
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
  const { data } = useTreatmentSessionReports({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
  });

  return (
    <main className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Reports</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus />
          New report
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data?.treatmentSessionReports.nodes ?? []}
        pagination={pagination}
        onPaginationChange={setPagination}
        totalCount={data?.treatmentSessionReports.total_count ?? 0}
      />
      <CreateTreatmentSessionReportSheet open={createOpen} onOpenChange={setCreateOpen} />
    </main>
  );
}
