"use client";
import React from "react";
import { ViewSwitcher, ViewSwitcherElement } from "@/shared";
import { Box, Typography } from "@mui/material";

import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import TableViewIcon from '@mui/icons-material/TableView';
import ArchiveIcon from '@mui/icons-material/Archive';

const switcherItems: ViewSwitcherElement[] = [
  { 
    name: "Table", 
    path: "/deals", 
    icon: <TableViewIcon />, 
    label: "Table View" 
  },
  { 
    name: "Kanban", 
    path: "/deals/kanban", 
    icon: <ViewKanbanIcon />, 
    label: "Kanban View" 
  },
  { 
    name: "Archived", 
    path: "/deals/archived", 
    icon: <ArchiveIcon />, 
    label: "Show archived deals" 
  },
];

export interface DealViewSwitcherProps {
  title?: string;
}

/**
 * Component for switching between different deal views.
 * Includes title "Deals" and switch with table, kanban and archived views.
 */
export const DealViewSwitcher: React.FC<DealViewSwitcherProps> = ({
  title = "Deals"
}) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <ViewSwitcher elements={switcherItems} sx={{ mr: 2 }} />
      <Typography variant="h6">{title}</Typography>
    </Box>
  );
};