import { Observable, Subscriber } from 'rxjs/Rx';
import { Http } from '@angular/http';
import { Injectable, Component } from '@angular/core';
import { AppConfig } from '../app.config';
import * as _ from 'lodash';

export function localisationFactory(localisation: LocalisationService) {
  return () => localisation.init(AppConfig.defaultLocale);
}

@Injectable()
export class LocalisationService {
  private locale: string = null;
  private defaults: any = null;
  private values: any = null;

  constructor(private http: Http) {}

  init(defaultLocale: string): Promise<any> {
    let userLocale = sessionStorage.getItem('locale');
    this.locale = !userLocale ? defaultLocale : userLocale;

    return Promise.all([
      this.readLocaleFile(defaultLocale),
      !userLocale ? Promise.resolve() : this.readLocaleFile(this.locale)
    ]).then(values => {
      this.defaults = values[0];
      this.values = _.merge(_.cloneDeep(this.defaults), values[1]);
    });
  }

  updateCurrentLanguage(locale: string): Promise<void> {
    this.locale = locale;
    sessionStorage.setItem('locale', this.locale);
    return this.readLocaleFile(locale).then(values => {
      this.values = _.merge(_.cloneDeep(this.defaults), values);
      return values;
    });
  }

  getTranslationsForComponent<TLocale>(key: string): TLocale {
    if (!this.values && !this.defaults) {
      throw new Error(`Translations for locale '${this.locale}' could not be found`);
    }

    let t;

    if (this.values) t = this.values[key] || this.defaults[key];
    else t = this.defaults[key];

    return t as TLocale;
  }

  private readLocaleFile(locale: string): Promise<any> {
    let filePath = 'locale/messages.' + locale + '.json';

    return this.http
      .get(filePath)
      .map(res => res.json())
      .toPromise()
      .catch(err => Observable.throw(err));
  }
}
