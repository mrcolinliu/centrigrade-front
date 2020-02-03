import { FilterOption } from './../../../../models/courses/filterOption.model';
import { CourseFilter } from './../../../../models/courses/filter.model';
import {
  PrimaryCourseFiltersRequest,
  PrimaryCourseFilterRequest
} from './../../../../models/courses/filterRequest.primary.model';
import { Router } from '@angular/router';
import { QuestionnaireService } from './../../../../services/questionnaire.service';
import { CourseService } from './../../../../services/course.service';
import { Component, OnInit } from '@angular/core';
import { RouteBreadcrumbs } from './../../../../services/routeBreadcrumbs.service';
import { Footer } from './../../../../services/footer.service';
import { Breadcrumb } from './../../../../models/_base/breadcrumb.model';
import { Column } from './../../../../models/_shared/column.model';
import { CourseAreaApplyFiltersComponent } from './../../../../components/course-areas/filters/course-area-apply-filters/course-area-apply-filters.component';
import * as _ from 'lodash';
import { LocalisationService } from '../../../../services/localisation.service';

@Component({
  selector: 'app-course-area-courses-filter',
  templateUrl: './course-area-courses-filter.component.html',
  styleUrls: ['./course-area-courses-filter.component.scss']
})
export class CourseAreaCoursesFilterComponent implements OnInit {
  public static route: string = CourseAreaApplyFiltersComponent.route + '/courses-filter';
  public static footerTitle: string = 'Update courses preference';
  public static footerPath: string = CourseAreaApplyFiltersComponent.route;

  locale: any = {};

  courseCourseFilter: CourseFilter = new CourseFilter();
  filterText: string = '';

  constructor(
    private routeBreadcrumbs: RouteBreadcrumbs,
    private footerService: Footer,
    private courseService: CourseService,
    private questionnaireService: QuestionnaireService,
    private router: Router,
    private localisation: LocalisationService
  ) {}

  ngOnInit() {
    this.locale = this.localisation.getTranslationsForComponent('CourseAreaCoursesFilterComponent');
    let parentLocale = this.localisation.getTranslationsForComponent(
      'CourseAreaApplyFiltersComponent'
    ) as any;

    this.routeBreadcrumbs.breadcrumbs.next([
      new Breadcrumb(parentLocale.breadcrumbText, CourseAreaApplyFiltersComponent.route),
      new Breadcrumb(this.locale.breadcrumbText, null)
    ]);

    this.footerService.update({
      title: CourseAreaCoursesFilterComponent.footerTitle,
      action: () => this.submitLocation(this)
    });

    this.getPrimaryCourseFilters(null);
  }

  submitLocation(scope: this): void {
    scope.courseCourseFilter.completed = false;
    this.isComplete(scope.courseCourseFilter.options, scope);

    scope.courseService
      .savePrimaryCourseFilter(new PrimaryCourseFilterRequest(scope.courseCourseFilter))
      .subscribe(filters => {
        scope.router.navigate(['/centigrade/course-area-filters']);
      });
  }

  reset() {
    this.courseService.deletePrimaryCourseFilter(this.courseCourseFilter.id).subscribe(filters => {
      this.router.navigate(['/centigrade/course-area-filters']);
    });
  }

  clear() {
    this.courseCourseFilter.options.forEach(e => {
      e.options.forEach(course => {
        course.selected = false;
      });
    });
  }

  isComplete(options: FilterOption[], scope: this): void {
    _.forEach(options, opt => {
      if (opt.selected) {
        scope.courseCourseFilter.completed = true;
      } else {
        this.isComplete(opt.options, scope);
      }
    });
  }

  getPrimaryCourseFilters(filters: PrimaryCourseFiltersRequest) {
    this.courseService.getPrimaryCourseFilters(filters).subscribe(filters => {
      //Populate join course filter toggle area.
      let filterId = filters.filters.find(filter => filter.tag == 'FTYPE_COURSE').id;

      this.courseService.getPrimaryCourseFilterDetails(filterId).subscribe(filter => {
        this.courseCourseFilter = filter.filter;

        if (this.courseCourseFilter.isRequired) {
          this.questionnaireService.statusOverride.next(300);
        } else {
          this.questionnaireService.statusOverride.next(null);
        }
      });
    });
  }

  selectCourse(option: FilterOption, childValue?: boolean) {
    option.selected = childValue == undefined ? !option.selected : childValue.valueOf();

    this.courseCourseFilter.options.forEach(a => {
      a.options.forEach(o => {
        if (o.id == option.id) {
          o.selected = option.selected;
        }
      });
    });
  }
}
