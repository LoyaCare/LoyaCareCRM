"use client";
import React, { useCallback } from "react";
import dynamic from "next/dynamic";
import ArchiveIcon from "@mui/icons-material/Archive";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import EditIcon from "@mui/icons-material/Edit";

import {
  BaseTable,
  BaseTableHeadProps,
  BaseTableProps,
  SortableFields,
  BaseTableHead,
  Column,
} from "@/features/BaseTable";
import {
  useGetLeadsQuery,
  LeadExt,
} from "@/entities/lead";
import { ActionMenuItemProps } from "@/features/BaseTable";

import { useEntityDialog } from "@/shared";

import {
  leadTableColumns,
  LeadTableRowData,
  mapLeadsToLeadRows,
} from "../model";
import { useLeadOperations } from "../lib";
import { LeadsTableToolbar } from "./LeadsTableToolbar";

const EditDialog = dynamic(
  () => import("@/features/lead/ui/LeadEditDialog").then(
    (mod) => mod.LeadEditDialog
  ),
  { ssr: false }
);

const LeadsTableHead = <TTableData extends LeadTableRowData>(
  props: BaseTableHeadProps<TTableData>
) => {
  return (
    <BaseTableHead
      {...props}
      columns={leadTableColumns as unknown as Column<TTableData>[]}
    />
  );
};

export function LeadsTable<T extends LeadExt>({
  initialData,
  order = "asc",
  orderBy = "createdAt" as SortableFields<LeadTableRowData>,
}: BaseTableProps<T, LeadTableRowData>) {
  const {
    entityId: clickedId,
    isDialogOpen,
    handleEditClick,
    handleCreateClick,
    handleDialogClose,
    showDialog,
  } = useEntityDialog();
  
  const { 
    handleConvert, 
    handleArchive, 
    invalidateLeads 
  } = useLeadOperations();

  const { data: leads = initialData || [] } = useGetLeadsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const handleDeleteClick = useCallback((selected: readonly string[]) => {
    console.log("Delete clicked for selected ids:", selected);
  }, []);

  const rowActionMenuItems: ActionMenuItemProps[] = React.useMemo(
    () => [
      {
        element: "Edit",
        icon: <EditIcon fontSize="small" />,
        onClick: handleEditClick,
      },
      {
        element: "Convert to deal",
        icon: <SwapHorizIcon fontSize="small" />,
        onClick: handleConvert,
      },
      {
        element: "Archive",
        icon: <ArchiveIcon fontSize="small" />,
        onClick: handleArchive,
      },
    ],
    [handleEditClick, handleConvert, handleArchive]
  );

  return (
    <>
      <BaseTable
        initialData={leads}
        order={order}
        orderBy={orderBy}
        TableToolbarComponent={({ selected }) => (
          <LeadsTableToolbar
            title="Leads"
            selected={selected}
            onCreateClick={handleCreateClick}
            onRefreshClick={invalidateLeads}
            onDeleteClick={handleDeleteClick}
          />
        )}
        toolbarTitle="Leads"
        TableHeadComponent={LeadsTableHead}
        columnsConfig={leadTableColumns}
        rowMapper={mapLeadsToLeadRows}
        rowActionMenuItems={rowActionMenuItems}
        sx={{ p: 0, m: 0 }}
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
