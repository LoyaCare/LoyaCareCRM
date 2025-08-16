"use client";

import { useCallback } from "react";
import { DealExt } from "@/entities/deal/model/types";
import { useGetDealsQuery, dealApi } from "@/entities/deal/model/api";
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
  DealData,
  Order,
  SortableFields,
  getComparator,
  EnhancedTableHead,
  EnhancedTableToolbar,
  convertDealsToDealRows,
} from "../index";
import { EnhancedTableProps, EnhancedTableToolbarProps } from "./types";
import { EntitiesTablePagination } from "./TablePagination";
import TableRow from "@mui/material/TableRow";
import { TablePaginationComponent, TEditDialogComponent } from "./types";
import { UnknownAction } from "@reduxjs/toolkit";

// const EditDialog = dynamic(
//   () =>
//     import("@/features/deal/ui/DealEditDialog").then(
//       (mod) => mod.DealEditDialog
//     ),
//   { ssr: false }
// );

export interface EntitiesTableProps<T extends DealExt, TTableData extends DealData> {
  initialData?: T[];
  order?: Order;
  orderBy?: SortableFields<TTableData>;
  invalidate?: () => UnknownAction;
  getInitData?: () => T[];
  EnhancedTableHeadComponent?: React.FC<EnhancedTableProps<TTableData>>;
  EnhancedTableToolbarComponent?: React.FC<
    EnhancedTableToolbarProps
  >;
  TablePaginationComponent?: TablePaginationComponent;
  EditDialogComponent?: TEditDialogComponent;
  toolbarTitle?: string | React.ReactElement;
}

export function EntitiesTable<T extends DealExt, TTableData extends DealData>({
  initialData,
  order: defaultOrder = "asc",
  orderBy: defaultOrderBy = "createdAt" as SortableFields<TTableData>,
  invalidate,
  getInitData,
  EnhancedTableHeadComponent = EnhancedTableHead,
  EnhancedTableToolbarComponent = EnhancedTableToolbar,
  TablePaginationComponent = EntitiesTablePagination,
  EditDialogComponent,
  toolbarTitle,
}: EntitiesTableProps<T, TTableData>) {
  const dispatch = useDispatch();

  const deals = getInitData ? getInitData() : initialData;

  const refreshDeals = useCallback(() => {
    if (invalidate) {
      dispatch(invalidate());
    }
  }, [invalidate]);

  // Initialize rows state with initialDeals, then update with deals from query
  const [rows, setRows] = React.useState<TTableData[]>(() =>
    convertDealsToDealRows<T, TTableData>((deals as T[]) || [])
  );

  const [order, setOrder] = React.useState<Order>(defaultOrder);
  const [orderBy, setOrderBy] =
    React.useState<SortableFields<TTableData>>(defaultOrderBy);
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const [clickedId, setClickedId] = React.useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);

  // Update rows when deals data changes
  React.useEffect(() => {
    if (deals && deals.length > 0) {
      setRows(convertDealsToDealRows<T, TTableData>((deals as T[]) || []));
    }
  }, [deals]);

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
        // .sort(getComparator<TTableData>(order as Order, orderBy as SortableFields<TTableData>))
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
          {EnhancedTableToolbarComponent && (
            <EnhancedTableToolbarComponent
              numSelected={selected.length}
              onCreateClick={handleCreateClick}
              onRefreshClick={refreshDeals}
              title={toolbarTitle}
            />
          )}
          <TableContainer>
            <Table
              stickyHeader
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
              {EnhancedTableHeadComponent && (
                <EnhancedTableHeadComponent
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
                      <TableCell id={labelId} scope="row" padding="none">
                        {row.title}
                      </TableCell>
                      <TableCell>{row.clientOrganization}</TableCell>
                      <TableCell align="right">{row.potentialValue}</TableCell>
                      <TableCell>{row.clientName}</TableCell>
                      <TableCell>{row.createdAt}</TableCell>
                      <TableCell>{row.productInterest}</TableCell>
                      <TableCell>{row.assigneeName}</TableCell>
                      <TableCell>
                        <IconButton
                          style={{ height: "24px", width: "24px" }}
                          onClick={(e) => handleEditDialogOpen(e, row.id)}
                        >
                          <MoreVertIcon height="16px" width="16px" />
                        </IconButton>
                      </TableCell>
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
                    <TableCell colSpan={6} />
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
