import { Column, BaseTableRowData } from "../model/types";

/**
 * Creates table cell props based on column definition
 */
export const createCellProps = (
  col: Column<any>,
  row: any,
  labelId?: string,
  colIndex?: number
) => {
  const cellProps: any = {
    align: col.align || undefined,
    width: col.width || undefined,
  };

  const cellSxProps = {
    width: col.width || undefined,
    minWidth: col.minWidth || undefined,
    maxWidth: col.maxWidth || undefined,
  };

  if (col.padding === "none") {
    cellProps.padding = "none";
    if (colIndex === 0) {
      cellProps.id = labelId;
      cellProps.scope = "row";
    }
  }

  // Generate cell content
  const value = col.key ? (row[col.key as keyof typeof row] as any) : undefined;
  const content = col.formatter ? col.formatter(value, row) : value;

  return { cellProps, cellSxProps, content };
};


/**
 * Default row converter function
 */
export const defaultConvertRows = <T, TData extends BaseTableRowData>(
  data: T[]
): TData[] => {
  return data as unknown as TData[];
};
