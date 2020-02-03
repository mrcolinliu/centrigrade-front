import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from './../../../models/_base/breadcrumb.model';
import { Component, OnInit } from '@angular/core';
import { Course } from './../../../models/courses/course.model';
import { CourseFilter } from '../../../models/courses/filter.model';
import { CourseListResponse } from './../../../models/courses/courseListResponse.model';
import { CourseService } from './../../../services/course.service';
import { DropdownItem } from '../../_shared/dropdown/dropdown.component';
import { FilterOption } from '../../../models/courses/filterOption.model';
import { Footer } from './../../../services/footer.service';
import { LoadingProvider } from './../../_shared/loading-spinner/loading-spinner.component';
import { LocalisationService } from '../../../services/localisation.service';
import { ResearchService } from '../../../services/research.service';
import { RouteBreadcrumbs } from './../../../services/routeBreadcrumbs.service';
import { SecondaryCourseFilterRequest } from '../../../models/courses/filterRequest.secondary.model';
import { SortOrder } from '../../../models/_shared/sortOrder';

@Component({
  selector: 'app-course-intro',
  templateUrl: './course-intro.component.html',
  styleUrls: ['./course-intro.component.scss']
})
export class CourseIntroComponent implements OnInit {
  public static route: string = 'courses/intro';
  public static footerPath: string = 'courses';

  locale: any = {};

  result: CourseListResponse = new CourseListResponse();
  courses: Course[] = [];
  courseCount: number = 0;
  query: SecondaryCourseFilterRequest = new SecondaryCourseFilterRequest();

  constructor(
    private routeBreadcrumbs: RouteBreadcrumbs,
    private route: ActivatedRoute,
    private footerService: Footer,
    private courseService: CourseService,
    private loading: LoadingProvider,
    private localisation: LocalisationService
  ) {}

  ngOnInit() {
    this.locale = this.localisation.getTranslationsForComponent('CourseIntroComponent');
    this.routeBreadcrumbs.breadcrumbs.next([
      new Breadcrumb(this.locale.breadcrumbText, 'course-area-filters')
    ]);

    this.footerService.update({
      title: this.locale.footerText,
      action: CourseIntroComponent.footerPath
    });

    this.query.splitFilter = 'FTYPE_TARIFF';

    this.courseService.getCoursesBySecondaryFilters(this.query).subscribe(result => {
      this.courseCount = result.total;
      this.loading.hide();
    });
  }

  createRange(number) {
    var items: number[] = [];
    for (var i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }
}
