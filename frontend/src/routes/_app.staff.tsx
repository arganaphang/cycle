import { DataTable } from "@/components/data-table";
import { CreateStaffSheet } from "@/components/create-record-sheet";
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
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { titleCase } from "@/lib/utils";
import { useStaffs } from "@/queries/useStaff";
import type { StaffsQuery } from "@/graphql/graphql";
import { useState } from "react";

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
  const { data } = useStaffs({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
  });

  return (
    <main className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Staff</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus />
          New staff
        </Button>
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
