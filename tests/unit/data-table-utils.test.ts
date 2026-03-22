import { describe, expect, it } from "vitest";
import {
  buildCsv,
  filterRowsByFilters,
  filterRowsBySearch,
  paginateRows,
  sortRows,
  type DataTableColumnDefinition,
  type DataTableFilterDefinition
} from "@/components/ui/data-table-utils";

interface Row {
  name: string;
  status: "active" | "archived";
  updatedAt: string;
}

const rows: Row[] = [
  { name: "Hanako Backoffice", status: "active", updatedAt: "2026-03-21T10:00:00.000Z" },
  { name: "Taro Template", status: "archived", updatedAt: "2026-03-22T12:00:00.000Z" }
];

const columns: DataTableColumnDefinition<Row>[] = [
  {
    key: "name",
    header: "Name",
    sortable: true,
    getSearchValue: (row) => row.name,
    getSortValue: (row) => row.name,
    getCsvValue: (row) => row.name
  },
  {
    key: "updatedAt",
    header: "Updated",
    sortable: true,
    getSortValue: (row) => row.updatedAt,
    getCsvValue: (row) => row.updatedAt
  }
];

const filters: DataTableFilterDefinition<Row>[] = [
  {
    key: "status",
    label: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Archived", value: "archived" }
    ],
    getValue: (row) => row.status
  }
];

describe("data table utils", () => {
  it("検索語で行を絞り込む", () => {
    expect(filterRowsBySearch(rows, columns, "Hanako")).toEqual([rows[0]]);
    expect(filterRowsBySearch(rows, columns, "Template")).toEqual([rows[1]]);
  });

  it("フィルタ値で行を絞り込む", () => {
    expect(filterRowsByFilters(rows, filters, { status: "active" })).toEqual([rows[0]]);
  });

  it("ソート条件で並び替える", () => {
    const sorted = sortRows(rows, columns, { key: "updatedAt", direction: "desc" });
    expect(sorted[0]?.name).toBe("Taro Template");
  });

  it("ページングする", () => {
    expect(paginateRows(rows, 2, 1)).toEqual([rows[1]]);
  });

  it("CSV を生成する", () => {
    const csv = buildCsv(rows, columns);
    expect(csv).toContain('"Name","Updated"');
    expect(csv).toContain('"Hanako Backoffice","2026-03-21T10:00:00.000Z"');
  });
});
