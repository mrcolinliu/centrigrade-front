import { KeyValuePair } from './../_shared/keyValue';
export class FilterOption {
  id: number | string;
  selected: boolean;
  values: KeyValuePair<string, any>[] = [];
  options: FilterOption[];

  //Used for location filter. To be refactored.
  expanded: boolean;
  shown: boolean;
}
