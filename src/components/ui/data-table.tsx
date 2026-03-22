"use client";

import type { ReactNode } from "react";
import { useDeferredValue, useEffect, useId, useState } from "react";
import { ArrowDownAZ, ArrowUpZA, ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  buildCsv,
  filterRowsByFilters,
  filterRowsBySearch,
  paginateRows,
  sortRows,
  type DataTableColumnDefinition,
  type DataTableFilterDefinition,
  type DataTableSortState
} from "@/components/ui/data-table-utils";

export interface DataTableColumn<T> extends DataTableColumnDefinition<T> {
  render: (row: T) => ReactNode;
  cellClassName?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  emptyMessage: string;
  filters?: DataTableFilterDefinition<T>[];
  initialSort?: DataTableSortState | null;
  searchPlaceholder?: string;
  searchLabel?: string;
  csvFileName?: string;
  pageSizeOptions?: number[];
}

export function DataTable<T>({
  columns,
  rows,
  emptyMessage,
  filters = [],
  initialSort = null,
  searchPlaceholder = "検索",
  searchLabel = "検索",
  csvFileName = "export.csv",
  pageSizeOptions = [10, 25, 50]
}: DataTableProps<T>) {
  const searchId = useId();
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [sort, setSort] = useState<DataTableSortState | null>(initialSort);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0] ?? 10);
  const [page, setPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(() =>
    Object.fromEntries(filters.map((filter) => [filter.key, filter.defaultValue ?? ""]))
  );

  const searchedRows = filterRowsBySearch(rows, columns, deferredSearchQuery);
  const filteredRows = filterRowsByFilters(searchedRows, filters, activeFilters);
  const sortedRows = sortRows(filteredRows, columns, sort);
  const totalRows = sortedRows.length;
  const totalPages = Math.max(Math.ceil(totalRows / pageSize), 1);
  const resolvedPage = Math.min(page, totalPages);
  const pagedRows = paginateRows(sortedRows, resolvedPage, pageSize);
  const hasRows = totalRows > 0;
  const pageStart = hasRows ? (resolvedPage - 1) * pageSize + 1 : 0;
  const pageEnd = hasRows ? Math.min(resolvedPage * pageSize, totalRows) : 0;

  useEffect(() => {
    if (page !== resolvedPage) {
      setPage(resolvedPage);
    }
  }, [page, resolvedPage]);

  function updateFilter(key: string, value: string) {
    setActiveFilters((current) => ({
      ...current,
      [key]: value
    }));
    setPage(1);
  }

  function toggleSort(key: string) {
    setPage(1);
    setSort((current) => {
      if (!current || current.key !== key) {
        return { key, direction: "asc" };
      }

      if (current.direction === "asc") {
        return { key, direction: "desc" };
      }

      return null;
    });
  }

  function downloadCsv() {
    const csv = buildCsv(sortedRows, columns);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = csvFileName;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-background p-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1.2fr)_repeat(auto-fit,minmax(180px,1fr))] md:items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor={searchId}>
              {searchLabel}
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id={searchId}
                className="pl-9"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          {filters.map((filter) => (
            <div className="space-y-2" key={filter.key}>
              <label className="text-sm font-medium" htmlFor={`${searchId}-${filter.key}`}>
                {filter.label}
              </label>
              <select
                id={`${searchId}-${filter.key}`}
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                value={activeFilters[filter.key] ?? filter.defaultValue ?? ""}
                onChange={(event) => updateFilter(filter.key, event.target.value)}
              >
                <option value="">{filter.allLabel ?? "すべて"}</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm text-muted-foreground" htmlFor={`${searchId}-page-size`}>
            表示件数
          </label>
          <select
            id={`${searchId}-page-size`}
            className="flex h-10 rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            value={String(pageSize)}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <Button type="button" variant="outline" onClick={downloadCsv}>
            <Download className="mr-2 h-4 w-4" />
            CSV Export
          </Button>
        </div>
      </div>

      {!hasRows ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-sm text-muted-foreground">{emptyMessage}</div>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => {
                    const isSorted = sort?.key === column.key;
                    const sortable = Boolean(column.sortable && column.getSortValue);
                    return (
                      <TableHead key={column.key}>
                        {sortable ? (
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 text-left font-medium"
                            onClick={() => toggleSort(column.key)}
                          >
                            <span>{column.header}</span>
                            {isSorted ? (
                              sort?.direction === "asc" ? (
                                <ArrowDownAZ className="h-4 w-4" />
                              ) : (
                                <ArrowUpZA className="h-4 w-4" />
                              )
                            ) : null}
                          </button>
                        ) : (
                          column.header
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedRows.map((row, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell className={cn(column.cellClassName)} key={column.key}>
                        {column.render(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
            <p>
              {pageStart}-{pageEnd} / {totalRows} 件
            </p>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setPage((current) => Math.max(current - 1, 1))} disabled={resolvedPage <= 1}>
                <ChevronLeft className="mr-1 h-4 w-4" />
                Prev
              </Button>
              <span>
                {resolvedPage} / {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
                disabled={resolvedPage >= totalPages}
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
