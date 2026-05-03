import { DataTable } from "@/components/data-table/data-table";
import { ListSearchInput } from "@/components/data-table/list-search-input";
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
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

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
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput.trim(), 300);

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [debouncedSearch]);

  const { data } = usePatients({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    search: debouncedSearch.length > 0 ? debouncedSearch : undefined,
  });

  return (
    <main className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold">Patients</h1>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <ListSearchInput
            id="patient-search"
            value={searchInput}
            onChange={setSearchInput}
            placeholder="Search by name…"
            aria-label="Search patients"
            className="sm:w-72"
          />
          <Button className="shrink-0" onClick={() => setCreateOpen(true)}>
            <Plus />
            New patient
          </Button>
        </div>
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
