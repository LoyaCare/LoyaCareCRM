import * as React from "react";
import { Theme } from "@mui/material/styles";
import { Column, Order, SortableFields } from "./types";
import { BaseTableRowData } from "./model";
/**
 * Creates a comparator for sorting table data
 */
export function createComparator<
  TOrder extends string,
  TData extends BaseTableRowData,
>(order: TOrder, orderBy: SortableFields<TData>) {
  return (a: TData, b: TData) => {
    // Handle null values
    const aValue = a[orderBy];
    const bValue = b[orderBy];

    if (aValue === null || aValue === undefined)
      return order === "asc" ? -1 : 1;
    if (bValue === null || bValue === undefined)
      return order === "asc" ? 1 : -1;

    if (typeof aValue === "number" && typeof bValue === "number") {
      return order === "asc" ? aValue - bValue : bValue - aValue;
    }

    const aString = String(aValue).toLowerCase();
    const bString = String(bValue).toLowerCase();

    return order === "asc"
      ? aString.localeCompare(bString)
      : bString.localeCompare(aString);
  };
}

/**
 * Creates sticky styles for table elements
 */
export const createStickySx = () => ({
  position: "sticky",
  zIndex: (theme: Theme) => theme.zIndex.appBar + 2,
  background: (theme: Theme) => theme.palette.background.paper,
  boxSizing: "border-box",
});

/**
 * Creates table cell props based on column definition
 */
export const createCellProps = (
  col: Column<any>,
  row: any,
  labelId?: string,
  colIndex?: number
) => {
  const cellProps: any = {
    align: col.align || undefined,
    width: col.width || undefined,
  };

  const cellSxProps = {
    width: col.width || undefined,
    minWidth: col.minWidth || undefined,
    maxWidth: col.maxWidth || undefined,
  };

  if (col.padding === "none") {
    cellProps.padding = "none";
    if (colIndex === 0) {
      cellProps.id = labelId;
      cellProps.scope = "row";
    }
  }

  // Generate cell content
  const value = col.key ? (row[col.key as keyof typeof row] as any) : undefined;
  const content = col.formatter ? col.formatter(value, row) : value;

  return { cellProps, cellSxProps, content };
};

/**
 * Creates table styles for consistent appearance
 */
export const createTableSx = () => ({
  width: "100%",
  minWidth: "800px",
  tableLayout: "fixed",
  borderCollapse: "collapse",
  "& th": {
    border: "1px solid rgba(224, 224, 224, 1)",
    padding: "6px",
    height: "24px",
    lineHeight: "1.2",
    fontWeight: 700,
    boxShadow: "0 1px 0 rgba(0,0,0,0.04)",
  },
  "& td": {
    border: "1px solid rgba(224, 224, 224, 1)",
    padding: "6px",
    height: "24px",
    lineHeight: "1.2",
    minWidth: "800px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
});

/**
 * Calculates empty rows for pagination
 */
export const calculateEmptyRows = (
  page: number,
  rowsPerPage: number,
  totalRows: number
) => {
  return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - totalRows) : 0;
};

/**
 * Creates visible rows based on sorting and pagination
 */
export const getVisibleRows = <T extends BaseTableRowData>(
  rows: T[],
  order: Order,
  orderBy: SortableFields<T>,
  page: number,
  rowsPerPage: number,
  comparatorBuilder: (
    order: Order,
    orderBy: SortableFields<T>
  ) => (a: T, b: T) => number
) => {
  return rows
    .sort(comparatorBuilder(order, orderBy))
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
};

/**
 * Default row converter function
 */
export const defaultConvertRows = <T, TData extends BaseTableRowData>(
  data: T[]
): TData[] => {
  return data as unknown as TData[];
};
