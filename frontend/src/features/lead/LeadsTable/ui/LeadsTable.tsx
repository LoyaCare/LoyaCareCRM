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

import { columns } from "../config";
import { LeadTableRowData } from "../model";
import { convertLeadsToLeadRows } from "../utils";
import { U } from "vitest/dist/chunks/environment.d.cL3nLXbE.js";

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
      columns={columns as unknown as Column<TTableData>[]}
    />
  );
};

export function LeadsTable<T extends LeadExt>({
  initialData,
  order = "asc",
  orderBy = "createdAt" as SortableFields<LeadTableRowData>,
  EditDialogComponent = EditDialog,
}: BaseTableProps<T, LeadTableRowData>) {
  const dispatch = useDispatch();
  const { data: leads = initialData || [] } = useGetLeadsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const [triggerGetLeadById] = useLazyGetLeadByIdQuery();
  const [updateLead] = useUpdateLeadMutation();

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
          ...preparedUpdate
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

  const rowActionMenuItems: ActionMenuItemProps[] = React.useMemo(
    () => [
      {
        element: "Convert",
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



  return (
    <BaseTable
      initialData={leads}
      order={order}
      orderBy={orderBy}
      invalidate={invalidateLeads}
      EditDialogComponent={EditDialogComponent}
      toolbarTitle="Leads"
      TableHeadComponent={LeadsTableHead}
      columnsConfig={columns}
      rowConverter={convertLeadsToLeadRows}
      rowActionMenuItems={rowActionMenuItems}
    />
  );
}
