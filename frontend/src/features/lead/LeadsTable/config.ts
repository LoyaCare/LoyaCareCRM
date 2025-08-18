import { LeadTableRowData } from "./model";
import { Column, currencyFormatter } from "@/features/BaseTable";


// Columns definition for the Leads table.
export const columns: Column<LeadTableRowData>[] = [
  { key: "title", label: "Title", padding: "none", minWidth: 120 },
  {
    key: "potentialValue",
    label: "Potential",
    align: "right",
    formatter: currencyFormatter,
    minWidth: 70,
  },
  { key: "clientName", label: "Client", minWidth: 170 },
  { key: "assigneeName", label: "Assignee", minWidth: 200 },
  { key: "actions", label: "", isActions: true, maxWidth: 30, sortable: false },
];
