import React from "react";
import { BaseTableToolbar } from "@/features/BaseTable";

export interface UsersTableToolbarProps {
  title: React.ReactNode;
  selected: readonly string[];
  onCreateClick: () => void;
  onRefreshClick: () => void;
  onDeleteClick: (selected: readonly string[]) => void;
  isDeleting?: boolean;
}

export const UsersTableToolbar: React.FC<UsersTableToolbarProps> = ({
  title,
  selected,
  onCreateClick,
  onRefreshClick,
  onDeleteClick,
  isDeleting = false,
}) => {
  return (
    <BaseTableToolbar
      title={title}
      selected={selected}
      onCreateClick={onCreateClick}
      onRefreshClick={onRefreshClick}
      onDeleteClick={onDeleteClick}
      isLoading={isDeleting}
    />
  );
};