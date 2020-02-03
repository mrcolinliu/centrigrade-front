import { Subject, Subscription } from 'rxjs';
import { QuestionnaireService } from './../../../services/questionnaire.service';
import { CourseService } from './../../../services/course.service';
import { LoginComponent } from './../../account/login/login.component';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit, Input, Output, OnDestroy, ViewEncapsulation } from '@angular/core';
import { LocalisationService } from '../../../services/localisation.service';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainNavComponent implements OnInit, OnDestroy {
  locale: any = {};
  questionnaireComplete: boolean = false;
  courseAreasComplete: boolean = false;
  courseAreasSeen: boolean = false;
  preferencesComplete: boolean = false;
  coursesComplete: boolean = false;
  researchComplete: boolean = false;

  filtersComplete: boolean = false;
  routerEventSubscription: Subscription;
  navigationSubscription: Subscription;
  statusSubscription: Subscription;
  statusOverrideSubscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private questionnaireService: QuestionnaireService,
    private courseService: CourseService,
    private localisation: LocalisationService,
    private navigationService: NavigationService
  ) {}

  ngOnInit() {
    this.locale = this.localisation.getTranslationsForComponent('MainNavComponent');
    this.routerEventSubscription = this.router.events
      .filter(event => event instanceof NavigationStart)
      .subscribe((event: NavigationStart) => {
        this.getStatus();
      });

    this.getStatus();
    this.courseAreasSeen = sessionStorage.getItem('areas-seen') === 'true';

    this.filtersComplete = this.navigationService.defaultFiltersComplete;
    this.navigationSubscription = this.navigationService.filtersComplete.subscribe(value => {
      this.filtersComplete = value;
    });

    this.statusOverrideSubscription = this.questionnaireService.statusOverride.subscribe(status => {
      if (status !== null) {
        this.enableDisableItems(status);
      } else {
        this.getStatus();
      }
    });
  }

  ngOnDestroy(): void {
    this.routerEventSubscription.unsubscribe();
    this.navigationSubscription.unsubscribe();
    this.statusSubscription.unsubscribe();
    this.statusOverrideSubscription.unsubscribe();
  }

  getStatus() {
    if (this.authService.isAuthenticated()) {
      this.statusSubscription = this.questionnaireService
        .getQuestionnaireStatus()
        .subscribe(statusResponse => {
          this.enableDisableItems(statusResponse.status);
        });
    }
  }

  enableDisableItems(status: number) {
    this.questionnaireComplete = status >= 100;
    this.courseAreasComplete = status >= 300;
    this.preferencesComplete = status >= 400;
    this.coursesComplete = status >= 500;
    this.researchComplete = status >= 600;
  }

  signOut() {
    this.authService.logout();
    this.router.navigate([`/${LoginComponent.route}`]);
  }

  goToResearch() {
    if (sessionStorage.getItem('seen-research-intro')) {
      this.router.navigateByUrl('/centigrade/research/summary');
    } else {
      this.router.navigateByUrl('/centigrade/research/intro');
    }
  }
}
