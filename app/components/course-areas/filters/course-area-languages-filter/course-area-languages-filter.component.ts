import {
  PrimaryCourseFiltersRequest,
  PrimaryCourseFilterRequest
} from './../../../../models/courses/filterRequest.primary.model';
import { CourseFilter } from './../../../../models/courses/filter.model';
import { Router } from '@angular/router';
import { CourseService } from './../../../../services/course.service';
import { Component, OnInit } from '@angular/core';
import { RouteBreadcrumbs } from './../../../../services/routeBreadcrumbs.service';
import { Footer } from './../../../../services/footer.service';
import { Breadcrumb } from './../../../../models/_base/breadcrumb.model';
import { CourseAreaApplyFiltersComponent } from './../../../../components/course-areas/filters/course-area-apply-filters/course-area-apply-filters.component';
import * as _ from 'lodash';
import { LocalisationService } from '../../../../services/localisation.service';

@Component({
  selector: 'app-course-area-languages-filter',
  templateUrl: './course-area-languages-filter.component.html',
  styleUrls: ['./course-area-languages-filter.component.scss']
})
export class CourseAreaLanguagesFilterComponent implements OnInit {
  public static route: string = CourseAreaApplyFiltersComponent.route + '/language-filter';
  public static footerTitle: string = 'Update language preferences';
  public static footerPath: string = CourseAreaApplyFiltersComponent.route;

  locale: any = {};

  languageCourseFilter: CourseFilter = new CourseFilter();
  filterText: string = '';

  constructor(
    private routeBreadcrumbs: RouteBreadcrumbs,
    private footerService: Footer,
    private courseService: CourseService,
    private router: Router,
    private localisation: LocalisationService
  ) {}

  ngOnInit() {
    this.locale = this.localisation.getTranslationsForComponent(
      'CourseAreaLanguagesFilterComponent'
    );

    let parentLocale = this.localisation.getTranslationsForComponent(
      'CourseAreaApplyFiltersComponent'
    ) as any;

    this.routeBreadcrumbs.breadcrumbs.next([
      new Breadcrumb(parentLocale.breadcrumbText, CourseAreaApplyFiltersComponent.route),
      new Breadcrumb(this.locale.breadcrumbText, null)
    ]);

    this.footerService.update({
      title: CourseAreaLanguagesFilterComponent.footerTitle,
      action: () => this.submitLanguages(this)
    });

    this.getPrimaryCourseFilters(null);
  }

  submitLanguages(scope: this): void {
    scope.languageCourseFilter.completed =
      _.filter(scope.languageCourseFilter.options, opt => opt.selected).length > 0;

    scope.courseService
      .savePrimaryCourseFilter(new PrimaryCourseFilterRequest(scope.languageCourseFilter))
      .subscribe(filters => {
        scope.router.navigate(['/centigrade/course-area-filters']);
      });
  }

  reset() {
    this.courseService
      .deletePrimaryCourseFilter(this.languageCourseFilter.id)
      .subscribe(filters => {
        this.router.navigate(['/centigrade/course-area-filters']);
      });
  }

  getPrimaryCourseFilters(filters: PrimaryCourseFiltersRequest) {
    this.courseService.getPrimaryCourseFilters(filters).subscribe(filters => {
      //Populate join course filter toggle area.
      let filterId = filters.filters.find(filter => filter.tag == 'FTYPE_LANGUAGES').id;

      this.courseService.getPrimaryCourseFilterDetails(filterId).subscribe(filter => {
        this.languageCourseFilter = filter.filter;
      });
    });
  }

  getCount(): number {
    return _.filter(this.languageCourseFilter.options, opt => opt.selected).length;
  }
}
