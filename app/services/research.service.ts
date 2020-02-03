import { Injectable } from '@angular/core';
import { HttpInterceptor } from '../utils/httpInterceptor.service';
import { AppConfig } from '../app.config';
import { CurrentQuestionnaireService } from './current-questionnaire.service';
import { Observable } from 'rxjs';
import { ApiReponse } from '../models/_base/apiResponse.model';
import {
  ResearchSummary,
  ShortlistResponse,
  CourseComparisonDetails,
  ResearchAreasResponse,
  ResearchAreaType,
  UpdateResearchAreaLink,
  FinalisedShortlist,
  ResearchAreaSummary
} from '../models/research/research.models';
import { Response } from '@angular/http';

@Injectable()
export class ResearchService {
  constructor(
    private http: HttpInterceptor,
    private currentQuestionnaire: CurrentQuestionnaireService
  ) {}

  addCourseToShortlist(id: string | number): Observable<ApiReponse> {
    let url =
      AppConfig.ApiUrl + `research/${this.currentQuestionnaire.get()}/shortlist/course/${id}`;
    return this.http.post(url, null).map(data => data.json() as ApiReponse);
  }

  removeCourseFromShortlist(id: string | number): Observable<ApiReponse> {
    let url =
      AppConfig.ApiUrl + `research/${this.currentQuestionnaire.get()}/shortlist/course/${id}`;
    return this.http.delete(url, null).map(data => data.json() as ApiReponse);
  }

  getShortlist(): Observable<ShortlistResponse> {
    let url = AppConfig.ApiUrl + `research/${this.currentQuestionnaire.get()}/shortlist`;
    return this.http.get(url).map(data => data.json() as ShortlistResponse);
  }

  getShortlistComparison(courseIds: string[] = []): Observable<CourseComparisonDetails[]> {
    let url = AppConfig.ApiUrl + `research/${this.currentQuestionnaire.get()}/shortlist/comparison`;
    return this.http
      .get(url)
      .map(data => data.json())
      .catch(err => Observable.throw(err.json()));
  }

  rateCourse(courseId: string, rating: number): Observable<ApiReponse> {
    if (rating < 1 || rating > 5) throw Error('Rating must be between 1 and 5');

    let url =
      AppConfig.ApiUrl + `research/${this.currentQuestionnaire.get()}/rating/course/${courseId}`;
    let model = { rating: rating };
    return this.http
      .post(url, model)
      .map(data => data.json())
      .catch(err => Observable.throw(err.json()));
  }

  deleteCourseRating(courseId: string): Observable<ApiReponse> {
    let url =
      AppConfig.ApiUrl + `research/${this.currentQuestionnaire.get()}/rating/course/${courseId}`;
    return this.http
      .delete(url)
      .map(data => data.json())
      .catch(err => Observable.throw(err.json()));
  }

  updateInstitutionNote(institutionId: string, note: string): Observable<ApiReponse> {
    let url =
      AppConfig.ApiUrl +
      `research/${this.currentQuestionnaire.get()}/note/institution/${institutionId}`;
    let model = { text: note };
    return this.http
      .put(url, model)
      .map(data => data.json())
      .catch(err => Observable.throw(err.json()));
  }

  deleteInstitutionNote(institutionId: string): Observable<ApiReponse> {
    let url =
      AppConfig.ApiUrl +
      `research/${this.currentQuestionnaire.get()}/note/institution/${institutionId}`;
    return this.http
      .delete(url)
      .map(data => data.json())
      .catch(err => Observable.throw(err.json()));
  }

  updateCourseNote(courseId: string, note: string): Observable<ApiReponse> {
    let url =
      AppConfig.ApiUrl + `research/${this.currentQuestionnaire.get()}/note/course/${courseId}`;
    let model = { text: note };
    return this.http
      .put(url, model)
      .map(data => data.json())
      .catch(err => Observable.throw(err.json()));
  }

  deleteCourseNote(courseId: string): Observable<ApiReponse> {
    let url =
      AppConfig.ApiUrl + `research/${this.currentQuestionnaire.get()}/note/institution/${courseId}`;
    return this.http
      .delete(url)
      .map(data => data.json())
      .catch(err => Observable.throw(err.json()));
  }

  getResearchAreas(): Observable<ResearchAreasResponse> {
    let url = AppConfig.ApiUrl + `research/${this.currentQuestionnaire.get()}/area`;
    return this.http
      .get(url)
      .map(data => data.json())
      .catch(err => Observable.throw(err.json()));
  }

  getDefaultResearchAreas(): Observable<ResearchAreaSummary[]> {
    let url = AppConfig.ApiUrl + `data/researchareas`;
    return this.http
      .get(url)
      .map(data => data.json())
      .catch(err => Observable.throw(err.json()));
  }

  addOrUpdateResearchArea(model: ResearchAreaSummary): Observable<ResearchAreaSummary> {
    let url = AppConfig.ApiUrl + `research/${this.currentQuestionnaire.get()}/area`;
    let result = !model.id ? this.http.post(url, model) : this.http.put(url, model);
    return result.map(data => data.json()).catch(err => Observable.throw(err.json()));
  }

  deleteResearchArea(id: number): Observable<ApiReponse> {
    let url = AppConfig.ApiUrl + `research/${this.currentQuestionnaire.get()}/area/${id}`;
    return this.http
      .delete(url)
      .map(data => data.json())
      .catch(err => Observable.throw(err.json()));
  }

  addOrUpdateInstitutionLink(model: UpdateResearchAreaLink): Observable<ApiReponse> {
    let url =
      AppConfig.ApiUrl +
      `research/${this.currentQuestionnaire.get()}/area/${model.aid}/institution/${model.linkId}`;
    return this.http
      .post(url, model)
      .map(data => data.json())
      .catch(err => Observable.throw(err.json()));
  }

  deleteInstitutionLink(model: UpdateResearchAreaLink): Observable<ApiReponse> {
    let url =
      AppConfig.ApiUrl +
      `research/${this.currentQuestionnaire.get()}/area/${model.aid}/institution/${model.linkId}`;
    return this.http
      .delete(url, model)
      .map(data => data.json())
      .catch(err => Observable.throw(err.json()));
  }

  addOrUpdateCourseLink(model: UpdateResearchAreaLink): Observable<ApiReponse> {
    let url =
      AppConfig.ApiUrl +
      `research/${this.currentQuestionnaire.get()}/area/${model.aid}/course/${model.linkId}`;
    return this.http
      .post(url, model)
      .map(data => data.json())
      .catch(err => Observable.throw(err.json()));
  }

  deleteCourseLink(model: UpdateResearchAreaLink): Observable<ApiReponse> {
    let url =
      AppConfig.ApiUrl +
      `research/${this.currentQuestionnaire.get()}/area/${model.aid}/course/${model.linkId}`;
    return this.http
      .delete(url, model)
      .map(data => data.json())
      .catch(err => Observable.throw(err.json()));
  }

  getFinalisedList(): Observable<FinalisedShortlist> {
    let url = AppConfig.ApiUrl + `research/${this.currentQuestionnaire.get()}/finalisedlist`;
    return this.http
      .get(url)
      .map(data => data.json())
      .catch(err => Observable.throw(err.json()));
  }

  exportShortlist(email: string): Observable<ApiReponse> {
    let url = AppConfig.ApiUrl + `research/${this.currentQuestionnaire.get()}/finalisedlist/export`;
    let model = { email: email };
    return this.http
      .post(url, model)
      .map(data => data.json())
      .catch(err => Observable.throw(err.json()));
  }

  getResearchSummary(): Observable<ResearchSummary> {
    let url = AppConfig.ApiUrl + `research/${this.currentQuestionnaire.get()}/summary`;
    return this.http
      .get(url)
      .map(data => data.json())
      .catch(err => Observable.throw(err.json()));
  }
}
