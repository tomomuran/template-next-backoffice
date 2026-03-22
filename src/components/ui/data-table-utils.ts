type DataTableValue = string | number | boolean | Date | null | undefined;

export interface DataTableColumnDefinition<T> {
  key: string;
  header: string;
  sortable?: boolean;
  getSearchValue?: (row: T) => DataTableValue;
  getSortValue?: (row: T) => DataTableValue;
  getCsvValue?: (row: T) => DataTableValue;
}

export interface DataTableFilterOption {
  label: string;
  value: string;
}

export interface DataTableFilterDefinition<T> {
  key: string;
  label: string;
  options: DataTableFilterOption[];
  allLabel?: string;
  defaultValue?: string;
  getValue: (row: T) => DataTableValue;
}

export interface DataTableSortState {
  key: string;
  direction: "asc" | "desc";
}

function normalizeValue(value: DataTableValue) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

export function filterRowsBySearch<T>(rows: T[], columns: DataTableColumnDefinition<T>[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return rows;
  }

  const searchableColumns = columns.filter((column) => column.getSearchValue);
  if (searchableColumns.length === 0) {
    return rows;
  }

  const queryTerms = normalizedQuery.split(/\s+/).filter(Boolean);
  return rows.filter((row) =>
    queryTerms.every((term) =>
      searchableColumns.some((column) => normalizeValue(column.getSearchValue?.(row)).toLowerCase().includes(term))
    )
  );
}

export function filterRowsByFilters<T>(
  rows: T[],
  filters: DataTableFilterDefinition<T>[],
  activeFilters: Record<string, string>
) {
  if (filters.length === 0) {
    return rows;
  }

  return rows.filter((row) =>
    filters.every((filter) => {
      const activeValue = activeFilters[filter.key] ?? filter.defaultValue ?? "";
      if (!activeValue) {
        return true;
      }

      return normalizeValue(filter.getValue(row)) === activeValue;
    })
  );
}

export function sortRows<T>(rows: T[], columns: DataTableColumnDefinition<T>[], sort: DataTableSortState | null) {
  if (!sort) {
    return rows;
  }

  const column = columns.find((candidate) => candidate.key === sort.key);
  if (!column?.sortable || !column.getSortValue) {
    return rows;
  }

  const sortedRows = [...rows];
  sortedRows.sort((left, right) => {
    const leftValue = normalizeValue(column.getSortValue?.(left)).toLowerCase();
    const rightValue = normalizeValue(column.getSortValue?.(right)).toLowerCase();

    if (leftValue < rightValue) {
      return sort.direction === "asc" ? -1 : 1;
    }

    if (leftValue > rightValue) {
      return sort.direction === "asc" ? 1 : -1;
    }

    return 0;
  });

  return sortedRows;
}

export function paginateRows<T>(rows: T[], page: number, pageSize: number) {
  const safePage = Math.max(page, 1);
  const safePageSize = Math.max(pageSize, 1);
  const startIndex = (safePage - 1) * safePageSize;
  return rows.slice(startIndex, startIndex + safePageSize);
}

export function buildCsv<T>(rows: T[], columns: DataTableColumnDefinition<T>[]) {
  const csvReadyColumns = columns.filter((column) => column.getCsvValue);
  const header = csvReadyColumns.map((column) => escapeCsvValue(column.header)).join(",");
  const lines = rows.map((row) =>
    csvReadyColumns.map((column) => escapeCsvValue(normalizeValue(column.getCsvValue?.(row)))).join(",")
  );

  return [header, ...lines].join("\n");
}

function escapeCsvValue(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}
