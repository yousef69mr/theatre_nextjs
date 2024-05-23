import { useState } from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./button";
import { Input } from "./input";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useTranslation } from "react-i18next";
import { dir } from "i18next";
interface DataTableProps<TData, TValue> {
  columns: (ColumnDef<TData, TValue> & { type?: string })[];
  data: TData[];
  initialSearchKey?: string;
  type: "play" | "actor" | "executor" | "ticket" | "festival" | "user";
}

export function DataTable<TData, TValue>({
  columns,
  data,
  initialSearchKey,
  type,
}: DataTableProps<TData, TValue>) {
  const { t, i18n } = useTranslation();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [searchKey, setSearchKey] = useState<string | undefined>(
    initialSearchKey
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  // console.log(table.getColumn(searchKey || "")?.columnDef.type);
  return (
    <div>
      {searchKey && (
        <div className="flex items-center py-4">
          <Input
            placeholder={t(`actions.filterBy`, {
              ns: "common",
              instance: t(`tables.${searchKey}`, { ns: "constants" }),
            })}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) => {
              table.getColumn(searchKey)?.setFilterValue(event.target.value);
            }}
            className="max-w-sm ltr:mr-1 rtl:ml-1"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ltr:mr-auto rtl:ml-auto">
                {t("searchKey", { ns: "constants" })}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={dir(i18n.language) === "ltr" ? "end" : "start"}
            >
              {table
                .getAllColumns()
                .filter((column) => column.columnDef.meta?.type === "string")
                .map((column) => {
                  // console.log(column)
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={searchKey === column.id}
                      onCheckedChange={() => setSearchKey(column.id)}
                    >
                      {t(`tables.${column.id}`, { ns: "constants" })}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ltr:ml-auto">
                {t("columns", { ns: "constants" })}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {t(`tables.${column.id}`, { ns: "constants" })}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      align="center"
                      className="text-center"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
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
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} align="center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t("errors.notFound", {
                    ns: "constants",
                    instance: t(`${type}.plural`, { ns: "constants" }),
                  })}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {t("previous", { ns: "constants" })}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {t("next", { ns: "constants" })}
        </Button>
      </div>
    </div>
  );
}
