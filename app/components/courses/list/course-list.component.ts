import { ActivatedRoute, Router } from '@angular/router';
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
import { OrderByPipe } from '../../../pipes/_shared/order-by.pipe';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {
  public static route: string = 'courses';
  public static footerPath: string = 'research/summary';

  locale: any = {};

  result: CourseListResponse = new CourseListResponse();
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  filters: FilterModel[] = [];
  courseLengthText: string = this.courses.length.toString();
  courseTypeText: string = '';
  courseCount: number = 0;
  shortlistedCount: number = 0;
  searchTerm: string = '';
  selectedSortOrder: SortOrder = new SortOrder();
  sortOrderItems: DropdownItem<SortOrder>[] = [];
  query: SecondaryCourseFilterRequest = new SecondaryCourseFilterRequest();

  fallbackCount: string;
  solidCount: string;
  ambitiousCount: string;

  title: string = '';
  subtitle: string = '';

  showAppliedFilters = true;
  activeTabIndex: number = 2;
  public disableClick: boolean = false;

  constructor(
    private routeBreadcrumbs: RouteBreadcrumbs,
    private route: ActivatedRoute,
    private footerService: Footer,
    private courseService: CourseService,
    private researchService: ResearchService,
    private loading: LoadingProvider,
    private localisation: LocalisationService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.locale = this.localisation.getTranslationsForComponent('CourseListComponent');
    this.routeBreadcrumbs.breadcrumbs.next([new Breadcrumb(this.locale.breadcrumbText, null)]);

    this.footerService.update({
      title: this.locale.footerText,
      action: CourseListComponent.footerPath
    });

    this.loading.show(this.locale.loadingText, true);

    if (sessionStorage.getItem('courses-intro-seen') == null) {
      sessionStorage.setItem('courses-intro-seen', 'true');
      history.replaceState({}, 'Centigrade', '/#/centigrade/course-area-filters');
      this.router.navigateByUrl('centigrade/courses/intro');
      return;
    }

    if (sessionStorage.getItem('searchTerm'))
      this.searchTerm = sessionStorage.getItem('searchTerm');

    if (sessionStorage.getItem('searchSortOrder'))
      this.selectedSortOrder = JSON.parse(sessionStorage.getItem('searchSortOrder'));

    if (sessionStorage.getItem('searchActiveTab'))
      this.activeTabIndex = JSON.parse(sessionStorage.getItem('searchActiveTab'));

    this.search(this.searchTerm == null || this.searchTerm == '');
  }

  setFormSubmitted(value) {
    this.disableClick = value;
  }

  ngOnDestroy() {
    sessionStorage.setItem('searchTerm', this.searchTerm);
    sessionStorage.setItem('searchSortOrder', JSON.stringify(this.selectedSortOrder));
    sessionStorage.setItem('searchActiveTab', JSON.stringify(this.activeTabIndex));

    sessionStorage.setItem('navigatedFrom', 'courses');
  }

  addSafeImage(cards) {
    for (var i = 0, len = cards.length; i < len; i++) {
      cards[i].safeImage = this.sanitizer.bypassSecurityTrustStyle(`url(${cards[i].image})`);
    }
  }

  search(initital: boolean = false) {
    this.loading.show(this.locale.loadingText, true);

    if (!initital) {
      this.query.order = this.selectedSortOrder;
      this.query.searchText = this.searchTerm;
    }

    this.query.splitFilter = 'FTYPE_TARIFF';
    this.courseService.getCoursesBySecondaryFilters(this.query).subscribe(response => {
      this.result = response;

      this.title = response.pageTitle;
      this.subtitle = response.pageText;

      this.courseLengthText = this.courseTotal().toString();

      this.updateShortlistedCount();

      this.sortOrderItems = this.getSortOrderOptions(response.order);
      this.selectedSortOrder = response.order.find(order => order.directions.some(d => d.selected));

      this.filters = this.getActiveFilters(response.filters);

      this.query = new SecondaryCourseFilterRequest();
      this.query.filters = response.filters;
      this.query.order = this.selectedSortOrder;
      this.query.searchText = this.searchTerm;

      this.fallbackCount = this.result.lowerCount.toString();
      this.solidCount = this.result.count.toString();
      this.ambitiousCount = this.result.upperCount.toString();

      this.courseCount = this.courseTotal();
      this.updateShortlistedCount();

      this.updateCategory(null);

      this.loading.hide();
    });
  }

  courseTotal(): number {
    return this.result.lower.length + this.result.data.length + this.result.upper.length;
  }

  searchTermUpdate() {
    if (this.searchTerm.length > 2) {
      this.filteredCourses = this.courses.filter(e =>
        (e.courseName.toLowerCase() + ' ' + e.institutionName.toLowerCase()).includes(
          this.searchTerm.toLowerCase()
        )
      );
    } else {
      this.filteredCourses = this.courses;

      // Need to add to an array
      // this.filteredCourses.safeImage = this.sanitizer.bypassSecurityTrustStyle(
      //   `url(${this.filteredCourses.image})`
      // );
    }
  }

  onSortChanged(item: DropdownItem<SortOrder>) {
    item.data.directions.forEach(dir => (dir.selected = false));
    item.data.directions.find(dir => dir.direction == item.direction).selected = true;

    this.selectedSortOrder = item.data;
    this.search();
  }

  toggleShortlist(course: Course) {
    this.setFormSubmitted(true);
    if (course.shortlisted) {
      this.researchService.removeCourseFromShortlist(course.id).subscribe(res => {
        this.changeShortlistState(course);
      });
    } else {
      this.researchService.addCourseToShortlist(course.id).subscribe(res => {
        this.changeShortlistState(course);
      });
    }
    this.setFormSubmitted(false);
  }

  showHideAppliedFilters() {
    this.showAppliedFilters = !this.showAppliedFilters;
  }

  removeFilter(id: number, optionId: number) {
    let filter = this.query.filters.find(f => f.id == id);

    filter.completed = false;

    filter.options.forEach(option => {
      if (option.id == optionId) {
        option.selected = false;
      } else if (option.selected) {
        filter.completed = true;
      }
    });

    this.search();
  }

  private changeShortlistState(course: Course) {
    course.shortlisted = !course.shortlisted;
    this.updateShortlistedCount();
  }

  private updateShortlistedCount() {
    this.shortlistedCount = this.courses.filter(course => course.shortlisted).length;
  }

  private getSortOrderOptions(order: SortOrder[]): DropdownItem<SortOrder>[] {
    let sortOrderItems: DropdownItem<SortOrder>[] = [];

    order.forEach(order => {
      order.directions.forEach(direction => {
        let label = `${order.orderName} (${direction.direction})`;
        sortOrderItems.push(
          new DropdownItem<SortOrder>(label, direction.direction, order, direction.selected)
        );
      });
    });

    return sortOrderItems;
  }

  private getActiveFilters(filters: CourseFilter[]): FilterModel[] {
    filters = filters.filter(f => f.completed);
    let result = new Array();
    filters.forEach(filter => {
      filter.options.forEach(option => {
        if (option.selected) {
          result.push({ id: filter.id, optionId: option.id, text: option.values[0].value });
        }
      });
    });

    return result;
  }

  public onCategoryChange($event: any) {
    let selection = +$event.target.value;
    this.updateCategory(selection);
  }

  private updateCategory(selection: number | null) {
    if (selection !== null) {
      this.activeTabIndex = selection;
    }

    switch (this.activeTabIndex) {
      case 0: {
        this.courses = this.result.lower.concat(this.result.data).concat(this.result.upper);
        break;
      }
      case 1: {
        this.courses = this.result.lower;
        break;
      }
      case 2: {
        this.courses = this.result.data;
        break;
      }
      case 3: {
        this.courses = this.result.upper;
        break;
      }
    }
    this.addSafeImage(this.courses); //sanitizer for bg image XSS

    this.searchTermUpdate();
  }

  createRange(number) {
    let items: number[] = [];
    for (let i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }
}

class FilterModel {
  id: number;
  optionId: number;
  text: string;
}
