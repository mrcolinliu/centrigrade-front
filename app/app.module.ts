import { AccountSettingsComponent } from './components/account/settings/account-settings.component';
import { ActivationComponent } from './components/account/activation/activation.component';
import { AgmCoreModule } from '@agm/core';
import { APP_INITIALIZER, NgModule, ErrorHandler } from '@angular/core';
import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { AppRoutingModule } from './app-routing.module';
import { AreasOfInterestComponent } from './components/courses/interest/areas-of-interest/areas-of-interest.component';
import { AuthGuardService } from './services/guards/auth-guard.service';
import { CanDeactivateGuard } from './services/guards/can-deactivate-guard.service';
import { AuthService } from './services/auth.service';
import { BreadcrumbComponent } from './components/_shared/breadcrumb/breadcrumb.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CanActivateResearchService } from './services/guards/can-activate-research.service';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { CompareCoursesComponent } from './components/courses/compare/compare-courses.component';
import { CourseAreaApplyFiltersComponent } from './components/course-areas/filters/course-area-apply-filters/course-area-apply-filters.component';
import { CourseAreaBudgetFilterComponent } from './components/course-areas/filters/course-area-budget-filter/course-area-budget-filter.component';
import { CourseAreaIntroComponent } from './components/course-areas/intro/course-area-intro.component';
import { CourseAreaDetailComponent } from './components/course-areas/detail/course-area-detail/course-area-detail.component';
import { CourseAreaFilterPipe } from './components/course-areas/pipes/course-area.pipe';
import { CourseAreaLanguagesFilterComponent } from './components/course-areas/filters/course-area-languages-filter/course-area-languages-filter.component';
import { CourseAreaListComponent } from './components/course-areas/list/course-area-list/course-area-list.component';
import { CourseAreaLocationFilterComponent } from './components/course-areas/filters/course-area-location-filter/course-area-location-filter.component';
import { CourseAreaPointsFilterComponent } from './components/course-areas/filters/course-area-points-filter/course-area-points-filter.component';
import { CourseAreaCoursesFilterComponent } from './components/course-areas/filters/course-area-courses-filter/course-area-courses-filter.component';
import { CourseAreaSubCategoryComponent } from './components/course-areas/detail/course-area-sub-category/course-area-sub-category.component';
import { CourseDetailComponent } from './components/courses/detail/course-detail/course-detail.component';
import { CourseFiltersComponent } from './components/courses/filters/course-filters/course-filters.component';
import { CourseListComponent } from './components/courses/list/course-list.component';
import { CourseIntroComponent } from './components/courses/intro/course-intro.component';
import { CourseListFilterPipe } from './pipes/courses/course-list-filter.pipe';
import { CourseService } from './services/course.service';
import { CourseShortlistComponent } from './components/courses/shortlist/course-shortlist.component';
import { CurrentQuestionnaireService } from './services/current-questionnaire.service';
import { DoughnutChartComponent } from './components/_shared/doughnut-chart/doughnut-chart.component';
import { DropdownComponent } from './components/_shared/dropdown/dropdown.component';
import { EqualsValidatorDirective } from './directives/equals-validator.directive';
import { ErrorComponent } from './components/_shared/error/error.component';
import { ExportComponent } from './components/finalise/export/export.component';
import { FilterValuesPipe } from './components/course-areas/pipes/filter-values.pipe';
import { FinaliseListComponent } from './components/finalise/list/finalise-list.component';
import { Footer } from './services/footer.service';
import { ForgottenLoginComponent } from './components/account/forgotten-login/forgotten-login.component';
import { ResendActivationComponent } from './components/account/resend-activation/resend-activation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FreeTextComponent } from './components/questionnaire/questions/free-text/free-text.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpInterceptor } from './utils/httpInterceptor.service';
import { HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import {
  LoadingProvider,
  LoadingSpinnerComponent
} from './components/_shared/loading-spinner/loading-spinner.component';
import { LocaleDirective } from './directives/locale.directive';
import { localisationFactory, LocalisationService } from './services/localisation.service';
import { LoginComponent } from './components/account/login/login.component';
import { MainLayoutComponent } from './components/_shared/main-layout/main-layout.component';
import { MainNavComponent } from './components/_shared/main-nav/main-nav.component';
import { ModalComponent, ModalProvider } from './components/_shared/modal/modal.component';
import { MultiChoiceComponent } from './components/questionnaire/questions/multi-choice/multi-choice.component';
import { MultiSelectComponent } from './components/questionnaire/questions/multi-select/multi-select.component';
import { NotesComponent } from './components/courses/notes/notes.component';
import { OptionsPipe } from './components/questionnaire/pipes/options.pipe';
import { ParseFormattedTextPipe } from './pipes/_shared/parse-formatted-text.pipe';
import { OrderByPipe } from './pipes/_shared/order-by.pipe';
import { PasswordValidatorDirective } from './directives/password-validator.directive';
import { ProceedWarningComponent } from './components/course-areas/list/proceed-warning/proceed-warning.component';
import { QuestionnaireCompleteComponent } from './components/questionnaire/questionnaire-complete/questionnaire-complete.component';
import { QuestionnaireComponent } from './components/questionnaire/questionnaire/questionnaire.component';
import { QuestionnaireService } from './services/questionnaire.service';
import { RatingBarComponent } from './components/_shared/rating-bar/rating-bar.component';
import { RegisterCompleteComponent } from './components/account/register-complete/register-complete.component';
import { RegisterComponent } from './components/account/register/register.component';
import { RequestPaymentComponent } from './components/account/request-payment/request-payment.component';
import { ResearchCourseComponent } from './components/research/course/research-course.component';
import { ResearchIntroComponent } from './components/research/intro/research-intro.component';
import { ResearchService } from './services/research.service';
import { ResearchEditComponent } from './components/research/edit/research-edit.component';
import { ResearchSummaryComponent } from './components/research/summary/research-summary.component';
import { ResearchUniversityComponent } from './components/research/university/research-university.component';
import { ResetPasswordComponent } from './components/account/reset-password/reset-password.component';
import { ReviewQuestionsComponent } from './components/questionnaire/review-questions/review-questions.component';
import { RoundButtonComponent } from './components/_shared/buttons/round-button/round-button.component';
import { RouteBreadcrumbs } from './services/routeBreadcrumbs.service';
import { RowColumnSorter } from './services/row-column-sorter.service';
import { SearchPipe } from './pipes/_shared/search.pipe';
import { StarRatingComponent } from './components/_shared/star-rating/star-rating.component';
import { StatementComponent } from './components/questionnaire/questions/statement/statement.component';
import { StringFormatPipe } from './pipes/_shared/string-format.pipe';
import { TickButtonComponent } from './components/_shared/buttons/tick-button/tick-button.component';
import { UniversityDetailComponent } from './components/courses/detail/university-detail/university-detail.component';
import { UserService } from './services/user.service';
import { VerticalProgressIndicatorComponent } from './components/_shared/vertical-progress-indicator/vertical-progress-indicator.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { PrivacyPolicyComponent } from './components/legal/privacy-policy/privacy-policy.component';
import { HelpComponent } from './components/help/help/help.component';
import { NavigationService } from './services/navigation.service';
import { ErrorService } from './services/error.service';
import { GoogleAnalyticsEventsService } from './../app/services/google-analytics-events.service';
import { OfflineQuestionnaireService } from './../app/services/offline-questionnaire.service';
import * as Raven from 'raven-js';
import { Collapse } from './../app/directives/collapse.directive';
import { HelpService } from './../app/services/help.service';
import { ResetPasswordService } from './services/reset-password.service';
import { Globals } from './../globals';

Raven.config('https://' + AppConfig.sentryKey + '@sentry.coa.co.uk/' + AppConfig.sentryProject, {
  release: AppConfig.version
}).install();

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    Raven.captureException(err.originalError || err);
  }
}

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    ChartsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCLALVlgu9zssNh-kygOLv4I2HIZlWSjy0'
    }),
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: localisationFactory,
      deps: [LocalisationService],
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: RavenErrorHandler
    },
    HttpInterceptor,
    // { provide: HttpInterceptor, useFactory: (backend: XHRBackend, options: RequestOptions) => { return new HttpInterceptor(backend, options)}, deps: [XHRBackend, RequestOptions]},
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    AuthService,
    AuthGuardService,
    CanDeactivateGuard,
    CourseService,
    QuestionnaireService,
    UserService,
    ResearchService,
    CurrentQuestionnaireService,
    NavigationService,
    ErrorService,
    ModalProvider,
    LoadingProvider,
    RouteBreadcrumbs,
    Footer,
    LocalisationService,
    RowColumnSorter,
    CanActivateResearchService,
    ParseFormattedTextPipe,
    GoogleAnalyticsEventsService,
    OfflineQuestionnaireService,
    HelpService,
    OrderByPipe,
    ResetPasswordService,
    Globals
  ],
  declarations: [
    AppComponent,
    ErrorComponent,
    LoginComponent,
    RegisterComponent,
    WelcomeComponent,
    ModalComponent,
    RegisterCompleteComponent,
    MainNavComponent,
    MainLayoutComponent,
    QuestionnaireComponent,
    MultiChoiceComponent,
    FreeTextComponent,
    MultiSelectComponent,
    QuestionnaireCompleteComponent,
    StatementComponent,
    CourseAreaListComponent,
    ProceedWarningComponent,
    CourseAreaDetailComponent,
    CourseAreaIntroComponent,
    CourseAreaSubCategoryComponent,
    CourseAreaApplyFiltersComponent,
    CourseAreaLocationFilterComponent,
    CourseAreaCoursesFilterComponent,
    CourseAreaBudgetFilterComponent,
    CourseAreaLanguagesFilterComponent,
    CourseAreaPointsFilterComponent,
    CourseListComponent,
    CourseIntroComponent,
    CourseShortlistComponent,
    AreasOfInterestComponent,
    CourseDetailComponent,
    UniversityDetailComponent,
    NotesComponent,
    OptionsPipe,
    StarRatingComponent,
    CourseAreaFilterPipe,
    ActivationComponent,
    ForgottenLoginComponent,
    ResendActivationComponent,
    ResetPasswordComponent,
    PasswordValidatorDirective,
    LoadingSpinnerComponent,
    VerticalProgressIndicatorComponent,
    ReviewQuestionsComponent,
    EqualsValidatorDirective,
    BreadcrumbComponent,
    ParseFormattedTextPipe,
    OrderByPipe,
    FilterValuesPipe,
    CourseListFilterPipe,
    DropdownComponent,
    CourseFiltersComponent,
    DoughnutChartComponent,
    RoundButtonComponent,
    TickButtonComponent,
    AccountSettingsComponent,
    RatingBarComponent,
    CompareCoursesComponent,
    ExportComponent,
    FinaliseListComponent,
    LocaleDirective,
    StringFormatPipe,
    ResearchIntroComponent,
    ResearchUniversityComponent,
    ResearchCourseComponent,
    ResearchEditComponent,
    ResearchSummaryComponent,
    SearchPipe,
    RequestPaymentComponent,
    PrivacyPolicyComponent,
    HelpComponent,
    Collapse
  ],
  entryComponents: [ModalComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
