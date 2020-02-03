import { FilterOption } from './../../../../models/courses/filterOption.model';
import { CourseFilter } from './../../../../models/courses/filter.model';
import {
  PrimaryCourseFiltersRequest,
  PrimaryCourseFilterRequest
} from './../../../../models/courses/filterRequest.primary.model';
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
  selector: 'app-course-area-location-filter',
  templateUrl: './course-area-location-filter.component.html',
  styleUrls: ['./course-area-location-filter.component.scss']
})
export class CourseAreaLocationFilterComponent implements OnInit {
  public static route: string = CourseAreaApplyFiltersComponent.route + '/location-filter';
  public static footerTitle: string = 'Update location preferences';
  public static footerPath: string = CourseAreaApplyFiltersComponent.route;

  locale: any = {};

  locationCourseFilter: CourseFilter = new CourseFilter();
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
      'CourseAreaLocationFilterComponent'
    );
    let parentLocale = this.localisation.getTranslationsForComponent(
      'CourseAreaApplyFiltersComponent'
    ) as any;

    this.routeBreadcrumbs.breadcrumbs.next([
      new Breadcrumb(parentLocale.breadcrumbText, CourseAreaApplyFiltersComponent.route),
      new Breadcrumb(this.locale.breadcrumbText, null)
    ]);

    this.footerService.update({
      title: CourseAreaLocationFilterComponent.footerTitle,
      action: () => this.submitLocation(this)
    });

    this.getPrimaryCourseFilters(null);
  }

  submitLocation(scope: this): void {
    scope.locationCourseFilter.completed = false;
    this.isComplete(scope.locationCourseFilter.options, scope);

    scope.courseService
      .savePrimaryCourseFilter(new PrimaryCourseFilterRequest(scope.locationCourseFilter))
      .subscribe(filters => {
        scope.router.navigate(['/centigrade/course-area-filters']);
      });
  }

  reset() {
    this.courseService
      .deletePrimaryCourseFilter(this.locationCourseFilter.id)
      .subscribe(filters => {
        this.router.navigate(['/centigrade/course-area-filters']);
      });
  }

  isComplete(options: FilterOption[], scope: this): void {
    _.forEach(options, opt => {
      if (opt.selected) {
        scope.locationCourseFilter.completed = true;
      } else {
        this.isComplete(opt.options, scope);
      }
    });
  }

  search(text: string) {
    this.locationCourseFilter.options.forEach(option => {
      this.closeAll(option);
    });
    if (text.length > 2) {
      this.locationCourseFilter.options.forEach(option => {
        this.filterOption(option, text);
      });
    }
  }

  filterOption(option: FilterOption, text: string): boolean {
    let match = false;

    match = option.values.some(e => e.value.toUpperCase().indexOf(text.toUpperCase()) !== -1);

    if (!!option.options) {
      option.options.forEach(e => {
        if (this.filterOption(e, text)) {
          match = true;
        }
      });
    }

    option.shown = match;
    option.expanded = match;

    return match;
  }

  closeAll(option: FilterOption) {
    option.expanded = false;
    option.shown = true;
    if (option.options != null) {
      option.options.forEach(o => {
        this.closeAll(o);
      });
    }
  }

  getPrimaryCourseFilters(filters: PrimaryCourseFiltersRequest) {
    this.courseService.getPrimaryCourseFilters(filters).subscribe(filters => {
      //Populate join course filter toggle area.
      let filterId = filters.filters.find(filter => filter.tag === 'FTYPE_LOCATION').id;

      this.courseService.getPrimaryCourseFilterDetails(filterId).subscribe(filter => {
        this.locationCourseFilter = filter.filter;
        this.locationCourseFilter.options.forEach(o => {
          this.closeAll(o);
        });
      });
    });
  }

  selectLocation(option: FilterOption, childValue?: boolean) {
    option.selected = childValue == undefined ? !option.selected : childValue.valueOf();
    _.forEach(option.options, (opt, key) => {
      this.selectLocation(opt, option.selected);
    });
  }
}
