"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { UserForm } from "@/features/user/UserForm";
import {
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  CreateUserDTO,
  UpdateUserDTO,
  sanitizeUserData,
} from "@/entities/user";
import { useSnackbar } from "notistack";

interface UserEditDialogProps {
  id?: string;
  open: boolean;
  onClose: () => void;
}

export const UserEditDialog: React.FC<UserEditDialogProps> = ({
  id,
  open,
  onClose,
}) => {
  const isEditing = !!id;
  const [error, setError] = useState<string | undefined>();
  
  const { enqueueSnackbar } = useSnackbar();
  
  // Запросы к API
  const { data: user, isLoading: isLoadingUser } = useGetUserByIdQuery(id || "", {
    skip: !id || !open,
  });
  
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  
  const isLoading = isLoadingUser || isCreating || isUpdating;

  useEffect(() => {
    // Сбрасываем ошибку при открытии/закрытии диалога
    if (open) {
      setError(undefined);
    }
  }, [open, id]);

  const handleSubmit = async (formData: CreateUserDTO | UpdateUserDTO) => {
    try {
      if (isEditing && id) {
        // Обновление пользователя
        const sanitizedData = sanitizeUserData(formData as UpdateUserDTO);
        
        // Если пароль пустой, удаляем его из запроса
        if (sanitizedData.password === "") {
          delete sanitizedData.password;
        }
        
        await updateUser({
          id,
          body: sanitizedData,
        }).unwrap();
        
        enqueueSnackbar("User updated successfully", { variant: "success" });
      } else {
        // Создание нового пользователя
        await createUser(formData as CreateUserDTO).unwrap();
        enqueueSnackbar("User created successfully", { variant: "success" });
      }
      
      onClose();
    } catch (err: any) {
      setError(err.data?.message || "An error occurred");
      enqueueSnackbar("Operation failed", { variant: "error" });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={isLoading}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">
            {isEditing ? "Edit User" : "Create User"}
          </Typography>
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
        {isLoadingUser && id ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <UserForm
            user={user}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isLoading={isLoading}
            error={error}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};