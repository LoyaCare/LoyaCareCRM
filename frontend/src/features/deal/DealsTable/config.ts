import { DealTableRowData } from "./model";
import { currencyFormatter } from "@/features/BaseTable";
import type {
  BaseTableRowData,
  Column,
  TGetColumns,
} from "@/features/BaseTable";

// Columns definition for the Deals table.
export const columns: Column<DealTableRowData>[] = [
  { key: "title", label: "Title", padding: "none", minWidth: 120 },
  { key: "clientOrganization", label: "Organization", minWidth: 100 },
  {
    key: "potentialValue",
    label: "Potential",
    align: "right",
    formatter: currencyFormatter,
    minWidth: 70,
  },
  { key: "clientName", label: "Client", minWidth: 170 },
  { key: "createdAt", label: "Created at", minWidth: 200 },
  { key: "productInterest", label: "Product", minWidth: 200 },
  { key: "assigneeName", label: "Assignee", minWidth: 200 },
  { key: "actions", label: "", isActions: true, maxWidth: 30, sortable: false },
];

export const getColumns: TGetColumns<DealTableRowData> = () => columns;
