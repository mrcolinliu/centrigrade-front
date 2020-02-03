import { KeyValuePair } from './../../../../models/_shared/keyValue';
import { Router } from '@angular/router';
import { Budget } from './../../../../models/courses/budget.model';
import { CourseFilter } from './../../../../models/courses/filter.model';
import { CourseService } from './../../../../services/course.service';
import {
  PrimaryCourseFiltersRequest,
  PrimaryCourseFilterRequest
} from './../../../../models/courses/filterRequest.primary.model';
import { Component, OnInit } from '@angular/core';
import { RouteBreadcrumbs } from './../../../../services/routeBreadcrumbs.service';
import { Footer } from './../../../../services/footer.service';
import { Currency } from './../../../../models/courses/currency.model';
import { Breadcrumb } from './../../../../models/_base/breadcrumb.model';
import { CourseAreaApplyFiltersComponent } from './../../../../components/course-areas/filters/course-area-apply-filters/course-area-apply-filters.component';
import * as _ from 'lodash';
import { LocalisationService } from '../../../../services/localisation.service';

@Component({
  selector: 'app-course-area-budget-filter',
  templateUrl: './course-area-budget-filter.component.html',
  styleUrls: ['./course-area-budget-filter.component.scss']
})
export class CourseAreaBudgetFilterComponent implements OnInit {
  public static route: string = CourseAreaApplyFiltersComponent.route + '/course-fees-filter';
  public static footerTitle: string = 'Update budget filters';
  public static footerPath: string = CourseAreaApplyFiltersComponent.route;

  locale: any = {};

  budgetCourseFilter: CourseFilter;
  questionnaireId: number;

  budgetFromIndex: number = 0;
  mainValueFrom: KeyValuePair<string, any> = new KeyValuePair<string, any>();
  subValuesFrom: KeyValuePair<string, any>[] = [];

  budgetToIndex: number = 9;

  mainValueIndex: number = 0;
  mainValueTo: KeyValuePair<string, any> = new KeyValuePair<string, any>();
  subValuesTo: KeyValuePair<string, any>[] = [];

  public formSubmitted: boolean = false;

  constructor(
    private routeBreadcrumbs: RouteBreadcrumbs,
    private footerService: Footer,
    private courseService: CourseService,
    private router: Router,
    private localisation: LocalisationService
  ) {}

  ngOnInit() {
    this.locale = this.localisation.getTranslationsForComponent('CourseAreaBudgetFilterComponent');

    let parentLocale = this.localisation.getTranslationsForComponent(
      'CourseAreaApplyFiltersComponent'
    ) as any;

    this.routeBreadcrumbs.breadcrumbs.next([
      new Breadcrumb(parentLocale.breadcrumbText, CourseAreaApplyFiltersComponent.route),
      new Breadcrumb(this.locale.breadcrumbText, null)
    ]);

    this.footerService.update({
      title: this.locale.footerText,
      action: () => this.submitBudget(this)
    });

    this.getPrimaryCourseFilters(null, true);
  }

  setFormSubmitted(value) {
    this.formSubmitted = value;
  }

  submitBudget(scope: this): void {
    scope.budgetCourseFilter.completed = true;
    _.forEach(scope.budgetCourseFilter.options, (opt, key) => {
      if (key == scope.budgetFromIndex || key == scope.budgetToIndex) {
        opt.selected = true;
      } else {
        opt.selected = false;
      }
    });

    scope.courseService
      .savePrimaryCourseFilter(new PrimaryCourseFilterRequest(scope.budgetCourseFilter))
      .subscribe(filters => {
        scope.router.navigate(['/centigrade/course-area-filters']);
      });
  }

  reset() {
    this.setFormSubmitted(true);
    this.courseService.deletePrimaryCourseFilter(this.budgetCourseFilter.id).subscribe(filters => {
      this.setFormSubmitted(false);
      this.router.navigate(['/centigrade/course-area-filters']);
    });
  }

  getPrimaryCourseFilters(filters: PrimaryCourseFiltersRequest, initialLoad: boolean) {
    this.courseService.getPrimaryCourseFilters(filters).subscribe(filters => {
      //Populate join course filter toggle area.
      let filterId = filters.filters.find(filter => filter.tag == 'FTYPE_BUDGET').id;

      this.courseService.getPrimaryCourseFilterDetails(filterId).subscribe(filter => {
        this.budgetCourseFilter = filter.filter;

        let selectedOptions = this.budgetCourseFilter.options.filter(opt => opt.selected);

        if (selectedOptions.length == 1) {
          this.budgetFromIndex = this.budgetToIndex = this.budgetCourseFilter.options.indexOf(
            selectedOptions[0]
          );
        } else {
          this.budgetFromIndex = this.budgetCourseFilter.options.indexOf(selectedOptions[0]);
          this.budgetToIndex = this.budgetCourseFilter.options.indexOf(selectedOptions[1]);
        }

        this.refreshBudgetOptions(initialLoad);
      });
    });
  }

  refreshBudgetOptions(initialLoad: boolean): void {
    this.subValuesFrom = this.budgetCourseFilter.options[this.budgetFromIndex].values.filter(
      (val, index) => {
        return index != this.mainValueIndex;
      }
    );
    this.subValuesTo = this.budgetCourseFilter.options[this.budgetToIndex].values.filter(
      (val, index) => {
        return index != this.mainValueIndex;
      }
    );

    this.mainValueFrom = this.budgetCourseFilter.options[this.budgetFromIndex].values[
      this.mainValueIndex
    ];
    this.mainValueTo = this.budgetCourseFilter.options[this.budgetToIndex].values[
      this.mainValueIndex
    ];
  }

  incrementBudget(isToValue: boolean): void {
    if (isToValue && this.budgetToIndex + 1 < this.budgetCourseFilter.options.length) {
      this.budgetToIndex++;
    } else if (!isToValue) {
      if (this.budgetToIndex >= this.budgetFromIndex + 1) {
        this.budgetFromIndex++;
      }
    }

    this.refreshBudgetOptions(false);
  }

  decrementBudget(isToValue: boolean): void {
    if (isToValue) {
      if (!(this.budgetToIndex - 1 < this.budgetFromIndex)) {
        this.budgetToIndex--;
      }
    } else {
      if (this.budgetFromIndex - 1 >= 0) {
        this.budgetFromIndex--;
      }
    }
    this.refreshBudgetOptions(false);
  }

  changeCurrency() {
    if (
      this.mainValueIndex + 1 ==
      this.budgetCourseFilter.options[this.budgetToIndex].values.length
    ) {
      this.mainValueIndex = 0;
    } else {
      this.mainValueIndex++;
    }

    this.refreshBudgetOptions(false);
  }
}
