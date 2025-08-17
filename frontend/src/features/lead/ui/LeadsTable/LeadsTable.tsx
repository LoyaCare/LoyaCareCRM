"use client";
import dynamic from "next/dynamic";
import {
  BaseTable,
  BaseTableHeadProps,
  BaseTableProps,
  BaseTableRowData,
  SortableFields,
  BaseTableHead,
  Column,
} from "@/features/BaseTable";
import { leadApi } from "@/entities/lead/model/api";
import { useGetLeadsQuery } from "@/entities/lead/model/api";
import { LeadExt } from "@/entities/lead/model/types";
import { columns } from "./config";
import { LeadTableRowData } from "./model";
import { convertLeadsToLeadRows } from './utils'

const invalidateLeads = () => leadApi.util.invalidateTags(["Leads"]);

const EditDialog = dynamic(
  () =>
    import("@/features/lead/ui/LeadEditDialog").then(
      (mod) => mod.LeadEditDialog
    ),
  { ssr: false }
);

const LeadsTableHead = <TTableData extends LeadTableRowData>(
  props: BaseTableHeadProps<TTableData>
) => {
  // columns is typed for your Deal rows in ./config — assert to the generic Column<TTableData>[]
  return (
    <BaseTableHead
      {...props}
      columns={columns as unknown as Column<TTableData>[]}
    />
  );
};

export function LeadsTable<
  T extends LeadExt,
>({
  initialData,
  order = "asc",
  orderBy = "createdAt" as SortableFields<LeadTableRowData>,
  EditDialogComponent = EditDialog,
}: BaseTableProps<T, LeadTableRowData>) {
  return (
    <BaseTable
      initialData={initialData}
      order={order}
      orderBy={orderBy}
      getInitData={() => {
        const { data } = useGetLeadsQuery();
        return data as T[];
      }}
      invalidate={invalidateLeads}
      EditDialogComponent={EditDialogComponent}
      toolbarTitle="Leads"
      TableHeadComponent={LeadsTableHead}
      columnsConfig={columns}
      rowConverter={convertLeadsToLeadRows}
    />
  );
}
