import { UserModel } from './../models/user/user.model';
import { Http, RequestOptionsArgs, RequestMethod, Headers } from '@angular/http';
import { HttpInterceptor } from './../utils/httpInterceptor.service';
import { WelcomeComponent } from './../components/welcome/welcome.component';
import { ForgottenPasswordModel } from './../models/auth/forgottenPassword.model';
import { ForgottenPasswordResponse } from './../models/auth/forgottenPasswordResponse.model';
import { PasswordResetResponse } from './../models/auth/passwordResetResponse.model';
import { PasswordResetModel } from './../models/auth/passwordReset.model';
import { ActivateUserResponseModel } from './../models/auth/activateUserResponse.model';
import { AppConfig } from './../app.config';
import { RegisterResponseModel } from './../models/auth/registerResponse.model';
import { RegisterRequestModel } from './../models/auth/registerRequest.model';
import { LoginResponseModel } from './../models/auth/loginResponse.model';
import { LoginRequestModel } from './../models/auth/loginRequest.model';
import { ResendActivationModel } from './../models/auth/resendActivation.model';
import { ResendActivationResponse } from './../models/auth/resendActivationResponse.model';
import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs/Rx';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  redirectUrl: string;
  private signedOut: boolean = false;

  constructor(
    private http: HttpInterceptor,
    private httpBase: Http,
    private userService: UserService
  ) {}

  //Clear all Cached items
  private clearCache() {
    this.userService.clearCache();
    sessionStorage.clear();
  }

  getSignedOut() {
    return this.signedOut;
  }

  setSignedOut(value: boolean) {
    this.signedOut = value;
  }

  isAuthenticated(): boolean {
    var token = sessionStorage.getItem('token');
    return !!token;
  }

  login(model: LoginRequestModel) {
    var url = AppConfig.ApiUrl + 'login';

    return new Observable((sub: Subscriber<LoginResponseModel>) => {
      this.http
        .post(url, model)
        .map(data => data.json() as LoginResponseModel)
        .subscribe(
          data => {
            if (data.success) {
              this.clearCache();
              sessionStorage.setItem('token', data.token);
              sessionStorage.setItem('q-id', data.questionnaireId);
              sub.next(data);
              return;
            }
            sub.error(data);
          },
          err => {
            sub.error(err.json() as LoginResponseModel);
          }
        );
    });
  }

  logout(showMessage: boolean = true): void {
    if (showMessage == true) {
      this.setSignedOut(true); // To display logout message
    }
    this.clearCache();
  }

  register(model: RegisterRequestModel): Observable<RegisterResponseModel> {
    var url = AppConfig.ApiUrl + 'user/register';

    return new Observable((sub: Subscriber<RegisterResponseModel>) => {
      this.http
        .post(url, model)
        .map(data => data.json() as RegisterResponseModel)
        .subscribe(
          data => {
            if (data.success) {
              this.clearCache();
              sessionStorage.setItem('token', data.token);
              sessionStorage.setItem('q-id', data.questionnaireId);
              sub.next(data);
              return;
            }
            sub.error(data);
          },
          err => {
            sub.error(err.json() as RegisterResponseModel);
          }
        );
    });
  }

  activateUser(token: string): Observable<ActivateUserResponseModel> {
    var url = AppConfig.ApiUrl + `user/activation/${token}`;
    return this.http.post(url, null).map(data => data.json() as ActivateUserResponseModel);
  }

  forgottenPassword(model: ForgottenPasswordModel): Observable<ForgottenPasswordResponse> {
    var url = AppConfig.ApiUrl + 'user/password/email';
    return this.httpBase
      .post(url, model)
      .map(data => data.json() as ForgottenPasswordResponse)
      .catch(err => Observable.throw(err.json() as ForgottenPasswordResponse));
  }

  resetPassword(model: PasswordResetModel): Observable<PasswordResetResponse> {
    var url = AppConfig.ApiUrl + 'user/password/reset';
    return this.httpBase
      .post(url, model)
      .map(data => data.json() as PasswordResetResponse)
      .catch(err => Observable.throw(err.json() as PasswordResetResponse));
  }

  resendActivation(model: ResendActivationModel): Observable<ResendActivationResponse> {
    var url = AppConfig.ApiUrl + 'user/activation';

    let options: RequestOptionsArgs = {
      url: url + '?email=' + model.email + '&url=' + encodeURIComponent(model.url),
      method: RequestMethod.Get,
      search: null,
      headers: null,
      body: null
    };

    return this.httpBase
      .get(url, options)
      .map(data => data.json() as ResendActivationResponse)
      .catch(err => Observable.throw(err.json() as ResendActivationResponse));
  }
}
