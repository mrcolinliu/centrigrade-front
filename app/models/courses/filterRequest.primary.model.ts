import { CourseFilter } from './filter.model';

export class PrimaryCourseFiltersRequest {
  filters: CourseFilter[] = [];

  constructor(filters: CourseFilter[]) {
    this.filters = filters;
  }
}

export class PrimaryCourseFilterRequest {
  filter: CourseFilter = new CourseFilter();

  constructor(filter: CourseFilter) {
    this.filter = filter;
  }
}
