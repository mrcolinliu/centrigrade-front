import { CourseFilter } from './filter.model';
import { SortOrder } from './../_shared/sortOrder';
import { Course } from './course.model';

export class CourseListResponse {
  total: number;
  count: number; //number requested
  order: SortOrder[] = [];
  data: Course[] = [];
  filters: CourseFilter[] = [];
  pageTitle: string;
  pageText: string;

  //Only if pagination
  perPage: number;
  currentPage: number;
  lastPage: number;
  nextPageUrl: string;
  prevPageUrl: string;
  from: number;
  to: number;

  //Only if splitFilter
  middleString: string;
  lowerCount: number;
  lower: Course[] = [];
  lowerString: string;
  upperCount: number;
  upper: Course[] = [];
  upperString: string;
}
