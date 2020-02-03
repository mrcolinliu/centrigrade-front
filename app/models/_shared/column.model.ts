import { IColumnSortable } from './column.model';
export class Column {
  left: any[] = [];
  right: any[] = [];
}

export class Row<T> {
  leftItem: T;
  rightItem: T;
}

export interface IColumnSortable {
  columns: ColumnType;
}

export type ColumnType = 'single' | 'double';
