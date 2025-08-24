"use client";
import React, { FC, useCallback, useMemo } from "react";
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
  sanitizeDealData,
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
import { dealTableColumns } from "../model";
import ArchiveIcon from "@mui/icons-material/Archive";
import EditIcon from "@mui/icons-material/Edit";
import { DealTableRowData } from "../model";
import { mapDealsToDealRows } from "../lib";
import { DealsTableToolbar } from "./DealsTableToolbar";

const invalidateDeals = () => dealApi.util.invalidateTags(["Deals"]);

const DealsTableHead = <TTableData extends BaseTableRowData>(
  props: BaseTableHeadProps<TTableData>
) => {
  return (
    <BaseTableHead
      {...props}
      columns={dealTableColumns as unknown as Column<TTableData>[]}
    />
  );
};

const EditDialog = dynamic(
  () =>
    import("@/features/deal/DealEditDialog").then(
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
  sx,
  toolbarTitle = <DealViewSwitcher title="Deals" />
}: DealsTableProps<T>) {
  const dispatch = useDispatch();

  const [triggerGetDealById] = useLazyGetDealByIdQuery();
  const [updateDeal] = useUpdateDealMutation();

  const [clickedId, setClickedId] = React.useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

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
      const preparedUpdate = sanitizeDealData(updatedData);
      const body: UpdateDealDTO = {
        ...preparedUpdate,
      };
      console.log("Updating deal with id:", id, "and body:", body);
      await updateDeal({ id, body }).unwrap();
      dispatch(dealApi.util.invalidateTags(["Deals", "Deal"]));
    },
    [updateDeal, dispatch, sanitizeDealData]
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

  const handleEditDialogOpen = useCallback(
    (e: React.MouseEvent, id?: string) => {
      if (!id) return;
      e.stopPropagation();
      setClickedId(id);
      setIsDialogOpen(true);
    },
    [setClickedId]
  );
  const handleCreateClick = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const handleCreateClose = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const handleDialogClose = useCallback(() => {
    setClickedId(null);
    handleCreateClose();
  }, [handleCreateClose]);

  const rowActionMenuItems: ActionMenuItemProps[] = React.useMemo(
    () => [
      {
        element: "Edit",
        icon: <EditIcon fontSize="small" />,
        onClick: handleEditDialogOpen,
      },

      {
        element: "Archive",
        icon: <ArchiveIcon fontSize="small" />,
        onClick: handleArchive,
      },
    ],
    [handleArchive, handleEditDialogOpen]
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

  const handleRefreshData = useCallback(() => {
      dispatch(invalidateDeals());
  }, [invalidateDeals]);

  const handleDeleteClick = useCallback((selected: readonly string[]) => {
    console.log("Delete clicked for selected ids:", selected);
  }, []);

  return (
    <>
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
        columnsConfig={dealTableColumns}
        TableToolbarComponent={({ selected }) => (
          <DealsTableToolbar
            title={toolbarTitle}
            selected={selected}
            onCreateClick={handleCreateClick}
            onRefreshClick={handleRefreshData}
            onDeleteClick={handleDeleteClick}
          />
        )}
        TableHeadComponent={DealsTableHead}
        rowMapper={mapDealsToDealRows}
        rowActionMenuItems={rowActionMenuItems}
        sx={sx}
      />
      {(clickedId || isDialogOpen) && (
        <EditDialog
          id={clickedId || undefined}
          open={!!clickedId || !!isDialogOpen}
          onClose={handleDialogClose}
        />
      )}
    </>
  );
}
