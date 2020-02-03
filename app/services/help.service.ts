import { Injectable } from '@angular/core';
import { HttpInterceptor } from '../utils/httpInterceptor.service';
import { AppConfig } from '../app.config';
import { CurrentQuestionnaireService } from './current-questionnaire.service';
import { Observable } from 'rxjs';
import { ApiReponse } from '../models/_base/apiResponse.model';
import { Response } from '@angular/http';
import { FaqResult } from 'app/models/help/help.models';

@Injectable()
export class HelpService {
  constructor(
    private http: HttpInterceptor,
    private currentQuestionnaire: CurrentQuestionnaireService
  ) {}

  getFaq(): Observable<FaqResult> {
    let url = AppConfig.ApiUrl + `user/faq`;
    return this.http.get(url, null).map(data => data.json() as FaqResult);
  }
}
