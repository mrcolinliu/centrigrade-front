import { CourseService } from './../../../services/course.service';
import { Footer } from './../../../services/footer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { RouteBreadcrumbs } from '../../../services/routeBreadcrumbs.service';
import { Breadcrumb } from '../../../models/_base/breadcrumb.model';
import { CompareCoursesComponent } from '../compare/compare-courses.component';
import { LocalisationService } from '../../../services/localisation.service';
import { ResearchService } from '../../../services/research.service';
import {
  ShortlistCourseSummary,
  ShortlistInstitutionSummary
} from '../../../models/research/research.models';
import { ModalProvider } from '../../_shared/modal/modal.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-course-shortlist',
  templateUrl: './course-shortlist.component.html',
  styleUrls: ['./course-shortlist.component.scss']
})
export class CourseShortlistComponent implements OnInit {
  public static route: string = 'shortlist';
  public static footerPath: string = 'finalise';

  locale: any = {};

  searchText: string;

  courses: ShortlistCourseSummary[] = [];
  institutions: ShortlistInstitutionSummary[] = [];

  coursesActive: boolean = true;
  institutionsActive: boolean = false;

  public formSubmitted: boolean = false;

  edited31118: string;
  displayddl: string;
  edited = 'edited';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private routeBreadcrums: RouteBreadcrumbs,
    private footerService: Footer,
    private localistation: LocalisationService,
    private courseService: CourseService,
    private researchService: ResearchService,
    private modal: ModalProvider,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.locale = this.localistation.getTranslationsForComponent('CourseShortlistComponent');

    this.routeBreadcrums.breadcrumbs.next([new Breadcrumb(this.locale.breadcrumbText, null)]);

    this.footerService.update({
      title: this.locale.footerText,
      action: CourseShortlistComponent.footerPath
    });

    this.update();
  }

  addSafeImage(cards) {
    for (var i = 0, len = cards.length; i < len; i++) {
      cards[i].safeImage = this.sanitizer.bypassSecurityTrustStyle(`url(${cards[i].image})`);
    }
  }

  update() {
    this.researchService.getShortlist().subscribe(response => {
      this.courses = response.courses;
      this.addSafeImage(this.courses); //sanitizer for bg image XSS

      this.courses.forEach(course => {
        course.institutionSummary = this.institutions.find(
          institution => institution.name == course.institution
        );
      });

      let selected = JSON.parse(sessionStorage.getItem('shortlistSelectedCourses') || '[]');

      selected.forEach(selectedId => {
        if (this.courses.some(e => e.courseId == selectedId))
          this.courses.find(e => e.courseId == selectedId).selected = true;
      });
    });
  }

  ngOnDestroy() {
    let courseIds = this.courses.filter(course => course.selected).map(course => course.courseId);
    sessionStorage.setItem('shortlistSelectedCourses', JSON.stringify(courseIds));
    sessionStorage.setItem('navigatedFrom', 'shortlist');
  }

  compare() {
    let courseIds = this.courses.filter(course => course.selected).map(course => course.courseId);

    if (!courseIds.length) {
      this.modal.create(
        this.locale.noCoursesSelectedWarningTitle,
        this.locale.noCoursesSelectedWarningMessage
      );
      return;
    }

    this.router.navigate(['/centigrade/shortlist/compare', { courseIds: courseIds }]);
  }

  goToCourse(course: ShortlistCourseSummary) {
    if (!course.active) {
      this.removeCourse(course);
    } else {
      this.router.navigate(['/centigrade/shortlist/detail', { courseId: course.courseId }]);
    }
  }

  removeShortlist(courseId: string) {
    for (var i = 0, len = this.courses.length; i < len; i++) {
      if (courseId == this.courses[i].courseId) {
        // placing this into the subscribe will not refresh courses but prints console message
        // Remove from courses object array using Angular .filter approach
        this.courses = this.courses.filter(item => item !== this.courses[i]); // *ngIf will refresh and updates courses
        this.researchService.removeCourseFromShortlist(courseId).subscribe(response => {
          // Do something
        });
      }
    }
  }

  // Not used???
  removeCourse(course: ShortlistCourseSummary) {
    this.researchService.removeCourseFromShortlist(course.courseId).subscribe(response => {
      this.update();
    });
  }

  goToInstitution(institution: ShortlistInstitutionSummary) {
    this.router.navigate([
      '/centigrade/shortlist/university-detail',
      { institutionId: institution.institutionId }
    ]);
  }

  switchType(type: string) {
    switch (type) {
      case 'courses':
        this.coursesActive = true;
        this.institutionsActive = false;
        break;
      case 'institutions':
        this.coursesActive = false;
        this.institutionsActive = true;
        break;
    }
  }
}
