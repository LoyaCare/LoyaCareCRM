import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  leadApi,
  useUpdateLeadMutation,
  useLazyGetLeadByIdQuery,
  UpdateLeadDTO,
  LeadExt,
  prepareToUpdate,
} from "@/entities/lead";

export function useLeadOperations() {
  const dispatch = useDispatch();
  const [triggerGetLeadById] = useLazyGetLeadByIdQuery();
  const [updateLead] = useUpdateLeadMutation();

  const invalidateLeads = useCallback(() => {
    dispatch(leadApi.util.invalidateTags(["Leads"]));
  }, [dispatch]);

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
      console.log("Updating lead with id:", id, " body:", body);
      await updateLead({ id, body }).unwrap();
    },
    [triggerGetLeadById, updateLead, invalidateLeads]
  );

  const convertLead = async (id: string) =>
    await update(id, (lead) => ({
      ...lead,
      stage: "QUALIFIED",
    }));

  const handleConvert = useCallback(
    async (e: React.MouseEvent | undefined, id?: string) => {
      e?.stopPropagation();
      if (!id) return;
      try {
        await convertLead(id);
        invalidateLeads();
      } catch (err) {
        console.error("Convert action failed", err);
      }
    },
    [convertLead]
  );

  const handleConverts = useCallback(
    async (e?: React.MouseEvent, selectedIds?: readonly string[]) => {
      e?.stopPropagation();
      if (!selectedIds?.length) return;
      try {
        await Promise.all(selectedIds.map(convertLead));
        invalidateLeads();
      } catch (err) {
        console.error("Convert action failed", err);
      }
    },
    [update, invalidateLeads]
  );

  const archiveLead = async (id: string) =>
    await update(id, (lead) => ({
      ...lead,
      archivedAt: new Date(),
      status: "ARCHIVED",
    }));

  const handleArchive = useCallback(
    async (e?: React.MouseEvent, id?: string) => {
      e?.stopPropagation();
      if (!id) return;
      try {
        await archiveLead(id);
        invalidateLeads();
      } catch (err) {
        console.error("Archive action failed", err);
      }
    },
    [update]
  );

  const handleArchives = useCallback(
    async (e?: React.MouseEvent, selectedIds?: readonly string[]) => {
      e?.stopPropagation();
      console.log("Selected ids for archive:", selectedIds);
      if (!selectedIds?.length) return;
      try {
        await Promise.all(selectedIds.map(archiveLead));
        invalidateLeads();
      } catch (err) {
        console.error("Archive action failed", err);
      }
    },
    [archiveLead, invalidateLeads]
  );

  const handleRefreshData = useCallback(() => {
    invalidateLeads();
  }, [invalidateLeads]);

  return {
    handleConvert,
    handleConverts,
    handleArchive,
    handleArchives,
    invalidateLeads,
    handleRefreshData,
  };
}
