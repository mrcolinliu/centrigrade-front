import { QuestionnaireService } from './../../../services/questionnaire.service';
import { Router } from '@angular/router';
import { RouteBreadcrumbs } from './../../../services/routeBreadcrumbs.service';
import { Footer } from './../../../services/footer.service';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { Breadcrumb } from './../../../models/_base/breadcrumb.model';
import { Subject, Subscription } from 'rxjs';
import { LocalisationService } from '../../../services/localisation.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  public static route: string = 'centigrade';

  locale: any = {};
  menuOpen: boolean = false;
  showFooter: boolean = true;
  breadcrumbs: Breadcrumb[];
  disableBackButton: boolean;
  title: string;
  action: (() => void) | string;
  actionIsPath: boolean = false;
  hasCheckbox: boolean = false;
  checked: boolean = false;
  helpText: string = null;

  private breadcrumbSubscription: Subscription;
  private footerSubscription: Subscription;
  private disableBackButtonSubscription: Subscription;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private routeBreadcrumbs: RouteBreadcrumbs,
    private footerService: Footer,
    private router: Router,
    private questionnaireService: QuestionnaireService,
    private localisation: LocalisationService
  ) {}

  ngOnInit() {
    this.locale = this.localisation.getTranslationsForComponent('MainNavComponent');
    this.breadcrumbSubscription = this.routeBreadcrumbs.breadcrumbs.subscribe(breadcrumbs => {
      this.breadcrumbs = breadcrumbs;
      this.changeDetectorRef.detectChanges();
    });

    this.disableBackButtonSubscription = this.routeBreadcrumbs.disableBackButton.subscribe(
      disable => {
        this.disableBackButton = disable;
        this.changeDetectorRef.detectChanges();
      }
    );

    this.footerSubscription = this.footerService.onUpdated.subscribe(options => {
      if (!options) options = { title: null, action: null, checkbox: false };

      this.title = options.title;
      this.action = options.action;
      this.hasCheckbox = options.checkbox;
      this.helpText = options.helpText;

      if (this.hasCheckbox) {
        this.checked = options.checked;
      }

      if (typeof options.action == 'string') {
        this.actionIsPath = true;
      } else {
        this.actionIsPath = false;
      }

      this.showFooter = !!this.title || (!!this.action && !this.hasCheckbox);

      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.breadcrumbSubscription) this.breadcrumbSubscription.unsubscribe();

    if (this.disableBackButtonSubscription) this.disableBackButtonSubscription.unsubscribe();

    if (this.footerSubscription) this.footerSubscription.unsubscribe();
  }

  actionClicked() {
    this.footerService.onActionClicked.next();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  goToHome() {
    this.questionnaireService.getCurrentQuestionnaire().subscribe(res => {
      if (res.completed) this.router.navigateByUrl('/centigrade/course-areas');
      else this.router.navigateByUrl('/centigrade/questions');
    });
  }
}
