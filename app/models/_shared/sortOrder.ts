export class SortOrder {
  id: number;
  orderName: string; //Display
  directions: SortDirection[] = [];
}

class SortDirection {
  direction: string; //ASC DESC
  selected: boolean;
}
