// import { LeadTableRowData } from "./model";

// export type Order = "asc" | "desc";

// //  Exclude field actions from the possible keys for sorting
// export type SortableLeadFields = Exclude<keyof LeadTableRowData, 'actions'>;

// export interface HeadCell {
//   disablePadding: boolean;
//   id: keyof LeadTableRowData;
//   label: string;
//   numeric?: boolean;
//   width?: number;
//   minWidth?: number;
//   maxWidth?: number;
//   sortable?: boolean;
// }

// export interface EnhancedTableProps {
//   numSelected: number;
//   onRequestSort: (
//     event: React.MouseEvent<unknown>,
//     property: keyof LeadTableRowData
//   ) => void;
//   onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   order: Order;
//   orderBy: string;
//   rowCount: number;
// }

// export interface EnhancedTableToolbarProps {
//   numSelected: number;
//   onCreateClick: () => void;
//   onRefreshClick: () => void;
// }
