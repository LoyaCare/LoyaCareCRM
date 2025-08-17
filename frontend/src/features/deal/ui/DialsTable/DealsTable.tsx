"use client";
import dynamic from "next/dynamic";
import { DealExt } from "@/entities/deal/model/types";
import {
  BaseTable,
  BaseTableHeadProps,
  BaseTableProps,
  BaseTableRowData,
  Column,
  SortableFields,
} from "@/features/BaseTable";
import { dealApi, useGetDealsQuery } from "@/entities/deal/model/api";
import { BaseTableHead } from "@/features/BaseTable";
import { columns } from './config'
import { DealTableRowData } from "./model";
import { convertDealsToDealRows } from "./utils";

const invalidateDeals = () => dealApi.util.invalidateTags(["Deals"]);

const DealsTableHead = <TTableData extends BaseTableRowData,>(props: BaseTableHeadProps<TTableData>) => {
  // columns is typed for your Deal rows in ./config — assert to the generic Column<TTableData>[]
  return <BaseTableHead {...props} columns={columns as unknown as Column<TTableData>[]} />;
};

const EditDialog = dynamic(
  () =>
    import("@/features/deal/ui/DealEditDialog").then(
      (mod) => mod.DealEditDialog
    ),
  { ssr: false }
);

export function DealsTable<
  T extends DealExt,
>({
  initialData,
  order,
  orderBy = "createdAt" as SortableFields<DealTableRowData>,
  EditDialogComponent = EditDialog,
}: BaseTableProps<T, DealTableRowData>) {
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
      columnsConfig={columns}
      toolbarTitle="Deals"
      TableHeadComponent={DealsTableHead}
      rowConverter={convertDealsToDealRows}
    />
  );
}
