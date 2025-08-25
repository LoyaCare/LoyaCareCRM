"use client";

import React from "react";
import { useDispatch } from "react-redux";

import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { DealUpsertForm } from "./DealUpsertForm";
import {
  useGetDealByIdQuery,
  useUpdateDealMutation,
  useCreateDealMutation,
  dealApi,
} from "@/entities";
import type { CreateDealDTO, UpdateDealDTO } from "@/entities";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function DealEditDialog({
  id,
  titleEdit = "Edit Deal",
  titleCreate = "Create Deal",
  open,
  onClose,
}: {
  id?: string;
  titleEdit?: string;
  titleCreate?: string;
  open?: boolean;
  onClose?: () => void;
}) {
  const { data, isLoading } = useGetDealByIdQuery(id || "", {
    skip: !id,
  });
  const [updateDeal] = useUpdateDealMutation();
  const [createDeal] = useCreateDealMutation();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const handleSubmit = React.useCallback(
    async (values: CreateDealDTO | UpdateDealDTO, shouldCreate?: boolean) => {
      if (!id || shouldCreate) {
        await createDeal({...values, creatorId: user?.id} as CreateDealDTO);
        dispatch(dealApi.util.invalidateTags(["Deals", "Deal"]));
        onClose?.();
        return;
      }
      if (!values) {
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
      if (values.contactId !== undefined) {
        values.contactId = undefined;
      }

      await updateDeal({ id: id, body: values as UpdateDealDTO });
      console.log("Deal updated with id:", id, "and values:", values);
      dispatch(dealApi.util.invalidateTags(["Deals", "Deal"]));
      onClose?.();
    },
    [id, data, updateDeal, createDeal, onClose]
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
      <DialogTitle>{id ? titleEdit : titleCreate}</DialogTitle>
      <DialogContent>
        <DealUpsertForm initialData={data} dealId={id} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
