import { HeadCell } from "./types";

export const headCells: readonly HeadCell[] = [
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
    sortable: false
  },
];
