import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";
import React from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  /** Server-side sort: pass with `onSortingChange`; avoids reordering rows client-side. */
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  totalCount?: number;
  /** Opens detail view; clicks on the actions column do not trigger this. */
  onRowClick?: (row: TData) => void;
  /** Renders above the table (e.g. search, actions). */
  children?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  totalCount,
  onRowClick,
  children,
}: DataTableProps<TData, TValue>) {
  const [internalPagination, setInternalPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([]);
  const currentPagination = pagination ?? internalPagination;
  const isManualPagination = totalCount !== undefined;
  const isManualSorting = sorting !== undefined && onSortingChange !== undefined;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(isManualPagination
      ? {
          manualPagination: true,
          rowCount: totalCount,
        }
      : {
          getPaginationRowModel: getPaginationRowModel(),
        }),
    ...(isManualSorting ? { manualSorting: true } : {}),
    onPaginationChange: onPaginationChange ?? setInternalPagination,
    state: {
      pagination: currentPagination,
      sorting: isManualSorting ? sorting : internalSorting,
    },
    onSortingChange: isManualSorting ? onSortingChange : setInternalSorting,
  });

  const headerCount = table.getHeaderGroups()[0]?.headers.length ?? columns.length;
  const totalColSpan = Math.max(1, headerCount);

  return (
    <>
      {children}
      <div className="min-w-0 overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={
                    onRowClick
                      ? "cursor-pointer hover:bg-muted/50 data-[state=selected]:hover:bg-muted"
                      : undefined
                  }
                  onClick={
                    onRowClick
                      ? () => {
                          onRowClick(row.original);
                        }
                      : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={
                        cell.column.id === "actions"
                          ? (e) => {
                              e.stopPropagation();
                            }
                          : undefined
                      }
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={totalColSpan} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </>
  );
}
