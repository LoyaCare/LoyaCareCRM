import { Order, SortableFields } from "./types";
import { formatDate } from "@/shared/lib/formatDate";
import { DealExt } from "@/entities/deal/model/types";
import { DealData } from "./model";

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator<T extends DealData, Key extends keyof SortableFields<T>>(
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

export function convertDealsToDealRows<
  T extends DealExt,
  TTableData extends DealData,
>(deals: T[]): TTableData[] {
  return deals.map(
    (deal) =>
      ({
        id: deal.id,
        creatorName: deal.creator.name,
        clientName: deal.contact?.name,
        clientPhone: deal.contact?.phone,
        clientEmail: deal.contact?.email,
        createdAt: formatDate(deal.createdAt),
        productInterest: deal.productInterest,
        actions: undefined,
      }) as TTableData
  );
}
