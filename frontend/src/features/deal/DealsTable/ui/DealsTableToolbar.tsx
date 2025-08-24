import React from "react";
import { BaseTableToolbar, BaseTableToolbarProps } from "@/features/BaseTable";

export interface DealsTableToolbarProps extends BaseTableToolbarProps {}

export const DealsTableToolbar: React.FC<DealsTableToolbarProps> = ({
  title,
  selected,
  onCreateClick,
  onRefreshClick,
  onDeleteClick,
}) => {
  return (
    <BaseTableToolbar
      title={title}
      selected={selected}
      onCreateClick={onCreateClick}
      onRefreshClick={onRefreshClick}
      onDeleteClick={onDeleteClick}
    />
  );
};