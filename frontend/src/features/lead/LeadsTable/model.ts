import { BaseTableRowData } from "@/features/BaseTable";

export interface LeadTableRowData extends BaseTableRowData {
  id: string;
  actions?: string;
}
