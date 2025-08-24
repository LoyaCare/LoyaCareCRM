import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  leadApi,
  useUpdateLeadMutation,
  useLazyGetLeadByIdQuery,
  UpdateLeadDTO,
  LeadExt,
  prepareToUpdate
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
      await updateLead({ id, body }).unwrap();
      invalidateLeads();
    },
    [triggerGetLeadById, updateLead, invalidateLeads]
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
    [update]
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
    [update]
  );

  return {
    handleConvert,
    handleArchive,
    invalidateLeads
  };
}