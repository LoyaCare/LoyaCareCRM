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
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import {
  BaseTableRowData,
  Order,
  SortableFields,
  getComparator,
  BaseTableHead,
  BaseTableToolbar,
  defaultConvertSrcDataToDataRows,
} from "../index";
import defaultColumnsConfig from "./config";
import {
  BaseTableHeadProps,
  BaseTableToolbarProps,
  Column,
  TablePaginationComponent,
  TEditDialogComponent,
} from "./types";
import { BaseTablePagination } from "./BaseTablePagination";
import TableRow from "@mui/material/TableRow";
import { UnknownAction } from "@reduxjs/toolkit";
import { TConvertSrcDataToDataRows } from "./utils";

export interface BaseTableProps<
  T,
  TTableData extends BaseTableRowData,
> {
  /** Optional column configuration; if omitted, default config from ../config is used */
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
  rowConverter?: TConvertSrcDataToDataRows<T, TTableData>;
  comparatorBuilder?: (
    order: Order,
    orderBy: SortableFields<TTableData>
  ) => (a: TTableData, b: TTableData) => number;
}

export function BaseTable<
  T,
  TTableData extends BaseTableRowData,
>({
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
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const [clickedId, setClickedId] = React.useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);

  // Update rows when data changes
  React.useEffect(() => {
    if (data && data.length > 0) {
      setRows(
        rowConverter?.((data as T[]) || [])
      );
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

  const handleSelectAllClick = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        const newSelected = rows.map((n) => n.id);
        setSelected(newSelected);
        return;
      }
      setSelected([]);
    },
    [rows]
  );

  const handleClick = useCallback(
    (_: React.MouseEvent<unknown>, id: string) => {
      const selectedIndex = selected.indexOf(id);
      let newSelected: readonly string[] = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }
      setSelected(newSelected);
    },
    [selected]
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

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      rows
        .sort(comparatorBuilder(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows]
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
    []
  );

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          {TableToolbarComponent && (
            <TableToolbarComponent
              numSelected={selected.length}
              onCreateClick={handleCreateClick}
              onRefreshClick={refreshData}
              title={toolbarTitle}
            />
          )}
          <TableContainer>
            <Table
              stickyHeader={true}
              sx={{
                minWidth: 750,
                borderCollapse: "collapse",
                "& th": {
                  border: "1px solid rgba(224, 224, 224, 1)",
                  padding: "6px",
                  height: "24px",
                  lineHeight: "1.2",
                  fontWeight: 700,
                },
                "& td": {
                  border: "1px solid rgba(224, 224, 224, 1)",
                  padding: "6px",
                  height: "24px",
                  lineHeight: "1.2",
                },
              }}
              aria-labelledby="tableTitle"
              size="small"
            >
              {TableHeadComponent && (
                <TableHeadComponent
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy as string}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
              )}
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      {columnsConfig.map(
                        (col: Column<any>, colIndex: number) => {
                          if (col.isActions) {
                            return (
                              <TableCell key={`col-${colIndex}`}>
                                <IconButton
                                  style={{ height: "24px", width: "24px" }}
                                  onClick={(e) =>
                                    handleEditDialogOpen(e, row.id)
                                  }
                                >
                                  <MoreVertIcon height="16px" width="16px" />
                                </IconButton>
                              </TableCell>
                            );
                          }

                          const value = col.key
                            ? (row[col.key as keyof typeof row] as any)
                            : undefined;
                          const content = col.formatter
                            ? col.formatter(value, row)
                            : value;

                          const key = `col-${colIndex}`;

                          // If this is the first data column and padding is none, set id for aria
                          const cellProps: any = {
                            align: col.align || undefined,
                          };

                          if (col.padding === "none") {
                            cellProps.padding = "none";
                            // first data column should have the label id
                            if (colIndex === 0) {
                              cellProps.id = labelId;
                              cellProps.scope = "row";
                            }
                          }

                          return (
                            <TableCell key={key} {...cellProps}>{content}</TableCell>
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
                      // height: (dense ? 33 : 53) * emptyRows,
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
