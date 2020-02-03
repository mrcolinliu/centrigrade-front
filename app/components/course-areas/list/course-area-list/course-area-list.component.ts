import { ModalProvider } from './../../../_shared/modal/modal.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CourseService } from './../../../../services/course.service';
import { QuestionnaireService } from './../../../../services/questionnaire.service';
import { RouteBreadcrumbs } from './../../../../services/routeBreadcrumbs.service';
import { Footer } from './../../../../services/footer.service';
import { CourseArea } from './../../../../models/courses/courseArea.model';
import { Router } from '@angular/router';
import { CourseAreaApplyFiltersComponent } from './../../filters/course-area-apply-filters/course-area-apply-filters.component';
import { LoadingProvider } from './../../../_shared/loading-spinner/loading-spinner.component';
import { Breadcrumb } from './../../../../models/_base/breadcrumb.model';
import * as _ from 'lodash';
import { LocalisationService } from '../../../../services/localisation.service';

@Component({
  selector: 'app-course-area-list',
  templateUrl: './course-area-list.component.html',
  styleUrls: ['./course-area-list.component.scss']
})
export class CourseAreaListComponent implements OnInit {
  public static route: string = 'course-areas';

  locale: any = {};

  courseAreas: CourseArea[] = [];

  filterText: string = '';
  numberOfselectedCourse: number = 0;
  maxCourseAreas: number = 5;

  incomplete: boolean = false;
  public disableClick: boolean = false;

  constructor(
    private routeBreadcrumbs: RouteBreadcrumbs,
    private footerService: Footer,
    private courseService: CourseService,
    private questionnaireService: QuestionnaireService,
    private router: Router,
    private spinner: LoadingProvider,
    private modal: ModalProvider,
    private localisation: LocalisationService
  ) {}

  ngOnInit() {
    this.locale = this.localisation.getTranslationsForComponent('CourseAreaListComponent');

    this.spinner.show(this.locale.loadingText, true);
    this.routeBreadcrumbs.breadcrumbs.next([new Breadcrumb(this.locale.breadcrumbText, null)]);

    this.footerService.update({
      title: this.locale.footerText,
      action: () => this.submitCourseArea(this)
    });

    this.courseService.getCourseAreas().subscribe(response => {
      this.courseAreas = response.courseAreas;
      this.maxCourseAreas = response.maxCourseAreas;

      this.countNumberOfSelectedCourses();

      this.spinner.hide();
    });

    if (sessionStorage.getItem('areas-intro-seen') == null) {
      history.replaceState({}, 'Centigrade', '/#/centigrade/course-areas');
      this.router.navigateByUrl('centigrade/course-areas/intro');
    }

    if (sessionStorage.getItem('areas-incomplete') == '1') {
      this.incomplete = true;
      sessionStorage.removeItem('areas-incomplete');
    }
  }

  setFormSubmitted(value) {
    this.disableClick = value;
  }

  submitCourseArea(scope: this): void {
    if (scope.numberOfselectedCourse == 0) {
      scope.modal.create(this.locale.noneSelectedModalTitle, this.locale.noneSelectedModalMessage);
    } else if (scope.numberOfselectedCourse > this.maxCourseAreas) {
      scope.modal.create(
        this.locale.maxSelectedModalTitle,
        (this.locale.maxSelectedModalMessage as string).format([this.maxCourseAreas.toString()])
      );
    } else {
      scope.router.navigate(['/centigrade/course-area-filters']);
    }
  }

  toggleCourse(course: CourseArea): void {
    course.selected = !course.selected;
    this.countNumberOfSelectedCourses();

    if (course.selected) {
      //They are only allowed to select so many
      if (this.numberOfselectedCourse > this.maxCourseAreas) {
        course.selected = false;
        this.modal.create(
          this.locale.maxSelectedModalTitle,
          (this.locale.maxSelectedModalMessage as string).format([this.maxCourseAreas.toString()])
        );
      } else {
        this.setFormSubmitted(true);
        this.courseService.selectCourseArea(course.id).subscribe(result => {});
        this.setFormSubmitted(false);
      }
    } else {
      this.setFormSubmitted(true);
      this.courseService.deselectCourseArea(course.id).subscribe(result => {});
      this.setFormSubmitted(false);
    }

    this.countNumberOfSelectedCourses();
  }

  countNumberOfSelectedCourses(): void {
    this.numberOfselectedCourse = this.courseAreas.filter(courseArea => courseArea.selected).length;

    if (this.numberOfselectedCourse <= 0) {
      this.questionnaireService.statusOverride.next(100);
    } else {
      this.questionnaireService.statusOverride.next(null);
    }
  }

  viewCourseArea(id) {
    this.router.navigate(['/centigrade/course-areas/detail', id]);
  }
}
