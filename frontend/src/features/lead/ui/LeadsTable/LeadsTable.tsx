"use client";

import { useCallback } from "react";
import { LeadExt } from "@/entities/lead/model/types";
import { useGetLeadsQuery, leadApi } from "@/entities/lead/model/api";
import { useDispatch } from "react-redux";

import * as React from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import dynamic from "next/dynamic";

import {
  LeadData,
  Order,
  SortableLeadFields,
  getComparator,
  EnhancedTableHead,
  EnhancedTableToolbar,
  convertLeadsToLeadRows,
} from "./index";

const LeadEditDialog = dynamic(
  () =>
    import("@/features/deal/ui/DealEditDialog").then(
      (mod) => mod.DealEditDialog
    ),
  { ssr: false }
);

interface TableProps<T> {
  initialData: T;
  invalidate?: () => void;
}

export function LeadsTable<T extends LeadExt[]>({
  initialData,
  invalidate = () => {},
}: TableProps<T>) {
  const dispatch = useDispatch();
  const { data: leads = initialData } = useGetLeadsQuery();

  const refreshLeads = useCallback(() => {
    invalidate?.();
    // dispatch(leadApi.util.invalidateTags(["Leads"]));
  }, [invalidate]);

  // Initialize rows state with initialLeads, then update with leads from query
  const [rows, setRows] = React.useState<LeadData[]>(() =>
    convertLeadsToLeadRows(leads || [])
  );

  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<SortableLeadFields>("createdAt");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const [clickedLeadId, setClickedLeadId] = React.useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);

  // Update rows when leads data changes
  React.useEffect(() => {
    if (leads) {
      setRows(convertLeadsToLeadRows(leads));
    }
  }, [leads]);

  const handleCreateClick = useCallback(() => {
    setIsCreateDialogOpen(true);
  }, []);

  const handleCreateClose = useCallback(() => {
    setIsCreateDialogOpen(false);
  }, []);

  const handleRequestSort = useCallback(
    (_: React.MouseEvent<unknown>, property: keyof LeadData) => {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property as SortableLeadFields);
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

  const handleChangeDense = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setDense(event.target.checked);
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
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows]
  );

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            onCreateClick={handleCreateClick}
            onRefreshClick={refreshLeads}
          />
          <TableContainer>
            <Table
              stickyHeader
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
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
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.creatorName}
                      </TableCell>
                      <TableCell>{row.clientName}</TableCell>
                      <TableCell align="right">{row.clientPhone}</TableCell>
                      <TableCell>{row.clientEmail}</TableCell>
                      <TableCell>{row.createdAt}</TableCell>
                      <TableCell>{row.productInterest}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setClickedLeadId(row.id);
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
        />
      </Box>
      {(clickedLeadId || isCreateDialogOpen) && (
        <LeadEditDialog
          dealId={clickedLeadId || undefined}
          open={!!clickedLeadId || !!isCreateDialogOpen}
          onClose={() => {
            setClickedLeadId(null);
            handleCreateClose();
          }}
        />
      )}
    </>
  );
}
