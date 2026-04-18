"use client";

import type { ReactNode } from "react";
import { useDeferredValue, useEffect, useId, useState } from "react";
import { SortAscending, SortDescending, CaretLeft, CaretRight, DownloadSimple, MagnifyingGlass } from "@phosphor-icons/react";
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
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-background px-3.5 py-2">
        <div className="flex h-7 min-w-0 flex-[1_0_180px] items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2 md:flex-[0_0_260px]">
          <MagnifyingGlass className="h-3.5 w-3.5 text-muted-foreground" />
          <label htmlFor={searchId} className="sr-only">{searchLabel}</label>
          <input
            id={searchId}
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setPage(1);
            }}
            className="flex-1 border-none bg-transparent text-[13.5px] text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        {filters.map((filter) => (
          <div key={filter.key}>
            <label htmlFor={`${searchId}-${filter.key}`} className="sr-only">{filter.label}</label>
            <select
              id={`${searchId}-${filter.key}`}
              className="flex h-7 rounded-md border border-border bg-background px-2 text-[13px] text-foreground outline-none"
              value={activeFilters[filter.key] ?? filter.defaultValue ?? ""}
              onChange={(event) => updateFilter(filter.key, event.target.value)}
            >
              <option value="">{filter.allLabel ?? `All ${filter.label}`}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div className="flex-1" />

        <label htmlFor={`${searchId}-page-size`} className="sr-only">表示件数</label>
        <select
          id={`${searchId}-page-size`}
          className="flex h-7 rounded-md border border-border bg-background px-2 text-[13px] text-muted-foreground outline-none"
          value={String(pageSize)}
          onChange={(event) => {
            setPageSize(Number(event.target.value));
            setPage(1);
          }}
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}件
            </option>
          ))}
        </select>

        <Button type="button" variant="outline" size="sm" onClick={downloadCsv}>
          <DownloadSimple className="h-3.5 w-3.5" />
          CSV
        </Button>
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
                                <SortAscending className="h-4 w-4" />
                              ) : (
                                <SortDescending className="h-4 w-4" />
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
                <CaretLeft className="mr-1 h-4 w-4" />
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
                <CaretRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
