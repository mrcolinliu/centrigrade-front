import { AccountSettingsComponent } from './components/account/settings/account-settings.component';
import { ActivationComponent } from './components/account/activation/activation.component';
import { AuthGuardService } from './services/guards/auth-guard.service';
import { CourseAreaIntroComponent } from './components/course-areas/intro/course-area-intro.component';
import { CourseAreaApplyFiltersComponent } from './components/course-areas/filters/course-area-apply-filters/course-area-apply-filters.component';
import { CourseAreaBudgetFilterComponent } from './components/course-areas/filters/course-area-budget-filter/course-area-budget-filter.component';
import { CourseAreaDetailComponent } from './components/course-areas/detail/course-area-detail/course-area-detail.component';
import { CourseAreaLanguagesFilterComponent } from './components/course-areas/filters/course-area-languages-filter/course-area-languages-filter.component';
import { CourseAreaListComponent } from './components/course-areas/list/course-area-list/course-area-list.component';
import { CourseAreaLocationFilterComponent } from './components/course-areas/filters/course-area-location-filter/course-area-location-filter.component';
import { CourseAreaPointsFilterComponent } from './components/course-areas/filters/course-area-points-filter/course-area-points-filter.component';
import { CourseAreaCoursesFilterComponent } from './components/course-areas/filters/course-area-courses-filter/course-area-courses-filter.component';
import { CourseDetailComponent } from './components/courses/detail/course-detail/course-detail.component';
import { CourseFiltersComponent } from './components/courses/filters/course-filters/course-filters.component';
import { CourseListComponent } from './components/courses/list/course-list.component';
import { CourseIntroComponent } from './components/courses/intro/course-intro.component';
import { CourseShortlistComponent } from './components/courses/shortlist/course-shortlist.component';
import { ErrorComponent } from './components/_shared/error/error.component';
import { ForgottenLoginComponent } from './components/account/forgotten-login/forgotten-login.component';
import { ResendActivationComponent } from './components/account/resend-activation/resend-activation.component';
import { LoginComponent } from './components/account/login/login.component';
import { MainLayoutComponent } from './components/_shared/main-layout/main-layout.component';
import { NgModule } from '@angular/core';
import { QuestionnaireCompleteComponent } from './components/questionnaire/questionnaire-complete/questionnaire-complete.component';
import { QuestionnaireComponent } from './components/questionnaire/questionnaire/questionnaire.component';
import { RegisterCompleteComponent } from './components/account/register-complete/register-complete.component';
import { RegisterComponent } from './components/account/register/register.component';
import { ResetPasswordComponent } from './components/account/reset-password/reset-password.component';
import { ReviewQuestionsComponent } from './components/questionnaire/review-questions/review-questions.component';
import { RouterModule, Routes } from '@angular/router';
import { UniversityDetailComponent } from './components/courses/detail/university-detail/university-detail.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { CompareCoursesComponent } from './components/courses/compare/compare-courses.component';
import { ExportComponent } from './components/finalise/export/export.component';
import { FinaliseListComponent } from './components/finalise/list/finalise-list.component';
import { ResearchIntroComponent } from './components/research/intro/research-intro.component';
import { ResearchCourseComponent } from './components/research/course/research-course.component';
import { ResearchUniversityComponent } from './components/research/university/research-university.component';
import { ResearchEditComponent } from './components/research/edit/research-edit.component';
import { ResearchSummaryComponent } from './components/research/summary/research-summary.component';
import { CanActivateResearchService } from './services/guards/can-activate-research.service';
import { CanDeactivateGuard } from './services/guards/can-deactivate-guard.service';
import { RequestPaymentComponent } from './components/account/request-payment/request-payment.component';
import { PrivacyPolicyComponent } from './components/legal/privacy-policy/privacy-policy.component';
import { HelpComponent } from './components/help/help/help.component';

const routes: Routes = [
  { path: ErrorComponent.route, component: ErrorComponent },
  { path: RegisterCompleteComponent.route, component: RegisterCompleteComponent },
  { path: ActivationComponent.route, component: ActivationComponent },
  { path: ForgottenLoginComponent.route, component: ForgottenLoginComponent },
  { path: ResendActivationComponent.route, component: ResendActivationComponent },
  { path: LoginComponent.route, component: LoginComponent, canActivate: [AuthGuardService] },
  { path: ResetPasswordComponent.route, component: ResetPasswordComponent },
  { path: RegisterComponent.route, component: RegisterComponent, canActivate: [AuthGuardService] },
  {
    path: ReviewQuestionsComponent.route,
    component: ReviewQuestionsComponent,
    canActivate: [AuthGuardService],
    pathMatch: 'full'
  },
  { path: WelcomeComponent.route, component: WelcomeComponent, canActivate: [AuthGuardService] },
  {
    path: AccountSettingsComponent.route,
    component: AccountSettingsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: RequestPaymentComponent.route,
    component: RequestPaymentComponent,
    canActivate: [AuthGuardService]
  },
  { path: PrivacyPolicyComponent.route, component: PrivacyPolicyComponent },
  { path: HelpComponent.route, component: HelpComponent },
  {
    path: MainLayoutComponent.route,
    component: MainLayoutComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: QuestionnaireComponent.route, component: QuestionnaireComponent },
      { path: QuestionnaireCompleteComponent.route, component: QuestionnaireCompleteComponent },
      { path: CourseAreaIntroComponent.route, component: CourseAreaIntroComponent },
      {
        path: CourseAreaListComponent.route,
        component: CourseAreaListComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      { path: CourseAreaDetailComponent.route, component: CourseAreaDetailComponent },
      { path: CourseAreaApplyFiltersComponent.route, component: CourseAreaApplyFiltersComponent },
      { path: CourseAreaBudgetFilterComponent.route, component: CourseAreaBudgetFilterComponent },
      {
        path: CourseAreaLanguagesFilterComponent.route,
        component: CourseAreaLanguagesFilterComponent
      },
      { path: CourseAreaPointsFilterComponent.route, component: CourseAreaPointsFilterComponent },
      {
        path: CourseAreaLocationFilterComponent.route,
        component: CourseAreaLocationFilterComponent
      },
      { path: CourseAreaCoursesFilterComponent.route, component: CourseAreaCoursesFilterComponent },
      { path: UniversityDetailComponent.route, component: UniversityDetailComponent },
      { path: CourseDetailComponent.route, component: CourseDetailComponent },
      { path: CourseListComponent.route, component: CourseListComponent },
      { path: CourseIntroComponent.route, component: CourseIntroComponent },
      { path: CourseFiltersComponent.route, component: CourseFiltersComponent },
      { path: CourseShortlistComponent.route, component: CourseShortlistComponent },
      { path: UniversityDetailComponent.shortlistRoute, component: UniversityDetailComponent },
      { path: CourseDetailComponent.shortlistRoute, component: CourseDetailComponent },
      { path: CompareCoursesComponent.route, component: CompareCoursesComponent },
      {
        path: ResearchIntroComponent.route,
        component: ResearchIntroComponent,
        canActivate: [CanActivateResearchService]
      },
      { path: ResearchCourseComponent.route, component: ResearchCourseComponent },
      { path: ResearchUniversityComponent.route, component: ResearchUniversityComponent },
      { path: ResearchEditComponent.route, component: ResearchEditComponent },
      { path: ResearchSummaryComponent.route, component: ResearchSummaryComponent },
      { path: FinaliseListComponent.route, component: FinaliseListComponent },
      { path: ExportComponent.route, component: ExportComponent },
      { path: '**', redirectTo: QuestionnaireComponent.route, pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: LoginComponent.route, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
