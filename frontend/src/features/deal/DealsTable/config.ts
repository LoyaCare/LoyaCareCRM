import { DealTableRowData } from "./model";
import { currencyFormatter } from "@/features/BaseTable";
import type { Column, TGetColumns } from "@/features/BaseTable";

// Columns definition for the Deals table.
export const columns: Column<DealTableRowData>[] = [
  {
    key: "title",
    label: "Title",
    padding: "none",
    minWidth: 120,
    width: 120,
    maxWidth: 200,
  },
  {
    key: "clientOrganization",
    label: "Organization",
    minWidth: 100,
    width: 100,
    maxWidth: 200,
  },
  {
    key: "potentialValue",
    label: "Potential",
    align: "right",
    formatter: currencyFormatter,
    minWidth: 70,
  },
  {
    key: "clientName",
    label: "Client",
    minWidth: 170,
    width: 170,
    maxWidth: 200,
  },
  {
    key: "createdAt",
    label: "Created at",
    minWidth: 200,
    width: 200,
    maxWidth: 300,
  },
  {
    key: "productInterest",
    label: "Product",
    minWidth: 200,
    width: 200,
    maxWidth: 300,
  },
  {
    key: "assigneeName",
    label: "Assignee",
    minWidth: 200,
    width: 200,
    maxWidth: 300,
  },
  {
    key: "actions",
    label: "",
    isActions: true,
    width: 30,
    maxWidth: 30,
    sortable: false,
    isSticky: true,
  },
];

export const getColumns: TGetColumns<DealTableRowData> = () => columns;
