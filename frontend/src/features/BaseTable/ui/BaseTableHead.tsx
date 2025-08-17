import * as React from "react";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Checkbox from "@mui/material/Checkbox";
import { visuallyHidden } from "@mui/utils";
import { BaseTableHeadProps, TBaseColumnType, Column} from "./types";

export function BaseTableHead<T extends TBaseColumnType>(
  props: BaseTableHeadProps<T>
) {
  const {
    columns,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;

  const createSortHandler = React.useCallback(
    (property: keyof T) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    },
    [onRequestSort]
  );
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            slotProps={{
              input: {
                "aria-label": "select all leads",
              },
            }}
          />
        </TableCell>
        {columns?.map((headCell) => {
          const headCellId = (headCell as Column<T>).key as string;
          return (
            <TableCell
              key={headCellId}
              padding={headCell.padding || "normal"}
              sortDirection={orderBy === headCellId ? order : false}
              style={{
                width: headCell.width,
                minWidth: headCell.minWidth,
                maxWidth: headCell.maxWidth,
              }}
            >
              {headCell.sortable !== false ? (
                <TableSortLabel
                  active={orderBy === headCellId}
                  direction={orderBy === headCellId ? order : "asc"}
                  onClick={createSortHandler(headCellId as keyof T)}
                >
                  {headCell.label}
                  {orderBy === headCellId ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              ) : (
                headCell.label
              )}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}
