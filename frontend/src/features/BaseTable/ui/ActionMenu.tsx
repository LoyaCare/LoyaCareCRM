import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { on } from "events";

export type ActionMenuItemProps = {
  onClick?: (e: React.MouseEvent, id?: string) => void;
  icon?: React.ReactNode;
  element: string | React.ReactNode;
};

export type ActionMenuProps = {
  id: string;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onEdit: (e: React.MouseEvent) => void;

  menuItems?: ActionMenuItemProps[];

  compact?: boolean;
};

export const ActionMenu: React.FC<ActionMenuProps> = ({
  id,
  anchorEl,
  open,
  onClose,
  onEdit,
  menuItems,
  compact = true,
}) => {
    menuItems = [
      {
        onClick: (e) => {
          onEdit(e);
        },
        icon: <EditIcon fontSize="small" />,
        element: "Edit",
      },
      ...menuItems || [],
    ];
  return (
    <Menu
      id={`action-menu-${id}`}
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      onClick={(e) => e.stopPropagation()}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      PaperProps={{
        sx: {
          minWidth: compact ? 150 : 200,
          "& .MuiMenuItem-root": {
            py: compact ? 0.4 : 0.6,
            px: compact ? 0.75 : 1,
            minHeight: compact ? 30 : 36,
            fontSize: compact ? "0.85rem" : "0.95rem",
          },
          "& .MuiListItemIcon-root": {
            minWidth: 32,
          },
        },
      }}
    >
      {menuItems?.map((item, index) => (
        <MenuItem key={index} onClick={(e) => { item.onClick?.(e, id); onClose(); }}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.element} />
        </MenuItem>
      ))}


    </Menu>
  );
};
