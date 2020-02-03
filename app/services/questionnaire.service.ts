import { AnswerRequest } from '../models/questionnaire/answerRequest.model';
import { AnswerResponse } from '../models/questionnaire/answerResponse.model';
import { AppConfig } from '../app.config';
import {
  CheckPaymentModel,
  PaymentOptions,
  PaymentSuccessRequest
} from '../models/questionnaire/payment.models';
import { CompleteResponse } from '../models/questionnaire/completeResponse.model';
import { HttpInterceptor } from '../utils/httpInterceptor.service';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Question } from '../models/questionnaire/question.model';
import { QuestionnaireModel } from '../models/questionnaire/questionnaire.model';
import { QuestionsModel } from '../models/questionnaire/questions.model';
import { ApiReponse } from '../models/_base/apiResponse.model';
import { CurrentQuestionnaireService } from './current-questionnaire.service';
import { QuestionStatusModel } from '../models/questionnaire/questionStatus.model';
import { setTimeout } from 'timers';

@Injectable()
export class QuestionnaireService {
  status: Subject<QuestionStatusModel> = new Subject<QuestionStatusModel>();
  statusOverride: Subject<number> = new Subject<number>();

  constructor(
    private http: HttpInterceptor,
    private currentQuestionnaire: CurrentQuestionnaireService
  ) {}

  getCurrentQuestionnaire(): Observable<QuestionnaireModel> {
    var url = AppConfig.ApiUrl + 'questionnaire/' + this.currentQuestionnaire.get();
    return this.http
      .get(url)
      .map(data => data.json() as QuestionnaireModel)
      .catch(err => Observable.throw(err.json() as QuestionnaireModel));
  }

  getQuestions(): Observable<QuestionsModel> {
    var url = AppConfig.ApiUrl + `questionnaire/${this.currentQuestionnaire.get()}/questions`;
    return this.http
      .get(url)
      .map(data => data.json() as QuestionsModel)
      .catch(err => Observable.throw(err.json() as QuestionsModel));
  }

  getQuestionnaireStatus(): Observable<QuestionStatusModel> {
    var url = AppConfig.ApiUrl + `questionnaire/${this.currentQuestionnaire.get()}/status`;
    return this.http
      .get(url)
      .map(data => data.json() as QuestionStatusModel)
      .mergeMap(result => {
        this.status.next(result);
        return Observable.of(result);
      })
      .catch(err => Observable.throw(err.json() as QuestionStatusModel));
  }

  submitAnswer(questionId: number, model: AnswerRequest): Observable<AnswerResponse> {
    var url =
      AppConfig.ApiUrl + `questionnaire/${this.currentQuestionnaire.get()}/answer/${questionId}`;
    return this.http
      .put(url, model)
      .map(data => data.json() as AnswerResponse)
      .catch(err => Observable.throw(err.json() as AnswerResponse));
  }

  submitCompleteQuestionnaire(): Observable<CompleteResponse> {
    var url = AppConfig.ApiUrl + `questionnaire/${this.currentQuestionnaire.get()}/complete`;
    return this.http
      .post(url, null)
      .map(data => data.json() as CompleteResponse)
      .catch(err => Observable.throw(err.json() as CompleteResponse));
  }

  requestPaymentGateway() {
    this.checkPayment().subscribe(res => {
      let queryString = this.http.objectToQueryStringParams({
        product: 'centigrade',
        start: 1,
        return_url: window.location.origin + '/#/registration-complete',
        uuid: this.currentQuestionnaire.get()
      });
      let paymentUrl = encodeURI(`${res.paymentUrl}?${queryString}`);
      window.location.href = paymentUrl;
    });
  }

  checkPayment(): Observable<CheckPaymentModel> {
    let url = AppConfig.ApiUrl + `questionnaire/${this.currentQuestionnaire.get()}/payment`;
    return this.http
      .get(url)
      .map(data => data.json() as CheckPaymentModel)
      .catch(err => Observable.throw(err.json()));
  }
}

export class AnswerStore {
  id: number;
  data: AnswerRequest;
}
