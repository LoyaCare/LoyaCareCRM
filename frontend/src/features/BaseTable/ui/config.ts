import { BaseTableRowData } from "./model";
import type { Column, TGetColumns } from "./types";

// export const currencyFormatter = (value: any) =>
//   value
//     ? new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value)
//     : null;

export const defaultGetColumns: TGetColumns<BaseTableRowData> = () => {
  return columns;
}

// Default columns for the table. This can be imported by BaseTable or overridden by callers.
export const columns: Column<BaseTableRowData>[] = [
  { label: "", isActions: true, maxWidth: 30 },
];

export default columns;
