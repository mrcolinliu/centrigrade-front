import { ApiReponse } from './../_base/apiResponse.model';
import { CourseFilter } from './filter.model';

export class CourseFiltersResponse extends ApiReponse {
  count: number;
  primarySummaryText: string;
  filters: CourseFilter[];
  pageTitle: string;
  pageText: string;
}

export class CourseFilterResponse extends ApiReponse {
  primarySummaryText: string;
  secondarySummaryText: string;
  filter: CourseFilter;
}
