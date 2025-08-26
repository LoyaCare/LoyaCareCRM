"use client";
import React from "react";
import dynamic from "next/dynamic";

import EditIcon from "@mui/icons-material/Edit";
import Refresh from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  DealExt,
  DealViewSwitcher,
  useGetDealsQuery,
} from "@/entities/deal";
import {
  BaseTable,
  BaseTableHeadProps,
  BaseTableProps,
  BaseTableRowData,
  Column,
  SortableFields,
  ActionMenuItemProps,
  BaseTableHead,
  BaseTableToolbar,
  ToolbarMenuItem,
  BaseTableToolbarProps,
} from "@/features/BaseTable";
import { useEntityDialog } from "@/shared/lib/hooks";

import { DealTableRowData, dealTableColumns } from "../model";
import { mapDealsToDealRows, useTableActions, useDealOperations } from "../lib";

const TableHead = <TTableData extends BaseTableRowData>(
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
    import("@/features/deal/DealEditDialog").then((mod) => mod.DealEditDialog),
  { ssr: false }
);

export type WonLostDealsTableProps<T extends DealExt> = BaseTableProps<
  T,
  DealTableRowData
> & {
  isWon?: boolean;
};

export function WonLostDealsTable<T extends DealExt>({
  initialData,
  order,
  orderBy = "modupdatedAt" as SortableFields<DealTableRowData>,
  isWon=true,
  sx,
}: WonLostDealsTableProps<T>) {
  const {
    entityId: clickedId,
    handleEditClick,
    handleDialogClose,
    showDialog,
  } = useEntityDialog();

  const { handleRefreshData } = useDealOperations();

  const { handleDeleteClick } = useTableActions();

  // fetch deals
  const { data: deals = initialData || [] } = useGetDealsQuery(
    { statuses: ["ACTIVE"], stages: [isWon ? "WON" : "LOST"] },
    {
      refetchOnFocus: true,
    }
  );

  const rowActionMenuItems: ActionMenuItemProps<DealTableRowData>[] =
    React.useMemo(
      () => [
        {
          title: "View",
          icon: <EditIcon fontSize="small" />,
          onClick: handleEditClick,
        },
      ],
      [handleEditClick]
    );

  const toolbarMenuItems: ToolbarMenuItem[] = React.useMemo(
    () => [
      {
        title: "Filter",
        icon: <FilterListIcon fontSize="small" />,
      },
      {
        title: "Refresh list",
        icon: <Refresh fontSize="small" />,
        onClick: handleRefreshData,
      },
    ],
    [handleRefreshData]
  );

  const ToolbarComponent = ({ selected, clearSelection }: BaseTableToolbarProps) => (
    <BaseTableToolbar
      title={
        <DealViewSwitcher title={isWon ? "Won Deals" : "Lost Deals"} />
      }
      selected={selected}
      menuItems={toolbarMenuItems}
      clearSelection={clearSelection}
    />
  );

  return (
    <>
      <BaseTable
        initialData={deals?.length > 0 ? deals : initialData}
        order={order}
        orderBy={orderBy}
        columnsConfig={dealTableColumns}
        TableToolbarComponent={ToolbarComponent}
        TableHeadComponent={TableHead}
        rowMapper={mapDealsToDealRows}
        rowActionMenuItems={rowActionMenuItems}
        sx={sx}
      />
      {showDialog && (
        <EditDialog
          id={clickedId || undefined}
          open={true}
          onClose={handleDialogClose}
        />
      )}
    </>
  );
}
