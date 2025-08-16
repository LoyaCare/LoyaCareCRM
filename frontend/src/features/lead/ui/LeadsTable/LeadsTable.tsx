"use client";
import dynamic from "next/dynamic";
import {
  BaseTable,
  BaseTableProps,
  DealData,
  SortableFields,
} from "@/features/BaseTable";
import { leadApi } from "@/entities/lead/model/api";
import { useGetLeadsQuery } from "@/entities/lead/model/api";
import { LeadExt } from "@/entities/lead/model/types";

const invalidateLeads = () => leadApi.util.invalidateTags(["Leads"]);

const EditDialog = dynamic(
  () =>
    import("@/features/lead/ui/LeadEditDialog").then(
      (mod) => mod.LeadEditDialog
    ),
  { ssr: false }
);

export function LeadsTable<T extends LeadExt, TTableData extends DealData>({
  initialData,
  order = "asc",
  orderBy = "createdAt" as SortableFields<TTableData>,
  EditDialogComponent = EditDialog,
}: BaseTableProps<T, TTableData>) {
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
    />
  );
}
