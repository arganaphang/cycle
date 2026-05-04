import { DataTable, DataTableColumnMenu } from "@/components/data-table/data-table";
import { DetailFields, EntityDetailSheet } from "@/components/data-table/entity-detail-sheet";
import { ListSearchInput } from "@/components/data-table/list-search-input";
import { Badge } from "@/components/ui/badge";
import { CreatePatientSheet } from "@/components/record-sheet/create-record-sheet";
import { useListRouteTableUrl } from "@/hooks/use-list-route-table-url";
import { createFileRoute } from "@tanstack/react-router";
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
import { usePatients } from "@/queries/usePatient";
import type { PatientSortField, PatientsQuery } from "@/graphql/graphql";
import { useMemo, useState } from "react";

function patientSortField(columnId: string): PatientSortField | undefined {
  const map: Record<string, PatientSortField> = {
    full_name: "FULL_NAME",
    medical_record_no: "MEDICAL_RECORD_NO",
    date_of_birth: "DATE_OF_BIRTH",
    gender: "GENDER",
  };
  return map[columnId];
}

export const Route = createFileRoute("/_app/patient")({
  component: PageComponent,
  ssr: false,
});

function PageComponent() {
  const {
    pagination,
    onPaginationChange,
    sorting,
    onSortingChange,
    searchDraft,
    onSearchChange,
    querySearch,
  } = useListRouteTableUrl({ defaultPageSize: 10 });

  const [createOpen, setCreateOpen] = useState(false);
  const [detail, setDetail] = useState<PatientsQuery["patients"]["nodes"][number] | null>(null);

  const firstSort = sorting[0];
  const sortBy = firstSort ? patientSortField(firstSort.id) : undefined;
  const sortOrder = sortBy && firstSort ? (firstSort.desc ? "DESC" : "ASC") : undefined;

  const { data } = usePatients({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    search: querySearch,
    sortBy,
    sortOrder,
  });

  const columns = useMemo<ColumnDef<PatientsQuery["patients"]["nodes"][number]>[]>(
    () => [
      {
        accessorKey: "full_name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={titleCase(column.id)} />
        ),
      },
      {
        accessorKey: "medical_record_no",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={titleCase(column.id)} />
        ),
      },
      {
        accessorKey: "date_of_birth",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={titleCase(column.id)} />
        ),
        cell: ({ row }) => {
          return (
            <div className="font-medium">
              {formatIsoDate(row.getValue("date_of_birth") as string)}
            </div>
          );
        },
      },
      {
        accessorKey: "gender",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={titleCase(column.id)} />
        ),
        cell: ({ row }) => {
          return <Badge variant="outline">{row.getValue("gender")}</Badge>;
        },
      },
      {
        accessorKey: "phone",
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={titleCase(column.id)} />
        ),
      },
      {
        accessorKey: "email",
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={titleCase(column.id)} />
        ),
      },
      {
        id: "actions",
        enableSorting: false,
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
                <DropdownMenuItem onClick={() => setDetail(patient)}>View details</DropdownMenuItem>
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
      <DataTable
        columns={columns}
        data={data?.patients.nodes ?? []}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        sorting={sorting}
        onSortingChange={onSortingChange}
        totalCount={data?.patients.total_count ?? 0}
        onRowClick={(row) => setDetail(row)}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            <ListSearchInput
              id="patient-search"
              value={searchDraft}
              onChange={onSearchChange}
              placeholder="Search by name…"
              aria-label="Search patients"
              className="sm:w-72"
            />
            <Button className="w-full shrink-0 sm:w-auto" onClick={() => setCreateOpen(true)}>
              <Plus />
              New patient
            </Button>
            <DataTableColumnMenu />
          </div>
        </div>
      </DataTable>
      <CreatePatientSheet open={createOpen} onOpenChange={setCreateOpen} />
      <EntityDetailSheet
        open={detail !== null}
        onOpenChange={(open) => {
          if (!open) setDetail(null);
        }}
        title={detail ? detail.full_name : "Patient"}
        description={detail ? `Medical record ${detail.medical_record_no}` : undefined}
      >
        {detail ? (
          <DetailFields
            rows={[
              { label: "Full name", value: detail.full_name },
              { label: "MRN", value: detail.medical_record_no },
              { label: "Date of birth", value: formatIsoDate(detail.date_of_birth) },
              { label: "Gender", value: detail.gender },
              { label: "Phone", value: detail.phone },
              { label: "Email", value: detail.email },
              {
                label: "Address",
                value: detail.address ? (
                  <span className="whitespace-pre-wrap">{detail.address}</span>
                ) : (
                  "—"
                ),
              },
              { label: "Patient ID", value: detail.id },
              { label: "Created", value: formatIsoDateTime(detail.created_at) },
              { label: "Updated", value: formatIsoDateTime(detail.updated_at) },
            ]}
          />
        ) : null}
      </EntityDetailSheet>
    </main>
  );
}
