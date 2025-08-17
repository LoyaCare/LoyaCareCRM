import { BaseTableRowData } from "./model";
import { currencyFormatter as defaultCurrencyFormatter } from "@/shared/lib/formatCurrency";
export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator<TO, T>(
  order: TO,
  orderBy: keyof T
): (a: T, b: T) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export type TConvertSrcDataToDataRows<T, TTableData extends BaseTableRowData> = (
  src: T[]
) => TTableData[];

export function defaultConvertSrcDataToDataRows<
  T,
  TTableData extends BaseTableRowData,
>(src: T[]): TTableData[] {
  return src.map(
    (_) =>
      ({
        id: "defaultConvertSrcDataToDataRows should be implemented",
      }) as TTableData
  );
}

export const currencyFormatter = <T extends BaseTableRowData>(
  value: any,
  row: T,
  currency: string = "EUR",
  locale: string = "de-DE"
): React.ReactNode =>
  value
    ? defaultCurrencyFormatter(value, currency, locale)
    : null;
