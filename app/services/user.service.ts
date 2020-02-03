import { ApiReponse } from '../models/_base/apiResponse.model';
import { AppConfig } from '../app.config';
import { CountryModel } from '../models/user/country.model';
import { HttpInterceptor } from '../utils/httpInterceptor.service';
import { Injectable } from '@angular/core';
import { DisplayLanguageModel } from '../models/user/language.model';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of'; //proper way to import the 'of' operator
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { UserModel } from '../models/user/user.model';
import { GenderModel } from '../models/user/gender.model';
import { CurrentQuestionnaireService } from './current-questionnaire.service';
import { LocalisationService } from './localisation.service';

@Injectable()
export class UserService {
  private data: UserModel;
  private observable: Observable<any>;

  constructor(
    private http: HttpInterceptor,
    private currentQuestionnaire: CurrentQuestionnaireService,
    private localisation: LocalisationService
  ) {}

  getUser(): Observable<UserModel> {
    if (this.data) {
      // if `data` is available just return it as `Observable`
      return Observable.of(this.data);
    } else if (this.observable) {
      // if `this.observable` is set then the request is in progress
      // return the `Observable` for the ongoing request
      return this.observable;
    } else {
      let url = AppConfig.ApiUrl + 'user';

      // create the request, store the `Observable` for subsequent subscribers
      this.observable = this.http
        .get(url)
        .map(data => {
          // when the cached data is available we don't need the `Observable` reference anymore
          this.observable = null;
          this.data = data.json() as UserModel;
          return this.data;
          // make it shared so more than one subscriber can get the result
        })
        .share();
      return this.observable;
    }
  }

  updateUser(model: UserModel): Observable<ApiReponse> {
    let url = AppConfig.ApiUrl + 'user';
    return this.http.put(url, model).map(data => {
      let result = data.json() as ApiReponse;

      if (model.displayLanguage) this.localisation.updateCurrentLanguage(model.displayLanguage);
      // reset the cached UserModel
      this.data = null;
      return result;
    });
  }

  clearCache() {
    this.data = null;
  }

  getDisplayLanguages(): Observable<DisplayLanguageModel[]> {
    let url = AppConfig.ApiUrl + 'data/displaylanguages';
    return this.http.get(url).map(data => data.json() as DisplayLanguageModel[]);
  }

  getCountries(): Observable<CountryModel[]> {
    let url = AppConfig.ApiUrl + 'data/countries';
    return this.http
      .get(url)
      .map(data => data.json() as CountryModel[])
      .catch(err => Observable.throw(err.json() as CountryModel));
  }

  getGenders(): Observable<GenderModel[]> {
    let url = AppConfig.ApiUrl + 'data/genders';
    return this.http
      .get(url)
      .map(data => data.json() as GenderModel[])
      .catch(err => Observable.throw(err.json() as GenderModel));
  }
}
