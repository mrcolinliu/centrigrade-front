import { AppConfig } from '../app.config';
import { CourseArea, CourseAreasResponse, CourseAreaTop } from '../models/courses/courseArea.model';
import { CourseAreaDetail } from '../models/courses/courseAreaDetail.model';
import { CourseDetail } from '../models/courses/courseDetail.model';
import { CourseFilter } from '../models/courses/filter.model';
import {
  CourseFilterResponse,
  CourseFiltersResponse
} from '../models/courses/filterResponse.model';
import { CourseFilterWarningsModel } from '../models/courses/filterWarnings.model';
import { CourseListResponse } from '../models/courses/courseListResponse.model';
import { HttpInterceptor } from '../utils/httpInterceptor.service';
import { Injectable } from '@angular/core';
import { InstitutionDetail } from '../models/courses/institutionDetail.model';
import { Observable } from 'rxjs';
import {
  PrimaryCourseFilterRequest,
  PrimaryCourseFiltersRequest
} from '../models/courses/filterRequest.primary.model';
import { QuestionnaireService } from './questionnaire.service';
import { SecondaryCourseFilterRequest } from '../models/courses/filterRequest.secondary.model';
import { SelectCourseAreaResponse } from '../models/courses/selectCourseAreaResponse.model';
import { CurrentQuestionnaireService } from './current-questionnaire.service';

@Injectable()
export class CourseService {
  constructor(
    private http: HttpInterceptor,
    private questionnaireService: QuestionnaireService,
    private currentQuestionnaire: CurrentQuestionnaireService
  ) {}

  getCourseAreas(): Observable<CourseAreasResponse> {
    let url = AppConfig.ApiUrl + `coursearea/${this.currentQuestionnaire.get()}`;
    return this.http.get(url).map(data => data.json() as CourseAreasResponse);
  }

  selectCourseArea(courseAreaId: number): Observable<SelectCourseAreaResponse> {
    this.clearCourseListState();
    let url =
      AppConfig.ApiUrl + `coursearea/${this.currentQuestionnaire.get()}/select/${courseAreaId}`;
    return this.http.put(url, null).map(data => data.json() as SelectCourseAreaResponse);
  }

  deselectCourseArea(courseAreaId: number): Observable<SelectCourseAreaResponse> {
    let url =
      AppConfig.ApiUrl + `coursearea/${this.currentQuestionnaire.get()}/deselect/${courseAreaId}`;
    return this.http.put(url, null).map(data => data.json() as SelectCourseAreaResponse);
  }

  getCourseAreaDetail(courseAreaId: number): Observable<CourseAreaDetail> {
    let url =
      AppConfig.ApiUrl + `coursearea/${this.currentQuestionnaire.get()}/area/${courseAreaId}`;
    return this.http.get(url).map(data => data.json() as CourseAreaDetail);
  }

  getPrimaryCourseFilters(filters: PrimaryCourseFiltersRequest): Observable<CourseFiltersResponse> {
    let url = AppConfig.ApiUrl + `courselist/${this.currentQuestionnaire.get()}/primary`;
    return this.http.post(url, filters).map(data => data.json() as CourseFiltersResponse);
  }

  getPrimaryCourseFilterDetails(primaryFilterId: number): Observable<CourseFilterResponse> {
    let url =
      AppConfig.ApiUrl + `courselist/${this.currentQuestionnaire.get()}/primary/${primaryFilterId}`;
    return this.http.get(url).map(data => data.json() as CourseFilterResponse);
  }

  savePrimaryCourseFilter(filter: PrimaryCourseFilterRequest): Observable<CourseFilterResponse> {
    this.clearCourseListState();
    let url =
      AppConfig.ApiUrl +
      `courselist/${this.currentQuestionnaire.get()}/primary/${filter.filter.id}`;
    return this.http.put(url, filter).map(data => data.json() as CourseFilterResponse);
  }

  deletePrimaryCourseFilters(): Observable<CourseFiltersResponse> {
    let url = AppConfig.ApiUrl + `courselist/${this.currentQuestionnaire.get()}/primary`;
    return this.http.delete(url).map(data => data.json() as CourseFiltersResponse);
  }

  deletePrimaryCourseFilter(filterId: number) {
    let url =
      AppConfig.ApiUrl + `courselist/${this.currentQuestionnaire.get()}/primary/${filterId}`;
    return this.http.delete(url).map(data => data.json() as CourseFiltersResponse);
  }

  getFilterWarnings(filterId: number): Observable<CourseFilterWarningsModel> {
    let url =
      AppConfig.ApiUrl + `courselist/${this.currentQuestionnaire.get()}/warnings/${filterId}`;
    return this.http.get(url).map(data => data.json() as CourseFilterWarningsModel);
  }

  getCoursesBySecondaryFilters(
    options?: SecondaryCourseFilterRequest
  ): Observable<CourseListResponse> {
    let url = AppConfig.ApiUrl + `courselist/${this.currentQuestionnaire.get()}/secondary`;
    return this.http.post(url, options).map(data => data.json() as CourseListResponse);
  }

  deleteSecondaryFilters(): Observable<CourseListResponse> {
    let url = AppConfig.ApiUrl + `courselist/${this.currentQuestionnaire.get()}/secondary`;
    return this.http.delete(url).map(data => data.json() as CourseListResponse);
  }

  getCourseDetail(courseId: string): Observable<CourseDetail> {
    let url = AppConfig.ApiUrl + `courselist/${this.currentQuestionnaire.get()}/course/${courseId}`;
    return this.http.get(url).map(data => data.json() as CourseDetail);
  }
  getInstitutionDetail(institutionId: string): Observable<InstitutionDetail> {
    let url =
      AppConfig.ApiUrl +
      `courselist/${this.currentQuestionnaire.get()}/institution/${institutionId}`;
    return this.http.get(url).map(data => data.json() as InstitutionDetail);
  }

  getCourseAreasTopFive(): Observable<CourseAreaTop> {
    let url = AppConfig.ApiUrl + `coursearea/${this.currentQuestionnaire.get()}/top/5`;
    return this.http.get(url).map(data => data.json() as CourseAreaTop);
  }

  clearCourseListState() {
    sessionStorage.removeItem('searchTerm');
    sessionStorage.removeItem('searchSortOrder');
    sessionStorage.removeItem('searchActiveTab');
  }
}
