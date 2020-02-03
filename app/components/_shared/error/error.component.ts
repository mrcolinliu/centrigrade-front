import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ErrorService } from 'app/services/error.service';
import { LocalisationService } from 'app/services/localisation.service';
import { QuestionnaireService } from 'app/services/questionnaire.service';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  static route: string = 'error';

  locale: any = {};

  error: any;

  constructor(
    private router: Router,
    private questionnaireService: QuestionnaireService,
    private localisation: LocalisationService,
    private authService: AuthService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    this.locale = this.localisation.getTranslationsForComponent('ErrorComponent');
    this.error = this.errorService.error
      ? this.errorService.error
      : { code: 0, title: this.locale.genericErrorHeader, message: this.locale.genericErrorText };
    if (this.error.code == 0) {
      this.questionnaireService.getQuestionnaireStatus().subscribe(
        statusResponse => {
          var res = statusResponse;
        },
        error => {
          if (error.returnCode != null) {
            switch (error.returnCode.label) {
              case 'E_PAUSED_ACCESS':
                this.error = {
                  code: error.returnCode.label,
                  title: this.locale.pauseHeader,
                  message: this.locale.pauseText
                };
                return false;
              case 'E_MAINTENANCE_MODE':
                this.error = {
                  code: error.returnCode.label,
                  title: this.locale.maintenanceModeHeader,
                  message: this.locale.maintenanceModeText
                };
                return false;
            }
          }
        }
      );
    }
  }

  back() {
    this.errorService.clear();
    window.history.go(-2);
  }

  logout() {
    this.errorService.clear();
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
