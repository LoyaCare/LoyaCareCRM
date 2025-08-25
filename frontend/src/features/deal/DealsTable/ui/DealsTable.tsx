"use client";
import React from "react";
import dynamic from "next/dynamic";

import ArchiveIcon from "@mui/icons-material/Archive";
import EditIcon from "@mui/icons-material/Edit";

import {
  DealExt,
  DealStatus,
  DealStage,
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
} from "@/features/BaseTable";
import { BaseTableHead } from "@/features/BaseTable";
import { useEntityDialog } from "@/shared/lib/hooks";

import { DealTableRowData, dealTableColumns } from "../model";
import { mapDealsToDealRows, useTableActions, useDealOperations } from "../lib";
import { DealsTableToolbar } from "./DealsTableToolbar";

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
    import("@/features/deal/DealEditDialog").then((mod) => mod.DealEditDialog),
  { ssr: false }
);

export type DealsTableProps<T extends DealExt> = BaseTableProps<
  T,
  DealTableRowData
> & {
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
  toolbarTitle = <DealViewSwitcher title="Deals" />,
}: DealsTableProps<T>) {
  const {
    entityId: clickedId,
    handleEditClick,
    handleCreateClick,
    handleDialogClose,
    showDialog,
  } = useEntityDialog();

  const { handleArchive, handleRefreshData } = useDealOperations();

  const { handleDeleteClick } = useTableActions();

  // fetch deals
  const { data: deals = initialData || [] } = useGetDealsQuery(
    { statuses, stages, excludeStatuses, excludeStages },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );

    const rowActionMenuItems: ActionMenuItemProps<DealTableRowData>[] = React.useMemo(
    () => [
      {
        element: "Edit",
        icon: <EditIcon fontSize="small" />,
        onClick: handleEditClick,
      },
      {
        element: "Archive",
        icon: <ArchiveIcon fontSize="small" />,
        onClick: handleArchive,
      },
    ],
    [handleArchive, handleEditClick]
  );

  return (
    <>
      <BaseTable
        initialData={deals?.length > 0 ? deals : initialData}
        order={order}
        orderBy={orderBy}
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
