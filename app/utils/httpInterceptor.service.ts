import { Injectable, Inject } from '@angular/core';
import { LoginComponent } from './../components/account/login/login.component';
import { AppComponent } from './../app.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import {
  Http,
  Request,
  RequestOptionsArgs,
  Response,
  ResponseOptions,
  RequestOptions,
  Headers
} from '@angular/http';
import { Observable, Subscriber } from 'rxjs';
import { LoadingProvider } from './../components/_shared/loading-spinner/loading-spinner.component';
import { ApiReponse } from '../models/_base/apiResponse.model';
import { RequestPaymentComponent } from '../components/account/request-payment/request-payment.component';
import { Router } from '@angular/router';

@Injectable()
export class HttpInterceptor {
  app: AppComponent;

  constructor(private http: Http, private spinner: LoadingProvider, private router: Router) {}

  initialise(app: AppComponent) {
    this.app = app;
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return this.getRequestOptionArgs().flatMap(options => {
      return this.intercept(this.http.request(url, options));
    });
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.getRequestOptionArgs().flatMap(options => {
      return this.intercept(this.http.get(url, options));
    });
  }

  post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.getRequestOptionArgs().flatMap(options => {
      return this.intercept(this.http.post(url, body, options));
    });
  }

  put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.getRequestOptionArgs().flatMap(options => {
      return this.intercept(this.http.put(url, body, options));
    });
  }

  delete(url: string, options?: any): Observable<Response> {
    return this.getRequestOptionArgs().flatMap(options => {
      return this.intercept(this.http.delete(url, options));
    });
  }

  getRequestOptionArgs(
    options?: RequestOptionsArgs,
    allowAnonymous: boolean = false
  ): Observable<RequestOptionsArgs> {
    if (options == null) {
      options = new RequestOptions();
    }
    if (options.headers == null) {
      options.headers = new Headers();
    }
    options.headers.append('Content-Type', 'application/json');

    return new Observable<RequestOptionsArgs>((observer: Subscriber<RequestOptionsArgs>) => {
      if (allowAnonymous) {
        observer.next(options);
        return observer.complete();
      }
      var token = sessionStorage.getItem('token');
      options.headers.append('Authorization', 'Bearer ' + token);
      observer.next(options);
      observer.complete();
    });
  }
  // Only a function and NOT the new Angular 4.3 Interceptors @angular/common/http
  intercept(observable: Observable<Response>): Observable<Response> {
    return observable
      .flatMap((res, index) => {
        let data = res.json() as ApiReponse;
        if (data.hasOwnProperty('success') && data.hasOwnProperty('returnCode') && !data.success) {
          return Observable.throw(res);
        }
        return Observable.of(res);
      })
      .catch((err: Response, source: Observable<any>) => {
        console.warn('Http error: ' + `${err.status} | ${err.statusText} | ${err.url}`);
        this.spinner.hide();

        if ((err.status && err.status == 401) || err.status == 403) {
          try {
            let body = err.json() as ApiReponse;
            if (body.returnCode.label == 'E_USER_NOT_PAID') {
              this.app.redirectToRoute('payment');
              return Observable.throw(err);
            }
          } catch (e) {
            console.warn('err.json() failed on 403 response');
          }
          if (this.router.url != '/registration-complete') {
            sessionStorage.removeItem('token');
            this.app.redirectToRoute('login');
          }
        } else {
          // Simulate Error response for testing purposes
          /*this.app.showErrorModal({
            success: false,
            returnCode: {
              errorCode: '11009',
              label: 'E_MAINTENANCE_MODE'
            }
          } as ApiReponse); */

          // Disable popup for login & account settings
          if (this.router.url != '/account/settings' && this.router.url != '/login') {
            this.app.showErrorModal(err.json());
          }
        }
        return Observable.throw(err);
      });
  }

  objectToQueryStringParams(obj: any): string {
    if (typeof obj != 'object')
      throw new Error('objectToQueryStringParams(obj) argument must be typeof "object"');

    var str = '';
    for (var key in obj) {
      if (str != '') {
        str += '&';
      }
      str += key + '=' + encodeURIComponent(obj[key]);
    }
    return str;
  }
}
