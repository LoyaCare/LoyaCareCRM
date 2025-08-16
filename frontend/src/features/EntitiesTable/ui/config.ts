import { HeadCell } from "./types";

export const headCells: readonly HeadCell[] = [
  {
    id: "title",
    disablePadding: false,
    label: "Titel",
    // width: 100,
  },
  {
    id: "clientOrganization",
    disablePadding: false,
    label: "Organisation",
    width: 100,
  },
  {
    id: "potentialValue",
    disablePadding: false,
    label: "Wert",
    width: 70,
    numeric: true,
  },
  {
    id: "clientName",
    disablePadding: false,
    label: "Client Name",
    width: 170,
  },
  {
    id: "createdAt",
    disablePadding: false,
    label: "Lead erstellt",
    width: 200,
  },
  {
    id: "productInterest",
    disablePadding: false,
    label: "Product",
    width: 200,
  },
  {
    id: "creatorName",
    disablePadding: false,
    label: "Besitzer",
    width: 200,
  },
  {
    id: "actions",
    disablePadding: false,
    label: "",
    width: 48,
    sortable: false,
    maxWidth: 48,
  },
];
