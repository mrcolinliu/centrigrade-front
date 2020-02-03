import { Component, OnInit } from '@angular/core';
import { ForgottenPasswordModel } from './../../../models/auth/forgottenPassword.model';
import { ForgottenPasswordResponse } from './../../../models/auth/forgottenPasswordResponse.model';
import { ResetPasswordComponent } from './../reset-password/reset-password.component';
import { AuthService } from './../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalProvider } from '../../_shared/modal/modal.component';
import { LocalisationService } from '../../../services/localisation.service';
import { Router } from '@angular/router';
import { ParseFormattedTextPipe } from '../../../pipes/_shared/parse-formatted-text.pipe';
import { AppConfig } from 'app/app.config';
import { ResetPasswordService } from '../../../services/reset-password.service';

@Component({
  selector: 'app-forgotten-login',
  templateUrl: './forgotten-login.component.html',
  styleUrls: ['./forgotten-login.component.scss']
})
export class ForgottenLoginComponent implements OnInit {
  static route: string = 'forgotten-login';

  forgottenPasswordForm: FormGroup;
  forgottenPasswordSubmitted: boolean = false;

  locale: any = {};

  public messageCopy: string;
  public formSubmitted: boolean = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    public modal: ModalProvider,
    public localisation: LocalisationService,
    private resetPasswordService: ResetPasswordService,
    public router: Router,
    private parseFormattedTextPipe: ParseFormattedTextPipe
  ) {}

  ngOnInit() {
    this.locale = this.localisation.getTranslationsForComponent('ForgottenLoginComponent');

    this.forgottenPasswordForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(AppConfig.emailRegex)]],
      url: [
        `${window.location.origin}/#/${ResetPasswordComponent.route}${
          ResetPasswordComponent.routeParams
        }`,
        Validators.required
      ]
    });
    if (this.resetPasswordService.getPasswordTokenError() == true) {
      this.resetPasswordService.setPasswordTokenError(false);
      this.messageCopy = this.locale.passwordTokenError;
    }
  }

  setFormSubmitted(value) {
    this.formSubmitted = value;
  }

  onClickInput() {
    this.messageCopy = null;
  }

  forgottenPassword(model: ForgottenPasswordModel) {
    this.forgottenPasswordSubmitted = true;

    if (!this.forgottenPasswordForm.valid) {
      return;
    }
    this.setFormSubmitted(true);
    this.authService.forgottenPassword(model).subscribe(
      succeeded => {
        this.setFormSubmitted(false);
        this.modal.create(
          this.locale.confirmationModalTitle,
          this.locale.confirmationModalMessage,
          null,
          null,
          null
        );
      },
      (err: ForgottenPasswordResponse) => {
        this.setFormSubmitted(false);
        this.modal.create(
          this.locale.confirmationModalTitle,
          this.parseFormattedTextPipe.transform(this.locale.confirmationModalMessage),
          null,
          null,
          null
        );
      }
    );
  }

  navigateLogin() {
    this.router.navigate(['/login']);
  }
}
