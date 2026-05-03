import { DataTable } from "@/components/data-table/data-table";
import { ListSearchInput } from "@/components/data-table/list-search-input";
import { CreateStaffSheet } from "@/components/record-sheet/create-record-sheet";
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
import { useStaffs } from "@/queries/useStaff";
import type { StaffsQuery } from "@/graphql/graphql";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_app/staff")({
  component: PageComponent,
  ssr: false,
});

export const columns: ColumnDef<StaffsQuery["staffs"]["nodes"][number]>[] = [
  {
    accessorKey: "full_name",
    header: ({ column }) => <DataTableColumnHeader column={column} title={titleCase(column.id)} />,
  },
  {
    accessorKey: "license_no",
    header: ({ column }) => <DataTableColumnHeader column={column} title={titleCase(column.id)} />,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => <DataTableColumnHeader column={column} title={titleCase(column.id)} />,
  },
  {
    accessorKey: "specialization",
    header: ({ column }) => <DataTableColumnHeader column={column} title={titleCase(column.id)} />,
  },
  {
    id: "email",
    accessorFn: (row) => row.user.email,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const staff = row.original;

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(staff.id)}>
              Copy staff ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>View profile</DropdownMenuItem>
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

  const { data } = useStaffs({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    search: debouncedSearch.length > 0 ? debouncedSearch : undefined,
  });

  return (
    <main className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold">Staff</h1>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <ListSearchInput
            id="staff-search"
            value={searchInput}
            onChange={setSearchInput}
            placeholder="Search by name…"
            aria-label="Search staff"
            className="sm:w-72"
          />
          <Button className="shrink-0" onClick={() => setCreateOpen(true)}>
            <Plus />
            New staff
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data?.staffs.nodes ?? []}
        pagination={pagination}
        onPaginationChange={setPagination}
        totalCount={data?.staffs.total_count ?? 0}
      />
      <CreateStaffSheet open={createOpen} onOpenChange={setCreateOpen} />
    </main>
  );
}
