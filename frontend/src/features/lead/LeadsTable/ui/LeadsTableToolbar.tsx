import React from "react";
import { BaseTableToolbar, BaseTableToolbarProps } from "@/features/BaseTable";

export interface LeadsTableToolbarProps extends BaseTableToolbarProps {}

export const LeadsTableToolbar: React.FC<LeadsTableToolbarProps> = ({
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