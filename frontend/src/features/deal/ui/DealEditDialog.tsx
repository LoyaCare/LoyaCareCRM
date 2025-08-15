// src/features/lead/edit/ui/LeadEditDialog.tsx
import React from "react";
import { useDispatch } from "react-redux";

import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { DealUpsertForm } from "./DealUpsertForm";
import {
  useGetDealByIdQuery,
  useUpdateDealMutation,
  useCreateDealMutation,
  dealApi,
} from "@/entities/deal/model/api";
import type { CreateDealDTO, UpdateDealDTO } from "@/entities/deal/model/types";

export function DealEditDialog({
  dealId,
  open,
  onClose,
}: {
  dealId: string | undefined;
  open: boolean;
  onClose: () => void;
}) {
  const { data, isLoading } = useGetDealByIdQuery(dealId || "", {
    skip: !dealId,
  });
  const [updateDeal] = useUpdateDealMutation();
  const [createDeal] = useCreateDealMutation();
  const dispatch = useDispatch();

  const handleSubmit = React.useCallback(
    async (values: CreateDealDTO | UpdateDealDTO, shouldCreate?: boolean) => {
      if (!dealId || shouldCreate) {
        await createDeal(values as CreateDealDTO);
        dispatch(dealApi.util.invalidateTags(["Deals"]));
        onClose();
        return;
      }
      if (!data) {
        console.error("No deal data found for update");
        return;
      }
      // Update the deal with the provided values
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

      await updateDeal({ id: dealId, body: values as UpdateDealDTO });
      dispatch(dealApi.util.invalidateTags(["Deals"]));
      onClose();
    },
    [dealId, data, updateDeal, createDeal, onClose]
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
      <DialogTitle>{dealId ? "Deal edit" : "Deal create"}</DialogTitle>
      <DialogContent>
        <DealUpsertForm initialData={data} dealId={dealId} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
