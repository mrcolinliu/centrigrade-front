import { ErrorComponent } from './components/_shared/error/error.component';
import { ApiReponse, ApiReturnCode } from './models/_base/apiResponse.model';
import { ModalProvider } from './components/_shared/modal/modal.component';
import { LocalisationService } from './services/localisation.service';
import { MainLayoutComponent } from './components/_shared/main-layout/main-layout.component';
import { HttpInterceptor } from './utils/httpInterceptor.service';
import { LoginComponent } from './components/account/login/login.component';
import { Router, NavigationEnd, RouterEvent } from '@angular/router';
import { Component, ViewContainerRef, OnInit, HostListener } from '@angular/core';
import { WindowUtils } from './utils/windowUtils';
import { AppConfig } from './app.config';
import { QuestionnaireService } from './services/questionnaire.service';
import { UserService } from './services/user.service';
import { CurrentQuestionnaireService } from './services/current-questionnaire.service';
import { AuthService } from './services/auth.service';
import { ErrorService, Error } from './services/error.service';
import { GoogleAnalyticsEventsService } from './services/google-analytics-events.service';

@Component({
  selector: 'body',
  host: { '[class.gradient]': 'gradient', '[class.main]': '!gradient' },
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  gradient: boolean;

  constructor(
    private router: Router,
    private http: HttpInterceptor,
    private modal: ModalProvider,
    private localisation: LocalisationService,
    private questionnaireService: QuestionnaireService,
    private currentQuestionnaire: CurrentQuestionnaireService,
    private userService: UserService,
    private authService: AuthService,
    private errorService: ErrorService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService
  ) {
    http.initialise(this);
    WindowUtils.initialise();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        //send notification to google analytics
        if (this.authService.isAuthenticated()) {
          this.userService.getUser().subscribe(user => {
            ga('set', 'userId', user.userId);
            ga('set', 'batchType', user.batchType);
            ga('set', 'productId', user.productId);
            ga('set', 'page', event.urlAfterRedirects);
            ga('send', 'pageview');
          });
        } else {
          ga('set', 'page', event.urlAfterRedirects);
          ga('send', 'pageview');
        }
      }
    });
  }

  ngOnInit() {
    console.log(
      '%c Centigrade version:' + '%c ' + AppConfig.version,
      'color: #76cbcc;',
      'color: #23898b;'
    );

    if (!document.cookie.includes('state=1')) {
      this.authService.logout(false); // disable the logout message
    }

    this.router.events.subscribe(val => {
      if (val instanceof RouterEvent) {
        // test
        this.gradient = (val as RouterEvent).url.indexOf(`/${MainLayoutComponent.route}`) === -1;
      }
      if (val instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }

  redirectToRoute(route: string) {
    this.router.navigate([route]);
  }

  showErrorModal(err: ApiReponse) {
    if (this.filterError(err)) {
      this.modal.create(
        this.getErrorTitle(err.returnCode),
        this.getErrorMessage(err.returnCode),
        this.getErrorTemplate(err.returnCode.label)
      );
    }
  }

  private getErrorMessage(returnCode: ApiReturnCode): string {
    switch (returnCode.label) {
      case 'E_EMAIL_TAKEN':
        return `This email is already registered with an account.`;
      default:
        return returnCode.message;
    }
  }

  private getErrorTitle(returnCode: ApiReturnCode): string {
    switch (returnCode.label) {
      case 'E_EMAIL_TAKEN':
        return `Hello Again`;
      default:
        return returnCode.type;
    }
  }

  private filterError(err: ApiReponse): boolean {
    switch (err.returnCode.label) {
      case 'E_NO_TOKEN_PROVIDED':
      case 'E_TOKEN_EXPIRED':
      case 'E_TOKEN_INVALID':
      case 'E_USER_NOT_FOUND':
        this.router.navigateByUrl('/login');
        return false;
      case 'E_NO_AREAS_SELECTED':
        sessionStorage.setItem('areas-incomplete', '1');
        this.router.navigateByUrl('/centigrade/course-areas');
        return false;
      case 'E_FILTER_INCOMPLETE':
        sessionStorage.setItem('filter-incomplete', '1');
        this.router.navigateByUrl('/centigrade/course-area-filters');
        return false;
      case 'E_PAUSED_ACCESS':
        this.errorService.updateError({
          code: err.returnCode.label,
          title: 'Paused Access',
          message:
            'Your school or adviser has restricted access to this part of the app until a later date.'
        } as Error);
        this.router.navigateByUrl('/error');
        return false;
      case 'E_MAINTENANCE_MODE':
        this.errorService.updateError({
          code: err.returnCode.label,
          title: "We're in Maintenance Mode",
          message:
            "We're making some exciting new updates to our site. We'll be back online shortly!"
        } as Error);
        this.router.navigateByUrl('/error');
        return false;
      default:
    }

    return true;
  }

  private getErrorTemplate(errorLabel: string): string {
    switch (errorLabel) {
      case 'E_COURSE_ID_INVALID':
        return `<a onclick="window.history.back()">Back</a>`;
      case 'E_FILTER_INCOMPLETE':
        return `<a routerLink="/centigrade/course-area-filters">Complete preferences</a>`;
      case 'E_NO_AREAS_SELECTED':
        return `<a routerLink="/centigrade/course-areas">Select course areas</a>`;
      case 'E_USER_NOT_ACTIVE':
        return `<a routerLink="/resend-activation">I didn't receive my activation email</a>`;
      default:
        return null;
    }
  }
}
