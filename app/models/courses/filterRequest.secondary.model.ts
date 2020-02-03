import { CourseFilter } from './filter.model';
import { SortOrder } from './../_shared/sortOrder';

export class SecondaryCourseFilterRequest {
  constructor() {}

  resultCount: number; //Maximum number of result to return
  splitFilter: string;
  filters: CourseFilter[] = [];
  order: SortOrder;
  page: number;
  searchText: string;
}
