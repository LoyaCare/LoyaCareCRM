"use client";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import {
  BaseTable,
  BaseTableHeadProps,
  BaseTableProps,
  SortableFields,
  BaseTableHead,
  Column,
} from "@/features/BaseTable";
import {
  leadApi,
  useGetLeadsQuery,
  useUpdateLeadMutation,
  useLazyGetLeadByIdQuery,
  UpdateLeadDTO,
  LeadExt,
  prepareToUpdate,
} from "@/entities/lead";
import { ActionMenuItemProps } from "@/features/BaseTable";

import ArchiveIcon from "@mui/icons-material/Archive";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import EditIcon from "@mui/icons-material/Edit";

import { leadTableColumns } from "../model/columns";
import { LeadTableRowData } from "../model/types";
import { mapLeadsToLeadRows } from "../model/mappers";
import { LeadsTableToolbar } from "./LeadsTableToolbar";

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
  const dispatch = useDispatch();
  const { data: leads = initialData || [] } = useGetLeadsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const [triggerGetLeadById] = useLazyGetLeadByIdQuery();
  const [updateLead] = useUpdateLeadMutation();

  const [clickedId, setClickedId] = React.useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const update = useCallback(
    async (id: string, updateData: (lead: LeadExt) => UpdateLeadDTO) => {
      const getResult = await triggerGetLeadById(id);
      const lead = ("data" in getResult ? getResult.data : undefined) as
        | LeadExt
        | undefined;
      if (!lead) {
        console.error("Lead not found for id", id);
        return;
      }

      const updatedData = updateData(lead);
      const preparedUpdate = prepareToUpdate(updatedData);
      const body: UpdateLeadDTO = {
        ...preparedUpdate,
      };
      await updateLead({ id, body }).unwrap();
      dispatch(leadApi.util.invalidateTags(["Leads"]));
    },
    [updateLead, dispatch, prepareToUpdate]
  );

  const handleConvert = useCallback(
    async (e: React.MouseEvent | undefined, id?: string) => {
      e?.stopPropagation();
      if (!id) return;
      try {
        update(id, (lead) => ({
          ...lead,
          stage: "QUALIFIED",
        }));
      } catch (err) {
        console.error("Convert action failed", err);
      }
    },
    [triggerGetLeadById, updateLead, dispatch]
  );

  const handleArchive = useCallback(
    async (e: React.MouseEvent | undefined, id?: string) => {
      e?.stopPropagation();
      if (!id) return;
      try {
        update(id, (lead) => ({
          ...lead,
          status: "ARCHIVED",
        }));
      } catch (err) {
        console.error("Archive action failed", err);
      }
    },
    [triggerGetLeadById, updateLead, dispatch]
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
    [handleConvert, handleArchive]
  );
  const handleRefreshData = useCallback(() => {
      dispatch(invalidateLeads());
  }, [invalidateLeads]);

  const handleDeleteClick = useCallback((selected: readonly string[]) => {
    console.log("Delete clicked for selected ids:", selected);
  }, []);

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
            onRefreshClick={handleRefreshData}
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
