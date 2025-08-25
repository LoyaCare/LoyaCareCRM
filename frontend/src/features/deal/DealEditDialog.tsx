"use client";

import React from "react";
import { useDispatch } from "react-redux";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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
        await createDeal({ ...values, creatorId: user?.id } as CreateDealDTO);
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
  // if (isLoading)
  //   return (
  //     <Dialog open={open}>
  //       <DialogTitle>Loading...</DialogTitle>
  //     </Dialog>
  //   );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">{id ? titleEdit : titleCreate}</Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            disabled={isLoading}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {isLoading && id ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <DealUpsertForm
            initialData={data}
            dealId={id}
            onSubmit={handleSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
