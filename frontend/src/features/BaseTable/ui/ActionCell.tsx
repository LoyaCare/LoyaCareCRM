import React from "react";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ActionMenu, ActionMenuProps, ActionMenuItemProps } from "./ActionMenu";
import { BaseTableRowData } from "../model";

type Props<T extends BaseTableRowData> = {
  id: string;
  className?: string;
  MenuComponent?: React.ComponentType<ActionMenuProps<T>>;
  menuItems?: ActionMenuItemProps<T>[];
  cellSx?: any; // additional sx for TableCell
};

export const ActionCell = <T extends BaseTableRowData>(props: Props<T>) => {
  const {
    id,
    // onEdit,
    className,
    MenuComponent = ActionMenu,
    menuItems,
    cellSx,
  } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      setAnchorEl(e.currentTarget);
    },
    []
  );

  const handleCloseMenu = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  // const handleEdit = React.useCallback(
  //   (e: React.MouseEvent) => {
  //     onEdit(e, id);
  //     handleCloseMenu();
  //   },
  //   [onEdit, id, handleCloseMenu]
  // );

  return (
    <TableCell className={className} sx={{ width: 44, ...cellSx }}>
      <IconButton
        size="small"
        onClick={handleOpenMenu}
        aria-label="actions"
        aria-controls={open ? `action-menu-${id}` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        sx={{ height: 28, width: 28 }}
      >
        <MoreVertIcon fontSize="small" sx={{ fontSize: 18 }} />
      </IconButton>

      <MenuComponent
        id={id}
        menuItems={menuItems}
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        // onEdit={handleEdit}
        compact={true}
      />
    </TableCell>
  );
};