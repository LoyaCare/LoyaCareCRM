import React from "react";
export type Order = "asc" | "desc";

//  Exclude field actions from the possible keys for sorting
export type SortableFields<T> = keyof T;

export type TBaseColumnType = { id: string }

export type Column<T extends TBaseColumnType> = {
  key?: keyof T;
  label: string;
  align?: "left" | "right" | "center";
  padding?: "normal" | "checkbox" | "none";
  formatter?: (value: any, row: T) => React.ReactNode;
  isActions?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  sortable?: boolean;
  isSticky?: boolean;
};

export type TGetColumns<T extends TBaseColumnType> = () => Column<T>[];

export interface BaseTableHeadProps<T extends TBaseColumnType> {
  columns?: Column<T>[];
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

export interface BaseTableRowData {
  id: string;
  actions?: string;
}
