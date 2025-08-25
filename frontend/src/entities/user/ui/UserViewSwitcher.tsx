"use client";
import React from "react";
import { Box, Typography, SxProps, Theme } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import BlockIcon from '@mui/icons-material/Block';
import { SimpleViewSwitcher, SimpleViewSwitcherElement } from "@/shared/ui";
import { UserStatus } from "../model/types";

export type UserStatusFilter = UserStatus | 'ALL';

export interface UserViewSwitcherProps {
  title?: string;
  value: UserStatusFilter;
  onChange: (filter: UserStatusFilter) => void;
  size?: "small" | "medium" | "large";
  elements?: SimpleViewSwitcherElement<UserStatusFilter>[];
  ariaLabel?: string;
  sx?: SxProps<Theme>;
}

const defaultSwitcherElements: SimpleViewSwitcherElement<UserStatusFilter>[] = [
  { 
    value: "ACTIVE", 
    icon: <PersonIcon />, 
    label: "Active Users",
    tooltip: "Show active users only" 
  },
  { 
    value: "ALL", 
    icon: <GroupIcon />, 
    label: "All Users",
    tooltip: "Show all users" 
  },
  { 
    value: "BLOCKED", 
    icon: <BlockIcon />, 
    label: "Blocked Users",
    tooltip: "Show blocked users only" 
  },
];

/**
 * Component for switching between different user status filters.
 * Includes title "Users" and switch with active, all and blocked views.
 * 
 * @example
 * // Default small size
 * <UserViewSwitcher value={filter} onChange={setFilter} />
 * 
 * @example 
 * // Medium size with custom title
 * <UserViewSwitcher 
 *   value={filter} 
 *   onChange={setFilter}
 *   size="medium"
 *   title="Team Members" 
 * />
 * 
 * @example
 * // Large size
 * <UserViewSwitcher 
 *   value={filter} 
 *   onChange={setFilter}
 *   size="large" 
 * />
 */
export const UserViewSwitcher: React.FC<UserViewSwitcherProps> = ({
  title = "Users",
  value,
  onChange,
  size = "small",
  elements = defaultSwitcherElements,
  ariaLabel = "user status filter",
  sx
}) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", ...sx }}>
      <SimpleViewSwitcher
        elements={elements}
        value={value}
        onChange={onChange}
        size={size}
        ariaLabel={ariaLabel}
        sx={{ mr: 2 }}
      />
      <Typography variant="h6">{title}</Typography>
    </Box>
  );
};
