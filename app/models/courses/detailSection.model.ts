import { IColumnSortable, ColumnType } from './../_shared/column.model';
import { DetailSectionData } from './detailSectionData.model';
import { KeyValuePair } from '../_shared/keyValue';

export class DetailSection implements IColumnSortable {
  header: string;
  text: string;
  keyHeader: string;
  matchText: string;
  type: string;
  data: DetailSectionData[] = [];
  columns: ColumnType;

  //This is temp until they rename ->
  map: Coordinate = new Coordinate();
  // ->
}

export class EntryRequirementsDetailSection extends DetailSection {
  tariff: KeyValuePair<string, string>[] = [];
}

export class Coordinate {
  latitude: number;
  longitude: number;
}
