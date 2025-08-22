"use client";
import React, { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";

import dynamic from "next/dynamic";
import {
  Deal,
  DealExt,
  DealStatus,
  DealStage,
  DealViewSwitcher,
  dealApi,
  useLazyGetDealByIdQuery,
  useUpdateDealMutation,
  useGetDealsQuery,
  UpdateDealDTO,
  prepareToUpdate,
} from "@/entities/deal";
import {
  BaseTable,
  BaseTableHeadProps,
  BaseTableProps,
  BaseTableRowData,
  Column,
  SortableFields,
  ActionMenuItemProps,
} from "@/features/BaseTable";
import { BaseTableHead } from "@/features/BaseTable";
import { columns } from "./config";
import ArchiveIcon from "@mui/icons-material/Archive";
import { DealTableRowData } from "./model";
import { convertDealsToDealRows } from "./utils";

const invalidateDeals = () => dealApi.util.invalidateTags(["Deals"]);

const DealsTableHead = <TTableData extends BaseTableRowData>(
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

const EditDialog = dynamic(
  () =>
    import("@/features/deal/ui/DealEditDialog").then(
      (mod) => mod.DealEditDialog
    ),
  { ssr: false }
);

export type DealsTableProps<T extends DealExt> = BaseTableProps<T, DealTableRowData> & {
  stages?: DealStage[];
  excludeStages?: DealStage[];
  statuses?: DealStatus[];
  excludeStatuses?: DealStatus[];
};

export function DealsTable<T extends DealExt>({
  initialData,
  order,
  stages,
  excludeStages,
  statuses,
  excludeStatuses,
  orderBy = "stage" as SortableFields<DealTableRowData>,
  EditDialogComponent = EditDialog,
  sx,
  toolbarTitle = <DealViewSwitcher title="Deals" />
}: DealsTableProps<T>) {
  const dispatch = useDispatch();

  const [triggerGetDealById] = useLazyGetDealByIdQuery();
  const [updateDeal] = useUpdateDealMutation();

  const update = useCallback(
    async (id: string, updateData: (deal: DealExt) => UpdateDealDTO) => {
      const getResult = await triggerGetDealById(id);
      const deal = ("data" in getResult ? getResult.data : undefined) as
        | DealExt
        | undefined;
      if (!deal) {
        console.error("Deal not found for id", id);
        return;
      }

      const updatedData = updateData(deal);
      const preparedUpdate = prepareToUpdate(updatedData);
      const body: UpdateDealDTO = {
        ...preparedUpdate,
      };
      console.log("Updating deal with id:", id, "and body:", body);
      await updateDeal({ id, body }).unwrap();
      dispatch(dealApi.util.invalidateTags(["Deals", "Deal"]));
    },
    [updateDeal, dispatch, prepareToUpdate]
  );

  const handleArchive = useCallback(
    async (e: React.MouseEvent | undefined, id?: string) => {
      e?.stopPropagation();
      if (!id) return;
      try {
        update(id, (deal) => ({
          ...deal,
          status: "ARCHIVED",
        }));
      } catch (err) {
        console.error("Archive action failed", err);
      }
    },
    [triggerGetDealById, updateDeal, dispatch]
  );

  const rowActionMenuItems: ActionMenuItemProps[] = React.useMemo(
    () => [
      {
        element: "Archive",
        icon: <ArchiveIcon fontSize="small" />,
        onClick: handleArchive,
      },
    ],
    [handleArchive]
  );

  const { data: deals = initialData || [] } = useGetDealsQuery(
    { statuses, stages, excludeStatuses, excludeStages },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      // Can't use skip, because in other case after invalidate tags,
      //  data will not be refetched by RTK Query
      // skip: initialData && initialData.length > 0,
    }
  );

  return (
    <BaseTable
      initialData={deals?.length > 0 ? deals : initialData}
      order={order}
      orderBy={orderBy}
      getInitData={() => {
        const { data } = useGetDealsQuery(
          { statuses, stages, excludeStatuses, excludeStages },
          {
            refetchOnMountOrArgChange: true,
            refetchOnFocus: true,
          }
        );
        return data as T[];
      }}
      invalidate={invalidateDeals}
      EditDialogComponent={EditDialogComponent}
      columnsConfig={columns}
      toolbarTitle={toolbarTitle}
      TableHeadComponent={DealsTableHead}
      rowConverter={convertDealsToDealRows}
      rowActionMenuItems={rowActionMenuItems}
      sx={sx}
    />
  );
}
