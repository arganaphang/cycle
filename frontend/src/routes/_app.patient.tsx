import { DataTable } from "@/components/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { CreatePatientSheet } from "@/components/record-sheet/create-record-sheet";
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
import { usePatients } from "@/queries/usePatient";
import type { PatientsQuery } from "@/graphql/graphql";
import { useState } from "react";

export const Route = createFileRoute("/_app/patient")({
  component: PageComponent,
  ssr: false,
});

export const columns: ColumnDef<PatientsQuery["patients"]["nodes"][number]>[] = [
  {
    accessorKey: "full_name",
    header: ({ column }) => <DataTableColumnHeader column={column} title={titleCase(column.id)} />,
  },
  {
    accessorKey: "medical_record_no",
    header: ({ column }) => <DataTableColumnHeader column={column} title={titleCase(column.id)} />,
  },
  {
    accessorKey: "date_of_birth",
    header: ({ column }) => <DataTableColumnHeader column={column} title={titleCase(column.id)} />,
    cell: ({ row }) => {
      let d = new Date(row.getValue("date_of_birth")),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      const formatted = [year, month, day].join("-");

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "gender",
    header: ({ column }) => <DataTableColumnHeader column={column} title={titleCase(column.id)} />,
    cell: ({ row }) => {
      return <Badge variant="outline">{row.getValue("gender")}</Badge>;
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => <DataTableColumnHeader column={column} title={titleCase(column.id)} />,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title={titleCase(column.id)} />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const patient = row.original;

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(patient.id)}>
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
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
  const { data } = usePatients({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
  });

  return (
    <main className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Patients</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus />
          New patient
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data?.patients.nodes ?? []}
        pagination={pagination}
        onPaginationChange={setPagination}
        totalCount={data?.patients.total_count ?? 0}
      />
      <CreatePatientSheet open={createOpen} onOpenChange={setCreateOpen} />
    </main>
  );
}
