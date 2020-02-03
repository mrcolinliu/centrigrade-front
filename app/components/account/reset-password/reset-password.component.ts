import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalProvider } from './../../_shared/modal/modal.component';
import { PasswordResetModel } from './../../../models/auth/passwordReset.model';
import { PasswordResetResponse } from './../../../models/auth/passwordResetResponse.model';
import { LoginComponent } from '../../account/login/login.component';
import { LocalisationService } from '../../../services/localisation.service';
import { equalsValidator } from '../../../directives/equals-validator.directive';
import { AppConfig } from 'app/app.config';
import { ResetPasswordService } from '../../../services/reset-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  static route: string = 'reset-password';
  static routeParams: string = '?validation=';

  locale: any = {};

  resetPasswordForm: FormGroup;
  resetPasswordSubmitted: boolean = false;
  passwordLength: number;

  validationToken: string;

  showPassword: boolean = false;
  passwordType: string = 'password';
  showConfirmPassword: boolean = false;
  confirmPasswordType: string = 'password';
  passwordToggleText: string = 'Show';
  public formSubmitted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private localistaion: LocalisationService,
    private resetPasswordService: ResetPasswordService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    public modal: ModalProvider
  ) {}

  ngOnInit() {
    this.locale = this.localistaion.getTranslationsForComponent('ResetPasswordComponent');
    this.passwordLength = AppConfig.passwordLength;

    this.route.queryParams.subscribe(params => {
      this.validationToken = params['validation'];
      if (!this.validationToken) {
        this.router.navigate([`/${LoginComponent.route}`]);
      }

      this.resetPasswordForm = this.formBuilder.group(
        {
          email: [
            params['email'] || null,
            [Validators.required, Validators.pattern(AppConfig.emailRegex)]
          ],
          password: [null, [Validators.required, Validators.minLength(this.passwordLength)]],
          passwordConfirmation: [null, [Validators.required]],
          token: [this.validationToken, Validators.required]
        },
        {
          validator: equalsValidator('password', 'passwordConfirmation')
        }
      );
    });
  }

  setFormSubmitted(value) {
    this.formSubmitted = value;
  }

  resetPassword(model: PasswordResetModel) {
    this.resetPasswordSubmitted = true;

    if (!this.resetPasswordForm.valid) {
      return;
    }

    this.setFormSubmitted(true);
    this.authService.resetPassword(model).subscribe(
      succeed => {
        this.setFormSubmitted(false);
        this.modal
          .create(this.locale.successModalTitle, this.locale.successModalMessage)
          .then(result => {
            this.router.navigate(['/login']);
          });
      },
      (err: PasswordResetResponse) => {
        this.setFormSubmitted(false);
        if (err.returnCode.errorCode == '10201') {
          this.resetPasswordService.setPasswordTokenError(true); // Sharing data as a service
          this.router.navigate(['/forgotten-login']);
        } else {
          this.modal.create(this.locale.errorModalTitle, err.returnCode.message);
        }
      }
    );
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
    this.passwordType = this.showPassword ? 'text' : 'password';
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
    this.confirmPasswordType = this.showConfirmPassword ? 'text' : 'password';
  }

  validate() {
    if (
      this.resetPasswordForm.controls['passwordConfirmation'].value ==
      this.resetPasswordForm.controls['password'].value
    ) {
      let error = { unequalValues: false };
      this.resetPasswordForm.controls['passwordConfirmation'].setErrors(error);
      this.resetPasswordForm.controls['passwordConfirmation'].updateValueAndValidity();
    }
  }
}
