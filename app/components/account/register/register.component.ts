import { LoginComponent } from './../login/login.component';
import { ActivationComponent } from './../activation/activation.component';
import { Router } from '@angular/router';
import { LoginRequestModel } from './../../../models/auth/loginRequest.model';
import { CountryModel } from './../../../models/user/country.model';
import { GenderModel } from './../../../models/user/gender.model';
import { UserService } from './../../../services/user.service';
import { ModalProvider } from './../../_shared/modal/modal.component';
import { LoadingProvider } from './../../_shared/loading-spinner/loading-spinner.component';
import { RegisterResponseModel } from './../../../models/auth/registerResponse.model';
import { AuthService } from './../../../services/auth.service';
import { RegisterRequestModel } from './../../../models/auth/registerRequest.model';
import { Component, OnInit } from '@angular/core';
import { RegisterCompleteComponent } from './../register-complete/register-complete.component';
import { RequestPaymentComponent } from './../request-payment/request-payment.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalisationService } from '../../../services/localisation.service';
import { AppConfig } from '../../../app.config';
import { QuestionnaireService } from '../../../services/questionnaire.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  static route: string = 'register';

  locale: any = {};

  showPassword: boolean = false;
  passwordType: string = 'password';
  passwordLength: number;

  registerForm: FormGroup;
  registerFormSubmitted: boolean = false;
  countries: CountryModel[] = [];
  genders: GenderModel[] = [];

  public formSubmitted: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private localisation: LocalisationService,
    private authService: AuthService,
    private userService: UserService,
    private modal: ModalProvider,
    private spinner: LoadingProvider,
    private questionnaireService: QuestionnaireService
  ) {}

  ngOnInit() {
    this.locale = this.localisation.getTranslationsForComponent('RegisterComponent');
    this.passwordLength = AppConfig.passwordLength;

    let validation = {};
    this.registerForm = this.formBuilder.group({
      firstName: [null, Validators.required],
      secondName: [null, Validators.required],
      email: [null, [Validators.required, Validators.pattern(AppConfig.emailRegex)]],
      emailAgain: [null],
      password: [null, [Validators.required, Validators.minLength(this.passwordLength)]],
      gender: [null, [Validators.required]],
      country: [null, [Validators.required]],
      school: [null],
      emailPreference: [false, Validators.required],
      url: [
        `${window.location.origin}/#/${ActivationComponent.route}${
          ActivationComponent.routeParams
        }`,
        Validators.required
      ],
      terms: [null, Validators.requiredTrue]
    });

    if (sessionStorage.getItem('registerForm'))
      this.setValues(JSON.parse(sessionStorage.getItem('registerForm')));

    this.userService.getCountries().subscribe(
      countries => {
        // Had to change it here to ensure index is the same country v countries when looping in .html
        this.countries = _.orderBy(countries, ['priority', 'countryName'], 'asc');
      },
      err => {
        this.modal.create(
          this.locale.registerFailedDefaultModalTitle,
          this.locale.resourceFailedToLoad,
          '<a onclick="window.location.reload(false);">' + this.locale.resourceTryAgainLink + '</a>'
        );
        this.spinner.show(this.locale.loadingText);
      }
    );

    this.userService.getGenders().subscribe(
      genders => {
        this.genders = genders;
      },
      err => {
        this.modal.create(
          this.locale.registerFailedDefaultModalTitle,
          this.locale.resourceFailedToLoad,
          '<a onclick="window.location.reload(false);">' + this.locale.resourceTryAgainLink + '</a>'
        );
        this.spinner.show(this.locale.loadingText);
      }
    );

    sessionStorage.setItem('paying', 'true');
  }

  setFormSubmitted(value) {
    this.formSubmitted = value;
  }

  ngOnDestroy() {
    let values = [];
    this.getValues().forEach(e => {
      if (e['name'] !== 'password') values.push(e);
    });

    sessionStorage.setItem('registerForm', JSON.stringify(values));
  }

  private getValues(): object[] {
    let values = [];

    Object.keys(this.registerForm.controls).forEach(e => {
      let control = this.registerForm.controls[e];
      values.push({ name: e, value: control.value });
    });

    return values;
  }

  private setValues(values: object[]) {
    values.forEach(e => {
      if (!this.registerForm.controls[e['name']]) {
        sessionStorage.removeItem('registerForm');
        return;
      }
      this.registerForm.controls[e['name']].setValue(e['value']);
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
    this.passwordType = this.showPassword ? 'text' : 'password';
  }

  register(model: RegisterRequestModel) {
    this.registerFormSubmitted = true;

    if (!this.registerForm.valid) {
      this.registerFailed(false);
      return;
    }

    if (
      this.registerForm.controls['email'].value != this.registerForm.controls['emailAgain'].value
    ) {
      this.registerFailed(false);
      return;
    }

    this.setFormSubmitted(true);
    this.authService.register(model).subscribe(
      response => {
        this.setFormSubmitted(false);
        if (response.success) {
          document.cookie = 'state=1';
          this.registerSucceeded();
        } else {
          this.modal.create(
            this.locale.registerFailedDefaultModalTitle,
            response.returnCode.message
          );
        }
      },
      (err: RegisterResponseModel) => {
        this.setFormSubmitted(false);
        this.registerFailed(true, err);
      }
    );
  }

  registerFailed(isServerError: boolean, err?: RegisterResponseModel) {
    let text = this.locale.registerFailedValidationModalText;

    if (isServerError) {
      if (err.returnCode.label !== 'E_EMAIL_TAKEN') return;

      if (err && err.returnCode) {
        text = err.returnCode.message;
      } else {
        text = this.locale.registerFailedDefaultModalText;
      }

      this.modal.create(this.locale.registerFailedDefaultModalTitle, text);
    }
  }

  registerSucceeded() {
    this.questionnaireService.requestPaymentGateway();
  }
}
