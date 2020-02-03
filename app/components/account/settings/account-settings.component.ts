import { Component, OnInit } from '@angular/core';
import { LocalisationService } from '../../../services/localisation.service';
import { UserService } from '../../../services/user.service';
import { CountryModel } from '../../../models/user/country.model';
import { FormBuilder, FormGroup, Validators, Validator } from '@angular/forms';
import { AppConfig } from '../../../app.config';
import { UserModel } from '../../../models/user/user.model';
import { DisplayLanguageModel } from '../../../models/user/language.model';
import { GenderModel } from './../../../models/user/gender.model';
import { ModalProvider } from '../../_shared/modal/modal.component';
import { equalsValidator } from '../../../directives/equals-validator.directive';
import { AuthService } from '../../../services/auth.service';
import { PasswordResetModel } from '../../../models/auth/passwordReset.model';
import { LoadingProvider } from '../../_shared/loading-spinner/loading-spinner.component';
import { Globals } from './../../../../globals';
import * as _ from 'lodash';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit {
  static route = 'account/settings';

  locale: any = {};

  profileForm: FormGroup = new FormGroup({});
  profileFormSubmitted: boolean = false;

  passwordForm: FormGroup = new FormGroup({});
  passwordFormSubmitted: boolean = false;
  passwordLength: number;

  countryOptions: CountryModel[] = [];
  genderOptions: GenderModel[];
  displayLanguageOptions: DisplayLanguageModel[] = [];

  messageCopyProfile: string;
  messageCopyPassword: string;
  messageClassProfile: string;
  messageClassPassword: string;

  public formSubmitted: boolean = false;

  constructor(
    private globals: Globals,
    private formBuilder: FormBuilder,
    private localisation: LocalisationService,
    private userService: UserService,
    private authService: AuthService,
    private modal: ModalProvider,
    private loading: LoadingProvider
  ) {}

  ngOnInit() {
    this.loading.show(null, true);
    this.locale = this.localisation.getTranslationsForComponent('AccountSettingsComponent');
    this.passwordLength = AppConfig.passwordLength;

    if (sessionStorage.getItem('completed') === 'true') {
      sessionStorage.removeItem('completed');
      location.reload();
    }

    this.userService
      .getCountries()
      .subscribe(
        countries =>
          (this.countryOptions = _.orderBy(countries, ['priority', 'countryName'], 'asc'))
      );

    this.userService.getGenders().subscribe(genders => (this.genderOptions = genders));
    this.userService
      .getDisplayLanguages()
      .subscribe(languages => (this.displayLanguageOptions = languages));

    this.profileForm = this.formBuilder.group({
      firstName: [null, Validators.required],
      secondName: [null, Validators.required],
      email: [null, [Validators.required, Validators.pattern(AppConfig.emailRegex)]],
      gender: [null, Validators.required],
      school: [null],
      displayLanguage: [null, Validators.required],
      emailPreference: [true, Validators.required],
      country: [null, [Validators.required]]
    });

    this.passwordForm = this.formBuilder.group(
      {
        currentPassword: [null, [Validators.required]],
        newPassword: [null, [Validators.required, Validators.minLength(this.passwordLength)]],
        confirmPassword: [null, [Validators.required, Validators.minLength(this.passwordLength)]]
      },
      {
        validator: equalsValidator('newPassword', 'confirmPassword')
      }
    );

    this.userService.getUser().subscribe(user => {
      let formModel = new UserModel();
      formModel.firstName = user.firstName;
      formModel.secondName = user.secondName;
      formModel.email = user.email;
      formModel.gender = user.gender;
      formModel.country = user.country;
      formModel.school = user.school;
      formModel.displayLanguage = user.displayLanguage;
      formModel.emailPreference = user.emailPreference;

      this.profileForm.setValue(formModel);
      this.loading.hide();
    });
  }

  setFormSubmitted(value) {
    this.formSubmitted = value;
  }

  onClickProfileInput() {
    this.messageCopyProfile = null;
  }

  onClickPasswordInput() {
    this.messageCopyPassword = null;
  }

  goBack() {
    window.history.back();
  }

  submitProfileForm() {
    this.profileFormSubmitted = true;

    if (this.profileForm.valid) {
      let values = this.profileForm.value;
      this.setFormSubmitted(true);
      this.userService.updateUser(values).subscribe(result => {
        this.setFormSubmitted(false);
        this.messageClassProfile = this.globals.styles.alertBottomClass;
        this.messageCopyProfile = this.locale.profileSuccessModalMessage;
      });
    } else {
      this.messageClassProfile = this.globals.styles.errorClass;
      this.messageCopyProfile = this.locale.errorModalMessage;
      this.passwordFormSubmitted = false;
    }
  }

  submitPasswordForm() {
    this.passwordFormSubmitted = true;

    if (!this.passwordForm.valid) return;

    let form = this.passwordForm.value;
    let model = new UserModel();
    model.currentPassword = form.currentPassword;
    model.password = form.newPassword;

    this.setFormSubmitted(true);
    this.userService.updateUser(model).subscribe(
      result => {
        this.setFormSubmitted(false);
        this.messageClassPassword = this.globals.styles.alertBottomClass;
        this.messageCopyPassword = this.locale.passwordSuccessModalMessage;
        this.passwordFormSubmitted = false;
        this.passwordForm.reset();
      },
      err => {
        let errorDetails = err.json();
        this.setFormSubmitted(false);
        this.messageClassPassword = this.globals.styles.errorClass;

        // Popup now diabled, so check see to if httpinterceptor returns errors if NOT revert to default message
        if (errorDetails.returnCode.hasOwnProperty('errors')) {
          this.messageCopyPassword =
            errorDetails.returnCode.errors[Object.keys(errorDetails.returnCode.errors)[0]];
        } else if (errorDetails.returnCode.hasOwnProperty('message')) {
          this.messageCopyPassword = errorDetails.returnCode.message;
        } else {
          this.messageCopyPassword = this.locale.errorModalMessage;
        }

        this.passwordFormSubmitted = false;
        this.passwordForm.reset();
      }
    );
  }
}
