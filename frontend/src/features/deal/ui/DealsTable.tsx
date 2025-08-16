"use client";
import dynamic from "next/dynamic";
import { DealExt } from "@/entities/deal/model/types";
import {
  BaseTable,
  BaseTableProps,
  DealData,
  SortableFields,
} from "@/features/BaseTable";
import { dealApi, useGetDealsQuery } from "@/entities/deal/model/api";

const invalidateDeals = () => dealApi.util.invalidateTags(["Deals"]);

const EditDialog = dynamic(
  () =>
    import("@/features/deal/ui/DealEditDialog").then(
      (mod) => mod.DealEditDialog
    ),
  { ssr: false }
);

export function DealsTable<T extends DealExt, TTableData extends DealData>({
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
        const { data } = useGetDealsQuery();
        return data as T[];
      }}
      invalidate={invalidateDeals}
      EditDialogComponent={EditDialogComponent}
      toolbarTitle="Deals"
    />
  );
}
