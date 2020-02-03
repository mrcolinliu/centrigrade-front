import { Component, OnInit } from '@angular/core';
import { ResendActivationModel } from './../../../models/auth/resendActivation.model';
import { ResendActivationResponse } from './../../../models/auth/resendActivationResponse.model';
import { ActivationComponent } from './../activation/activation.component';
import { AuthService } from './../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalProvider } from '../../_shared/modal/modal.component';
import { LocalisationService } from '../../../services/localisation.service';
import { AppConfig } from 'app/app.config';

@Component({
  selector: 'app-resend-activation',
  templateUrl: './resend-activation.component.html',
  styleUrls: ['./resend-activation.component.scss']
})
export class ResendActivationComponent implements OnInit {
  static route: string = 'resend-activation';

  resendActivationForm: FormGroup;
  forgottenPasswordSubmitted: boolean = false;

  locale: any = {};
  public formSubmitted: boolean = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    public modal: ModalProvider,
    public localisation: LocalisationService
  ) {}

  ngOnInit() {
    this.locale = this.localisation.getTranslationsForComponent('ResendActivationComponent');

    this.resendActivationForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(AppConfig.emailRegex)]],
      url: [
        `${window.location.origin}/#/${ActivationComponent.route}${
          ActivationComponent.routeParams
        }`,
        Validators.required
      ]
    });
  }

  setFormSubmitted(value) {
    this.formSubmitted = value;
  }

  resendActivation(model: ResendActivationModel) {
    this.forgottenPasswordSubmitted = true;

    if (!this.resendActivationForm.valid) {
      return;
    }
    this.setFormSubmitted(true);
    this.authService.resendActivation(model).subscribe(
      succeeded => {
        this.setFormSubmitted(false);
        this.modal.create(this.locale.confirmationModalTitle, this.locale.confirmationModalMessage);
      },
      (err: ResendActivationResponse) => {
        this.setFormSubmitted(false);
        this.modal.create(this.locale.confirmationModalTitle, this.locale.confirmationModalMessage);
      }
    );
  }
}
