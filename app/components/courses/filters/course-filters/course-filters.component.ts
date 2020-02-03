import { RouteBreadcrumbs } from './../../../../services/routeBreadcrumbs.service';
import { Breadcrumb } from './../../../../models/_base/breadcrumb.model';
import { Column } from './../../../../models/_shared/column.model';
import { LoadingProvider } from './../../../_shared/loading-spinner/loading-spinner.component';
import { CourseListComponent } from './../../list/course-list.component';
import { Observable } from 'rxjs/Observable';
import { FilterOption } from './../../../../models/courses/filterOption.model';
import { CourseFilter } from './../../../../models/courses/filter.model';
import { SecondaryCourseFilterRequest } from './../../../../models/courses/filterRequest.secondary.model';
import { Course } from './../../../../models/courses/course.model';
import { CourseListResponse } from './../../../../models/courses/courseListResponse.model';
import { CourseService } from './../../../../services/course.service';
import { Footer } from './../../../../services/footer.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LocalisationService } from '../../../../services/localisation.service';

@Component({
  selector: 'app-course-filters',
  templateUrl: './course-filters.component.html',
  styleUrls: ['./course-filters.component.scss']
})
export class CourseFiltersComponent implements OnInit {
  public static route: string = 'courses/filter';
  public static footerPath: string = 'courses';

  locale: any = {};
  parentLocale: any = {};

  query: SecondaryCourseFilterRequest;

  private result: CourseListResponse = new CourseListResponse();
  private filterColumns: Column = new Column();

  constructor(
    private router: Router,
    private localisation: LocalisationService,
    private routeBreadcrumbs: RouteBreadcrumbs,
    private footerService: Footer,
    private loading: LoadingProvider,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    this.locale = this.localisation.getTranslationsForComponent('CourseFiltersComponent');
    this.parentLocale = this.localisation.getTranslationsForComponent('CourseListComponent') as any;

    this.routeBreadcrumbs.breadcrumbs.next([
      new Breadcrumb(this.parentLocale.breadcrumbText, CourseListComponent.route),
      new Breadcrumb(this.locale.breadcrumbText, null)
    ]);

    this.footerService.update({
      title: this.locale.footerText,
      action: () => this.complete()
    });

    this.loading.show(this.locale.loadingText, true);
    this.search(true).subscribe(() => {
      this.loading.hide();
    });
  }

  search(initital: boolean = false) {
    return this.courseService.getCoursesBySecondaryFilters(this.query).flatMap(response => {
      this.result = response;

      response.filters.forEach((filter, index) => {
        let selected = filter.options.filter(opt => opt.selected);
        filter.selectedCount = selected.length;
        if (index % 2 == 0) {
          this.filterColumns.left.push(filter);
        } else {
          this.filterColumns.right.push(filter);
        }
      });

      this.query = new SecondaryCourseFilterRequest();
      this.query.filters = response.filters;

      return Observable.of(response);
    });
  }

  complete() {
    this.loading.show(this.parentLocale.loadingText);

    this.search().subscribe(response => {
      this.router.navigateByUrl('/centigrade/courses');
    });
  }

  select(filter: CourseFilter, option: FilterOption) {
    switch (filter.type) {
      case 'FTYPE_MULTISELECT':
        this.selectMulti(filter, option);
        break;
      case 'FTYPE_BOOLEAN':
        this.selectBoolean(filter, option);
        break;
    }
  }

  resetFilters() {
    this.loading.show(this.parentLocale.loadingText);
    this.courseService.deleteSecondaryFilters().subscribe(filters => {
      this.loading.hide();
      this.router.navigateByUrl('/centigrade/courses');
    });
  }

  trackBy(index, obj) {
    return index;
  }

  private selectBoolean(filter: CourseFilter, option: FilterOption) {
    filter.options.forEach(opt => (opt.selected = false));
    option.selected = true;

    filter.completed = filter.options.some(opt => opt.selected);
  }

  private selectMulti(filter: CourseFilter, option: FilterOption) {
    option.selected = !option.selected;

    if (option.selected == true) filter.selectedCount++;
    else filter.selectedCount--;

    filter.completed = filter.options.some(opt => opt.selected);
  }
}
