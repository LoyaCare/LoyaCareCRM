"use client";

import { useCallback } from "react";
import { useDispatch } from "react-redux";

import * as React from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import { SxProps, Theme } from "@mui/material/styles";

import {
  BaseTableRowData,
  Order,
  SortableFields,
  getComparator,
  BaseTableHead,
  BaseTableToolbar,
  defaultConvertSrcDataToDataRows,
} from "../index";
import defaultColumnsConfig from "../config";
import {
  BaseTableHeadProps,
  BaseTableToolbarProps,
  Column,
  TablePaginationComponent,
  TEditDialogComponent,
} from "../types";
import { BaseTablePagination } from "./BaseTablePagination";
import TableRow from "@mui/material/TableRow";
import { UnknownAction } from "@reduxjs/toolkit";
import { TConvertSrcDataToDataRows } from "../utils";
import { useSelection } from "../hooks/useSelection";
import { ActionCell } from "./ActionCell";
import { ActionMenu, ActionMenuItemProps, ActionMenuProps } from "./ActionMenu";

// Import helper functions from lib.ts
import {
  createStickySx,
  createTableSx,
  calculateEmptyRows,
  getVisibleRows,
  createCellProps,
} from "../lib";

export interface BaseTableProps<T, TTableData extends BaseTableRowData> {
  columnsConfig?: Column<TTableData>[];
  initialData?: T[];
  order?: Order;
  orderBy?: SortableFields<TTableData>;
  invalidate?: () => UnknownAction;
  getInitData?: () => T[];
  TableHeadComponent?: React.FC<BaseTableHeadProps<TTableData>>;
  TableToolbarComponent?: React.FC<BaseTableToolbarProps>;
  TablePaginationComponent?: TablePaginationComponent;
  EditDialogComponent?: TEditDialogComponent;
  toolbarTitle?: string | React.ReactElement;
  rowActionMenuComponent?: React.FC<ActionMenuProps>;
  rowConverter?: TConvertSrcDataToDataRows<T, TTableData>;
  rowActionMenuItems?: ActionMenuItemProps[];
  comparatorBuilder?: (
    order: Order,
    orderBy: SortableFields<TTableData>
  ) => (a: TTableData, b: TTableData) => number;
  sx?: SxProps<Theme>;
}

export function BaseTable<T, TTableData extends BaseTableRowData>({
  initialData,
  order: defaultOrder = "asc",
  orderBy: defaultOrderBy = "createdAt" as SortableFields<TTableData>,
  invalidate,
  getInitData,
  TableHeadComponent = BaseTableHead,
  TableToolbarComponent = BaseTableToolbar,
  TablePaginationComponent = BaseTablePagination,
  EditDialogComponent,
  toolbarTitle,
  comparatorBuilder = getComparator<Order, TTableData>,
  columnsConfig: columnsConfigProp,
  rowConverter = defaultConvertSrcDataToDataRows<T, TTableData>,
  rowActionMenuComponent = ActionMenu,
  rowActionMenuItems,
  sx = {},
}: BaseTableProps<T, TTableData> & { columnsConfig?: Column<TTableData>[] }) {
  const dispatch = useDispatch();

  const columnsConfig: Column<any>[] =
    (columnsConfigProp as any) || defaultColumnsConfig;

  const data = initialData || (getInitData ? getInitData() : []);

  const refreshData = useCallback(() => {
    if (invalidate) {
      dispatch(invalidate());
    }
  }, [invalidate]);

  // Initialize rows state with initial data, then update with data from query
  const [rows, setRows] = React.useState<TTableData[]>(() =>
    rowConverter?.((data as T[]) || [])
  );

  const [order, setOrder] = React.useState<Order>(defaultOrder);
  const [orderBy, setOrderBy] =
    React.useState<SortableFields<TTableData>>(defaultOrderBy);
  const { selected, isSelected, handleClick, handleSelectAll } = useSelection();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const [clickedId, setClickedId] = React.useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);

  // Update rows when data changes
  React.useEffect(() => {
    if (data && data.length > 0) {
      setRows(rowConverter?.((data as T[]) || []));
    }
  }, [data]);

  const handleCreateClick = useCallback(() => {
    setIsCreateDialogOpen(true);
  }, []);

  const handleCreateClose = useCallback(() => {
    setIsCreateDialogOpen(false);
  }, []);

  const handleRequestSort = useCallback(
    (_: React.MouseEvent<unknown>, property: keyof TTableData) => {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property as SortableFields<TTableData>);
    },
    [orderBy, order]
  );

  const handleSelectAllClick = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleSelectAll(event.target.checked, rows);
    },
    [handleSelectAll, rows]
  );

  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    []
  );

  // Use helper function for empty rows
  const emptyRows = calculateEmptyRows(page, rowsPerPage, rows.length);

  // Use helper function for visible rows
  const visibleRows = React.useMemo(
    () =>
      getVisibleRows(
        rows,
        order,
        orderBy,
        page,
        rowsPerPage,
        comparatorBuilder
      ),
    [order, orderBy, page, rowsPerPage, rows, comparatorBuilder]
  );

  const handleDialogClose = useCallback(() => {
    setClickedId(null);
    handleCreateClose();
  }, [handleCreateClose]);

  const handleEditDialogOpen = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      setClickedId(id);
    },
    [setClickedId]
  );

  // Use helper function for sticky styles
  const stickySx = React.useMemo(() => createStickySx(), []);

  // Use helper function for table styles
  const tableSx = React.useMemo(() => createTableSx(), []);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          ...sx,
        }}
      >
        <Paper
          sx={{
            width: "100%",
            mb: 2,
            display: "flex",
            flexDirection: "column",
            flex: 1,
            overflow: "hidden",
          }}
        >
          {TableToolbarComponent && (
            <TableToolbarComponent
              numSelected={selected.length}
              onCreateClick={handleCreateClick}
              onRefreshClick={refreshData}
              title={toolbarTitle}
            />
          )}
          <TableContainer
            sx={{
              overflowX: "auto",
              overflowY: "auto",
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Table sx={tableSx} aria-labelledby="tableTitle" size="small">
              {TableHeadComponent && (
                <TableHeadComponent
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy as string}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                  columns={columnsConfig}
                />
              )}
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      onDoubleClick={(event) =>
                        handleEditDialogOpen(event, row.id)
                      }
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell
                        padding="checkbox"
                        sx={{
                          ...stickySx,
                          left: 0,
                          textOverflow: "clip",
                          boxSizing: "content-box", // Ensures checkbox does not affect width calculation
                        }}
                      >
                        <Checkbox
                          onClick={(event) => handleClick(event, row.id)}
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      {columnsConfig.map(
                        (col: Column<any>, colIndex: number) => {
                          // Use helper function to create cell props
                          const { cellProps, cellSxProps, content } =
                            createCellProps(col, row, labelId, colIndex);

                          if (col.isActions) {
                            return (
                              <ActionCell
                                key={`col-${colIndex}`}
                                id={row.id}
                                MenuComponent={rowActionMenuComponent || null}
                                menuItems={rowActionMenuItems}
                                onEdit={handleEditDialogOpen}
                                cellSx={{
                                  ...stickySx,
                                  right: 0,
                                  ...cellSxProps,
                                  textOverflow: "clip",
                                  boxSizing: "content-box", // Ensures checkbox does not affect width calculation
                                }}
                              />
                            );
                          }

                          return (
                            <TableCell
                              key={`col-${colIndex}`}
                              sx={{ ...cellSxProps, ...cellProps }}
                              {...cellProps}
                            >
                              {content}
                            </TableCell>
                          );
                        }
                      )}
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 20 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={columnsConfig.length + 1} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePaginationComponent
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
      {EditDialogComponent && (clickedId || isCreateDialogOpen) && (
        <EditDialogComponent
          id={clickedId || undefined}
          open={!!clickedId || !!isCreateDialogOpen}
          onClose={handleDialogClose}
        />
      )}
    </>
  );
}
