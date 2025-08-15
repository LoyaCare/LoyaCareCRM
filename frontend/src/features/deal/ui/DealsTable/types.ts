import { DealData } from "./model";

export type Order = "asc" | "desc";

//  Exclude field actions from the possible keys for sorting
export type SortableFields<T extends DealData> = Exclude<keyof T, 'actions'>;

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

export interface EnhancedTableProps<T extends DealData> {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof T
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

export interface EnhancedTableToolbarProps {
  numSelected: number;
  onCreateClick: () => void;
  onRefreshClick: () => void;
}
