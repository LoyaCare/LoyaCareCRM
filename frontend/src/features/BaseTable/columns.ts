import type { Column, BaseTableRowData } from "./model/types";

// Default columns for the table. This can be imported by BaseTable or overridden by callers.
export const columns: Column<BaseTableRowData>[] = [
  { label: "", isActions: true, maxWidth: 30 },
];

export default columns;
