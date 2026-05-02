import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import type { Patient } from "@/types/patient";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { faker } from "@faker-js/faker";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { titleCase } from "@/lib/utils";

export const Route = createFileRoute("/_app/patient")({
  component: PageComponent,
  ssr: false,
});

export const columns: ColumnDef<Patient>[] = [
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
      const payment = row.original;

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
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

const data: Patient[] = (() => {
  return [...Array(1000).keys()].map(() => {
    const p: Patient = {
      id: faker.string.uuid(),
      medical_record_no: faker.string.uuid(),
      full_name: faker.person.fullName(),
      date_of_birth: faker.date.birthdate(),
      gender: faker.helpers.arrayElement(["Mele", "Female"]),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      created_at: new Date("2024-09-12"),
      updated_at: new Date("2024-09-12"),
    };
    return p;
  });
})();

function PageComponent() {
  return (
    <main className="">
      <DataTable columns={columns} data={data} />
    </main>
  );
}
