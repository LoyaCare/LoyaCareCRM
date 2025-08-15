"use client";

import { useEffect, useCallback, useState } from "react";
import { formatDate } from "@/shared/lib/formatDate";
import { LeadExt } from "@/entities/lead/model/types";
import { useGetLeadsQuery, leadApi } from "@/entities/lead/model/api";
import { useDispatch } from "react-redux";

import * as React from "react";
import Box from "@mui/material/Box";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { visuallyHidden } from "@mui/utils";
import { alpha } from "@mui/material/styles";
import dynamic from "next/dynamic";

const LeadEditDialog = dynamic(
  () =>
    import("@/features/lead/ui/LeadEditDailog").then(
      (mod) => mod.LeadEditDialog
    ),
  { ssr: false }
);

interface LeadData {
  id: string;
  creatorName: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  createdAt: string;
  productInterest: string;
  actions: string; // Добавляем поле для колонки действий
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof LeadData;
  label: string;
  numeric?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
}

const headCells: readonly HeadCell[] = [
  {
    id: "creatorName",
    disablePadding: true,
    label: "Besitzer",
    width: 100,
  },
  {
    id: "clientName",
    disablePadding: false,
    label: "Client Name",
    width: 170,
  },
  {
    id: "clientPhone",
    numeric: true,
    disablePadding: false,
    label: "Client Phone",
  },
  {
    id: "clientEmail",
    disablePadding: false,
    label: "Client Email",
  },
  {
    id: "createdAt",
    disablePadding: false,
    label: "Lead erstellt",
  },
  {
    id: "productInterest",
    disablePadding: false,
    label: "Product",
  },
  {
    id: "actions",
    disablePadding: false,
    label: "",
    width: 48,
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof LeadData
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof LeadData) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all leads",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            {...(headCell.width ? { style: { width: headCell.width } } : {})}
            {...(headCell.minWidth
              ? { style: { minWidth: headCell.minWidth } }
              : {})}
            {...(headCell.maxWidth
              ? { style: { maxWidth: headCell.maxWidth } }
              : {})}
          >
            {headCell.id === "actions" ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <SettingsIcon
                  fontSize="small"
                  sx={{ color: "text.secondary" }}
                />
              </Box>
            ) : (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
interface EnhancedTableToolbarProps {
  numSelected: number;
  onCreateClick: () => void;
  onRefreshClick: () => void;
}
import RefreshIcon from '@mui/icons-material/Refresh';

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, onCreateClick, onRefreshClick } = props;

  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          display: "flex",
          justifyContent: "space-between",
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      ]}
    >
      <Box sx={{ flex: "1 1 100%", display: "flex", alignItems: "center" }}>
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Leads
          </Typography>
        )}
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Tooltip title="Create new lead">
        <IconButton onClick={onCreateClick} color="primary">
          <AddIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}

const covertLeadsToLeadRows = (leads: LeadExt[]) =>
  leads.map((lead) => ({
    id: lead.id,
    creatorName: lead.creator.name,
    clientName: lead.contact.name,
    clientPhone: lead.contact.phone || "",
    clientEmail: lead.contact.email || "",
    createdAt: formatDate(lead.createdAt),
    productInterest: lead.productInterest || "",
    actions: "",
  }));

export const LeadsTable = ({ initialLeads }: { initialLeads?: LeadExt[] }) => {

  const { data: leads = initialLeads, isFetching } = useGetLeadsQuery(undefined, {
    refetchOnMountOrArgChange: true
  });

  const dispatch = useDispatch();
  
  // Function to manually invalidate leads cache
  const refreshLeads = useCallback(() => {
    dispatch(leadApi.util.invalidateTags(['Leads']));
  }, [dispatch]);

  // Update rows when leads data changes
  React.useEffect(() => {
    if (leads) {
      setRows(covertLeadsToLeadRows(leads));
    }
  }, [leads]);

  // Initialize rows state with initialLeads, then update with leads from query
  const [rows, setRows] = React.useState<LeadData[]>(() =>
    covertLeadsToLeadRows(leads || [])
  );

  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof LeadData>("createdAt");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const [clickedLeadId, setClickedLeadId] = React.useState<string | null>(null);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const handleCreateClick = useCallback(() => {
    setIsCreateDialogOpen(true);
  }, []);

  const handleCreateClose = useCallback(() => {
    setIsCreateDialogOpen(false);
  }, []);

  const handleRequestSort = useCallback(
    (event: React.MouseEvent<unknown>, property: keyof LeadData) => {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
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

  const handleSelectClick = useCallback(
    (event: React.MouseEvent<unknown>, id: string) => {
      event.stopPropagation(); // Prevent row click event
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

  const handleClick = React.useCallback(
    (event: React.MouseEvent<unknown>, id: string) => {
      console.log("Clicked lead ID:", id);
      setClickedLeadId(id);
    },
    []
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

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...rows]
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
                  const isItemSelected = selected.includes(row.id);
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
                          onClick={(event) => handleSelectClick(event, row.id)}
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
                      <TableCell align="center" sx={{ width: 48 }}>
                        <IconButton size="small">
                          <MoreVertIcon fontSize="small" />
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
            rowsPerPageOptions={[5, 25, 50]}
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
          leadId={clickedLeadId || undefined}
          open={!!clickedLeadId || !!isCreateDialogOpen}
          onClose={() => {
            setClickedLeadId(null);
            handleCreateClose();
          }}
        />
      )}
    </>
  );
};
