import { DataTable } from "@/components/data-table/data-table";
import { DetailFields, EntityDetailSheet } from "@/components/data-table/entity-detail-sheet";
import { ListSearchInput } from "@/components/data-table/list-search-input";
import { CreateStaffSheet, EditStaffSheet } from "@/components/record-sheet/create-record-sheet";
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
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { formatIsoDateTime, titleCase } from "@/lib/utils";
import { useStaffs } from "@/queries/useStaff";
import type { StaffsQuery } from "@/graphql/graphql";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/_app/staff")({
  component: PageComponent,
  ssr: false,
});

function PageComponent() {
  const { pagination, onPaginationChange, searchDraft, onSearchChange, querySearch } =
    useListRouteTableUrl({ defaultPageSize: 10 });

  const [createOpen, setCreateOpen] = useState(false);
  const [editStaff, setEditStaff] = useState<StaffsQuery["staffs"]["nodes"][number] | null>(null);
  const [detailStaff, setDetailStaff] = useState<StaffsQuery["staffs"]["nodes"][number] | null>(
    null,
  );

  const { data } = useStaffs({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    search: querySearch,
  });

  const columns = useMemo<ColumnDef<StaffsQuery["staffs"]["nodes"][number]>[]>(
    () => [
      {
        accessorKey: "full_name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={titleCase(column.id)} />
        ),
      },
      {
        accessorKey: "license_no",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={titleCase(column.id)} />
        ),
      },
      {
        accessorKey: "phone",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={titleCase(column.id)} />
        ),
      },
      {
        accessorKey: "specialization",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={titleCase(column.id)} />
        ),
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
                <DropdownMenuItem onClick={() => setDetailStaff(staff)}>
                  View details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEditStaff(staff)}>Edit staff</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [],
  );

  return (
    <main className="min-w-0 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <ListSearchInput
            id="staff-search"
            value={searchDraft}
            onChange={onSearchChange}
            placeholder="Search by name…"
            aria-label="Search staff"
            className="sm:w-72"
          />
          <Button className="w-full shrink-0 sm:w-auto" onClick={() => setCreateOpen(true)}>
            <Plus />
            New staff
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data?.staffs.nodes ?? []}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        totalCount={data?.staffs.total_count ?? 0}
        onRowClick={(row) => setDetailStaff(row)}
      />
      <CreateStaffSheet open={createOpen} onOpenChange={setCreateOpen} />
      <EditStaffSheet
        staff={editStaff}
        open={editStaff !== null}
        onOpenChange={(open) => {
          if (!open) setEditStaff(null);
        }}
      />
      <EntityDetailSheet
        open={detailStaff !== null}
        onOpenChange={(open) => {
          if (!open) setDetailStaff(null);
        }}
        title={detailStaff ? detailStaff.full_name : "Staff"}
        description={detailStaff ? detailStaff.user.email : undefined}
      >
        {detailStaff ? (
          <DetailFields
            rows={[
              { label: "Full name", value: detailStaff.full_name },
              { label: "Email", value: detailStaff.user.email },
              { label: "License no", value: detailStaff.license_no },
              { label: "Phone", value: detailStaff.phone },
              { label: "Specialization", value: detailStaff.specialization },
              { label: "Staff ID", value: detailStaff.id },
              { label: "Created", value: formatIsoDateTime(detailStaff.created_at) },
              { label: "Updated", value: formatIsoDateTime(detailStaff.updated_at) },
            ]}
          />
        ) : null}
      </EntityDetailSheet>
    </main>
  );
}
