// src/features/lead/edit/ui/LeadEditDialog.tsx
import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { LeadUpsertForm } from "./LeadUpsertForm";
import {
  useGetLeadByIdQuery,
  useUpdateLeadMutation,
  useCreateLeadMutation,
} from "@/entities/lead/model/api";
import type { CreateLeadDTO, UpdateLeadDTO } from "@/entities/lead/model/types";

export function LeadEditDialog({
  leadId,
  open,
  onClose,
}: {
  leadId: string | undefined;
  open: boolean;
  onClose: () => void;
}) {
  const { data, isLoading } = useGetLeadByIdQuery(leadId || "", {
    skip: !leadId,
  });
  const [updateLead] = useUpdateLeadMutation();
  const [createLead] = useCreateLeadMutation();

  const handleSubmit = React.useCallback(
    async (values: CreateLeadDTO | UpdateLeadDTO, shouldCreate?: boolean) => {
      if (!leadId || shouldCreate) {
        await createLead(values as CreateLeadDTO);
        onClose();
        return;
      }
      if (!data) {
        console.error("No lead data found for update");
        return;
      }
      // Update the lead with the provided values
      console.log("Updating lead with ID:", leadId, "and values:", values);
      // Assuming the API expects an object with an id and the updated values
      if (typeof values?.potentialValue === "string") {
        values.potentialValue = parseFloat(values.potentialValue);
      }
      if (values.creatorId !== undefined) {
        values.creatorId = undefined;
      }
      if (values.assigneeId !== undefined) {
        values.assigneeId = undefined;
      }
      if (values.contactId !== undefined) {
        values.contactId = undefined;
      }
      if (values.assigneeId !== undefined) {
        values.assigneeId = undefined;
      }

      await updateLead({ id: leadId, body: values as UpdateLeadDTO });
      console.log("Lead updated successfully", values);
      onClose();
    },
    [leadId, data, updateLead, createLead, onClose]
  );

  if (!open) return null;
  if (isLoading)
    return (
      <Dialog open={open}>
        <DialogTitle>Loading...</DialogTitle>
      </Dialog>
    );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Lead edit</DialogTitle>
      <DialogContent>
        <LeadUpsertForm initialData={data} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
