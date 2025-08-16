import React from "react";
import { DealData } from "./model";

export type Order = "asc" | "desc";

//  Exclude field actions from the possible keys for sorting
export type SortableFields<T> = keyof T;

export interface HeadCell {
  disablePadding: boolean;
  id: keyof DealData;
  label: string;
  numeric?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  sortable?: boolean;
}

export interface BaseTableHeadProps<T> {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

export interface BaseTableToolbarProps {
  numSelected: number;
  onCreateClick: () => void;
  onRefreshClick: () => void;
  title?: string | React.ReactElement
}

export type TablePaginationComponentProps = {
  count: number;
  rowsPerPage: number;
  page: number;
  rowsPerPageOptions?: (
    | number
    | {
        value: number;
        label: string;
      }
  )[];
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export type TablePaginationComponent =
  React.ComponentType<TablePaginationComponentProps>;

export type TEditDialogComponent = React.ComponentType<{
  id?: string;
  titleEdit?: string;
  titleCreate?: string;
  open?: boolean;
  onClose?: () => void;
}>;
