import { KeyValuePair } from './../../../../models/_shared/keyValue';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CourseAreaApplyFiltersComponent } from './../../../../components/course-areas/filters/course-area-apply-filters/course-area-apply-filters.component';
import { RouteBreadcrumbs } from './../../../../services/routeBreadcrumbs.service';
import { Footer } from './../../../../services/footer.service';
import { Breadcrumb } from './../../../../models/_base/breadcrumb.model';
import * as _ from 'lodash';

import { CourseService } from './../../../../services/course.service';
import { QuestionnaireService } from './../../../../services/questionnaire.service';
import {
  PrimaryCourseFiltersRequest,
  PrimaryCourseFilterRequest
} from './../../../../models/courses/filterRequest.primary.model';
import { CourseFilter } from './../../../../models/courses/filter.model';
import { FilterGrade } from './../../../../models/courses/filterGrade.model';
import { LocalisationService } from '../../../../services/localisation.service';

@Component({
  selector: 'app-course-area-points-filter',
  templateUrl: './course-area-points-filter.component.html',
  styleUrls: ['./course-area-points-filter.component.scss']
})
export class CourseAreaPointsFilterComponent implements OnInit {
  public static route: string = CourseAreaApplyFiltersComponent.route + '/grades-filter';
  public static footerPath: string = CourseAreaApplyFiltersComponent.route;

  locale: any = {};

  gradeCourseFilter: CourseFilter;
  gradeIndex: number = 0;

  grade: KeyValuePair<string, string>;
  otherGrades: KeyValuePair<string, string>[];

  constructor(
    private routeBreadcrumbs: RouteBreadcrumbs,
    private footerService: Footer,
    private courseService: CourseService,
    private questionnaireService: QuestionnaireService,
    private router: Router,
    private localisation: LocalisationService
  ) {}

  ngOnInit() {
    this.locale = this.localisation.getTranslationsForComponent('CourseAreaPointsFilterComponent');

    let parentLocale = this.localisation.getTranslationsForComponent(
      'CourseAreaApplyFiltersComponent'
    ) as any;

    this.routeBreadcrumbs.breadcrumbs.next([
      new Breadcrumb(parentLocale.breadcrumbText, CourseAreaApplyFiltersComponent.route),
      new Breadcrumb(this.locale.breadcrumbText, null)
    ]);

    this.footerService.update({
      title: this.locale.footerText,
      action: () => this.submitGrade(this)
    });

    this.getPrimaryCourseFilters(null);
  }

  submitGrade(scope: this): void {
    scope.gradeCourseFilter.completed = true;
    _.forEach(scope.gradeCourseFilter.options, (opt, key) => {
      if (key == scope.gradeIndex) {
        opt.selected = true;
      } else {
        opt.selected = false;
      }
    });

    scope.courseService
      .savePrimaryCourseFilter(new PrimaryCourseFilterRequest(scope.gradeCourseFilter))
      .subscribe(filters => {
        scope.router.navigate(['/centigrade/course-area-filters']);
      });
  }

  reset() {
    this.courseService.deletePrimaryCourseFilter(this.gradeCourseFilter.id).subscribe(filters => {
      this.router.navigate(['/centigrade/course-area-filters']);
    });
  }

  bindGradeInformation(values: KeyValuePair<string, string>[]): void {
    this.grade = values[0];
    this.otherGrades = values.filter(e => e.key != this.grade.key);
  }

  getGradeString(grade: KeyValuePair<string, string>): string {
    let test = grade;
    switch (grade.key) {
      case 'a_level':
        return this.locale.aLevelLabelText;
      case 'ib_points':
        return this.locale.ibLabelText;
      case 'ucas_points':
        return this.locale.ucasLabelText;
      case 'scottish_higher':
        return this.locale.scottishHighersLabelText;
      case 'leaving_point':
        return this.locale.leavingLabelText;
    }
  }

  increaseGrades(): void {
    this.gradeIndex + 1 > this.gradeCourseFilter.options.length - 1
      ? (this.gradeIndex = 0)
      : this.gradeIndex++;
    this.bindGradeInformation(this.gradeCourseFilter.options[this.gradeIndex].values);
  }

  decreaseGrades(): void {
    this.gradeIndex - 1 < 0
      ? (this.gradeIndex = this.gradeCourseFilter.options.length - 1)
      : this.gradeIndex--;
    this.bindGradeInformation(this.gradeCourseFilter.options[this.gradeIndex].values);
  }

  getPrimaryCourseFilters(filters: PrimaryCourseFiltersRequest) {
    this.courseService.getPrimaryCourseFilters(filters).subscribe(filters => {
      //Populate join course filter toggle area.
      let filterId = filters.filters.find(filter => filter.tag == 'FTYPE_TARIFF').id;

      this.courseService.getPrimaryCourseFilterDetails(filterId).subscribe(filter => {
        this.gradeCourseFilter = filter.filter;

        if (this.gradeCourseFilter.isRequired) {
          this.questionnaireService.statusOverride.next(300);
        } else {
          this.questionnaireService.statusOverride.next(null);
        }

        if (this.gradeCourseFilter.completed) {
          this.gradeIndex = this.gradeCourseFilter.options.findIndex(opt => opt.selected);
        }

        this.bindGradeInformation(this.gradeCourseFilter.options[this.gradeIndex].values);
      });
    });
  }
}
