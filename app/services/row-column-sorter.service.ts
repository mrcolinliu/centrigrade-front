import { Row, ColumnType, IColumnSortable } from './../models/_shared/column.model';
import { Injectable } from '@angular/core';

@Injectable()
export class RowColumnSorter {
  constructor() {}

  sortTwoPerRow<T>(collection: T[]): Row<T>[] {
    if (!collection || !collection.length) return [];

    let rows: Row<T>[] = [];

    collection.forEach((item, i) => {
      if (i % 2 == 0) {
        rows.push(new Row<T>());
        rows[rows.length - 1].leftItem = item;
      } else {
        rows[rows.length - 1].rightItem = item;
      }
    });

    return rows;
  }

  sortDynamic<T extends IColumnSortable>(collection: IColumnSortable[]): Row<T>[] {
    if (!collection || !collection.length) return [];

    let rows: Row<T>[] = [];

    collection.forEach((item, i) => {
      let previousRow = rows[rows.length - 1];
      if (
        item.columns == 'double' ||
        !previousRow ||
        previousRow.leftItem.columns == 'double' ||
        !!previousRow.rightItem
      ) {
        rows.push(new Row<T>());
        rows[rows.length - 1].leftItem = item as T;
      } else {
        rows[rows.length - 1].rightItem = item as T;
      }
    });

    return rows;
  }
}
