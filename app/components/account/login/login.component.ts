import { LoginResponseModel } from './../../../models/auth/loginResponse.model';
import { ForgottenLoginComponent } from './../forgotten-login/forgotten-login.component';
import { ModalProvider } from './../../_shared/modal/modal.component';
import { LoadingProvider } from './../../_shared/loading-spinner/loading-spinner.component';
import { LoginRequestModel } from './../../../models/auth/loginRequest.model';
import { WelcomeComponent } from './../../welcome/welcome.component';
import { CourseAreaListComponent } from './../../course-areas/list/course-area-list/course-area-list.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalisationService } from '../../../services/localisation.service';
import { Globals } from './../../../../globals';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  static route: string = 'login';

  locale: any = {};

  showPassword: boolean = false;
  passwordType: string = 'password';
  passwordToggleText: string = 'Show';

  loginForm: FormGroup;

  messageCopy: string = null;
  messageClass: string = this.globals.styles.alertClass;

  public signedOut: boolean = false;
  public formSubmitted: boolean = false;

  constructor(
    private globals: Globals,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public modal: ModalProvider,
    private spinner: LoadingProvider,
    private localistaion: LocalisationService
  ) {}

  ngOnInit() {
    let locale = this.localistaion.getTranslationsForComponent('LoginComponent');

    this.locale = locale;

    var validationModel = {};

    Object.getOwnPropertyNames(new LoginRequestModel()).forEach(key => {
      validationModel[key] = [null, Validators.required];
    });

    // Display logout message
    if (this.authService.getSignedOut() == true) {
      this.signedOut = this.authService.getSignedOut();
      this.authService.setSignedOut(false);
    }

    this.loginForm = this.formBuilder.group(validationModel);
  }

  setFormSubmitted(value) {
    this.formSubmitted = value;
  }

  // Clear messages when input fields are active
  onClickInput() {
    this.messageCopy = null;
    this.signedOut = false;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
    this.passwordType = this.showPassword ? 'text' : 'password';
  }

  login(model: LoginRequestModel) {
    if (!this.loginForm.valid) {
      var res = new LoginResponseModel();
      res.returnCode.label = 'E_INPUT_INVALID';
      this.loginFailed(res);
      return;
    } else {
      this.spinner.show();
      this.setFormSubmitted(true);
      this.authService.login(model).subscribe(
        succeeded => {
          this.spinner.hide();
          this.setFormSubmitted(false);
          document.cookie = 'state=1';
          if (sessionStorage.getItem('areas-seen') == 'true') {
            this.router.navigate([`/centigrade/${CourseAreaListComponent.route}`]);
          } else {
            this.router.navigate([`/${WelcomeComponent.route}`]);
          }
        },
        err => {
          this.spinner.hide();
          this.setFormSubmitted(false);
          this.loginFailed(err);
        }
      );
    }
  }

  loginFailed(err: LoginResponseModel) {
    this.messageClass = this.globals.styles.errorClass;
    switch (err.returnCode.label) {
      case 'E_USER_NOT_ACTIVE':
        this.messageCopy = this.locale.loginFailedInactiveUserModalMessage;
        break;
      case 'E_USER_INVALID':
        this.messageCopy = this.locale.loginFailedUserInvalid;
        break;
      default:
        this.messageCopy = this.locale.loginFailedDefaultModalMessage;
        break;
    }
  }
}
