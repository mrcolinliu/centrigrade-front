import { CourseFiltersResponse } from './../../../../models/courses/filterResponse.model';
import { Budget } from './../../../../models/courses/budget.model';
import { LoadingProvider } from './../../../_shared/loading-spinner/loading-spinner.component';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

import { RouteBreadcrumbs } from './../../../../services/routeBreadcrumbs.service';
import { Footer } from './../../../../services/footer.service';
import { CourseService } from './../../../../services/course.service';
import { QuestionnaireService } from './../../../../services/questionnaire.service';
import { Breadcrumb } from './../../../../models/_base/breadcrumb.model';

import { PrimaryCourseFiltersRequest } from './../../../../models/courses/filterRequest.primary.model';
import { CourseFilter } from './../../../../models/courses/filter.model';
import { FilterGrade } from './../../../../models/courses/filterGrade.model';
import { LocalisationService } from '../../../../services/localisation.service';
import { Router } from '@angular/router';
import { ModalProvider } from '../../../_shared/modal/modal.component';
import { NavigationService } from '../../../../services/navigation.service';

@Component({
  selector: 'app-course-area-apply-filters',
  templateUrl: './course-area-apply-filters.component.html',
  styleUrls: ['./course-area-apply-filters.component.scss']
})
export class CourseAreaApplyFiltersComponent implements OnInit {
  public static route: string = 'course-area-filters';

  locale: any = {};

  filters: CourseFilter[] = [];
  coursesAvailable: number = 0;

  title: string = '';
  subtitle: string = '';

  //Grade points
  gradeCourseFilter: CourseFilter = new CourseFilter();

  //Budget Filter Attributes
  budgetCourseFilter: CourseFilter = new CourseFilter();

  //Language Filter Attributes
  languageCourseFilter: CourseFilter = new CourseFilter();

  //Location Filter Attributes
  locationCourseFilter: CourseFilter = new CourseFilter();

  //Course Filter Attributes
  courseCourseFilter: CourseFilter = new CourseFilter();

  //Joint Course Attributes
  showJointCourse: boolean = false;
  jointCourseFilter: CourseFilter = new CourseFilter();

  incomplete: boolean = false;

  constructor(
    private router: Router,
    private routeBreadcrumbs: RouteBreadcrumbs,
    private footerService: Footer,
    private courseService: CourseService,
    private questionnaireService: QuestionnaireService,
    private spinner: LoadingProvider,
    private localisation: LocalisationService,
    private modal: ModalProvider,
    private navigationService: NavigationService
  ) {}

  ngOnInit() {
    this.locale = this.localisation.getTranslationsForComponent('CourseAreaApplyFiltersComponent');

    this.spinner.show(this.locale.loadingText, true);
    this.routeBreadcrumbs.breadcrumbs.next([new Breadcrumb(this.locale.breadcrumbText, '')]);

    this.footerService.update({
      title: this.locale.footerText,
      action: () => this.applyFilters()
    });

    this.getPrimaryCourseFilters(null);

    if (sessionStorage.getItem('filter-incomplete') == '1') {
      this.incomplete = true;
      sessionStorage.removeItem('filter-incomplete');
    }
  }

  getPrimaryCourseFilters(filters: PrimaryCourseFiltersRequest) {
    this.spinner.show(this.locale.loadingText);
    this.courseService.getPrimaryCourseFilters(filters).subscribe(filters => {
      this.navigationService.updateFiltersComplete(
        !filters.filters.filter(e => e.isRequired).some(e => !e.completed)
      );
      if (filters.filters.filter(e => e.isRequired).some(e => !e.completed)) {
        this.questionnaireService.statusOverride.next(300);
      } else {
        this.questionnaireService.statusOverride.next(null);
      }
      this.updateView(filters);
      this.spinner.hide();
    });
  }

  updateJointCourses() {
    this.showJointCourse = !this.showJointCourse;
    this.jointCourseFilter.completed = true;

    _.forEach(this.jointCourseFilter.options, (opt, key) => {
      opt.selected = !opt.selected;
    });

    this.getPrimaryCourseFilters(new PrimaryCourseFiltersRequest(this.filters));
  }

  resetFilters() {
    this.filters.forEach(filter => (filter.completed = false));
    this.courseService.deletePrimaryCourseFilters().subscribe(filters => {
      this.updateView(filters);
    });
  }

  applyFilters() {
    if (this.isValid()) this.router.navigateByUrl('centigrade/courses');
    else
      this.modal.create(
        this.locale.invalidFiltersModalTitle,
        this.locale.invalidFiltersModalMessage,
        `<ul>${this.filters
          .filter(f => f.isRequired && !f.completed)
          .map(f => `<li>${f.title}</li>`)}</ul>`
      );
  }

  private updateView(filters: CourseFiltersResponse) {
    this.coursesAvailable = filters.count;
    this.filters = filters.filters;
    this.title = filters.pageTitle;
    this.subtitle = filters.pageText;

    //Populate join course filter toggle area.
    this.jointCourseFilter = this.filters.find(filter => filter.tag == 'FTYPE_JOINT_COURSES');
    this.gradeCourseFilter = this.filters.find(filter => filter.tag == 'FTYPE_TARIFF');
    this.budgetCourseFilter = this.filters.find(filter => filter.tag == 'FTYPE_BUDGET');
    this.languageCourseFilter = this.filters.find(filter => filter.tag == 'FTYPE_LANGUAGES');
    this.locationCourseFilter = this.filters.find(filter => filter.tag == 'FTYPE_LOCATION');
    this.courseCourseFilter = this.filters.find(filter => filter.tag == 'FTYPE_COURSE');

    if (this.jointCourseFilter && this.jointCourseFilter.completed) {
      let option = this.jointCourseFilter.options.find(opt => opt.id == 1);
      this.showJointCourse = option.selected;
    }
  }

  private isValid(): boolean {
    return !this.filters.some(f => f.isRequired && !f.completed);
  }

  private goToFilter(tag: string) {
    switch (tag) {
      case 'FTYPE_TARIFF': {
        this.router.navigate(['/centigrade/course-area-filters/grades-filter']);
        break;
      }
      case 'FTYPE_BUDGET': {
        this.router.navigate(['/centigrade/course-area-filters/course-fees-filter']);
        break;
      }
      case 'FTYPE_LANGUAGES': {
        this.router.navigate(['/centigrade/course-area-filters/language-filter']);
        break;
      }
      case 'FTYPE_LOCATION': {
        this.router.navigate(['/centigrade/course-area-filters/location-filter']);
        break;
      }
      case 'FTYPE_COURSE': {
        this.router.navigate(['/centigrade/course-area-filters/courses-filter']);
        break;
      }
    }
  }
}
