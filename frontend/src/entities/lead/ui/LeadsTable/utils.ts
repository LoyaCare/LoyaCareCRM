import { Order } from "./types";
import { formatDate } from "@/shared/lib/formatDate";
import { LeadExt } from "@/entities/lead/model/types";
import { LeadData } from "./model";

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator<Key extends keyof any>(
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

export function convertLeadsToLeadRows(leads: LeadExt[]): LeadData[] {
  return leads.map(
    (lead) =>
      ({
        id: lead.id,
        creatorName: lead.creator.name,
        clientName: lead.contact?.name,
        clientPhone: lead.contact?.phone,
        clientEmail: lead.contact?.email,
        createdAt: formatDate(lead.createdAt),
        productInterest: lead.productInterest,
        actions: undefined,
      }) as LeadData
  );
}
