import { RowColumnSorter } from './../../../services/row-column-sorter.service';
import { Column, Row } from './../../../models/_shared/column.model';
import { Breadcrumb } from './../../../models/_base/breadcrumb.model';
import { CourseAreaListComponent } from './../list/course-area-list/course-area-list.component';
import { Footer } from './../../../services/footer.service';
import { Component, OnInit, Input } from '@angular/core';
import { CourseService } from './../../../services/course.service';
import { RouteBreadcrumbs } from './../../../services/routeBreadcrumbs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from './../../../services/user.service';
import { LocalisationService } from '../../../services/localisation.service';
import { CourseAreaTopItem } from '../../../models/courses/courseArea.model';
import { LoadingProvider } from 'app/components/_shared/loading-spinner/loading-spinner.component';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-course-area-intro',
  templateUrl: './course-area-intro.component.html',
  styleUrls: ['./course-area-intro.component.scss']
})
export class CourseAreaIntroComponent implements OnInit, OnDestroy {
  public static route: string = 'course-areas/intro';
  public static footerPath: string = CourseAreaListComponent.route;

  locale: any = {};

  courseAreas: CourseAreaTopItem[];
  name: string = '';

  userSubscription: Subscription;
  courseAreasSubscription: Subscription;

  public paragraphTwo: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private routeBreadcrumbs: RouteBreadcrumbs,
    private localisation: LocalisationService,
    private courseService: CourseService,
    private footerService: Footer,
    private userService: UserService,
    private rowColumnSorter: RowColumnSorter,
    private spinner: LoadingProvider
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem('completed') === 'true') {
      sessionStorage.removeItem('completed');
      location.reload();
    }

    sessionStorage.setItem('areas-intro-seen', 'true');

    this.spinner.show(null, true);
    this.locale = this.localisation.getTranslationsForComponent('CourseAreaIntroComponent');
    let parentLocale = this.localisation.getTranslationsForComponent(
      'CourseAreaListComponent'
    ) as any;

    this.routeBreadcrumbs.breadcrumbs.next([new Breadcrumb(parentLocale.breadcrumbText, null)]);

    this.footerService.update({
      title: this.locale.footerText,
      action: CourseAreaIntroComponent.footerPath
    });

    this.userSubscription = this.userService.getUser().subscribe(user => {
      this.name = user.firstName;

      switch (user.productId) {
        case 'WA2': // PDF Workbook
          this.paragraphTwo = this.locale.researchParagraphWithReport;
          break;
        case 'WA3': // Printed Workbook
          this.paragraphTwo = this.locale.researchParagraphWithPrintedReport;
          break;
        default:
          this.paragraphTwo = this.locale.researchParagraphNoReport;
      }
    });

    this.courseAreasSubscription = this.courseService.getCourseAreasTopFive().subscribe(result => {
      this.courseAreas = result.courseAreas;
      this.spinner.hide();
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.courseAreasSubscription.unsubscribe();
  }

  navigateToAreas() {
    this.router.navigate(['/centigrade/course-areas']);
  }
}
