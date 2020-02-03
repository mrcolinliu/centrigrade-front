import { CourseListComponent } from './../../list/course-list.component';
import { CourseShortlistComponent } from './../../shortlist/course-shortlist.component';
import { GraphDataset } from 'app/models/_base/graphDataset.model';
import { DetailSection } from './../../../../models/courses/detailSection.model';
import { CourseDetail } from './../../../../models/courses/courseDetail.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Breadcrumb } from './../../../../models/_base/breadcrumb.model';
import { Column } from './../../../../models/_shared/column.model';
import { LoadingProvider } from './../../../_shared/loading-spinner/loading-spinner.component';
import { QuestionnaireService } from './../../../../services/questionnaire.service';
import { CourseService } from './../../../../services/course.service';
import { Footer } from './../../../../services/footer.service';
import { RouteBreadcrumbs } from './../../../../services/routeBreadcrumbs.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { LocalisationService } from '../../../../services/localisation.service';
import { RowColumnSorter } from '../../../../services/row-column-sorter.service';
import { IColumnSortable, Row } from '../../../../models/_shared/column.model';
import { FormControl } from '@angular/forms';
import { FooterOptions } from '../../../../services/footer.service';
import { ResearchService } from '../../../../services/research.service';
import { EntryRequirementsDetailSection } from '../../../../models/courses/detailSection.model';
import { ResearchArea, UpdateResearchAreaLink } from '../../../../models/research/research.models';
import { ResearchSummaryComponent } from 'app/components/research/summary/research-summary.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit, OnDestroy {
  public static route: string = 'courses/detail';
  public static shortlistRoute: string = 'shortlist/detail';

  locale: any = {};

  footerOptions: FooterOptions = null;
  footerActionSubscription: Subscription;

  courseId: string;
  course: CourseDetail = new CourseDetail();
  satisfactionColumns: Column = new Column();

  satisfactionSection: DetailSection;
  textSections: DetailSection[] = [];
  textSectionRows: Row<IColumnSortable>[] = [];
  feesSection: DetailSection;
  entrySection: EntryRequirementsDetailSection;

  researchAreas: ResearchArea[] = [];

  chartSection: DetailSection;
  graphReady: boolean = false;
  doughnutChartLabels: string[] = [];
  doughnutChartType: string = 'doughnut';
  datasets: GraphDataset[] = [];
  options: any = {};
  chartColors: any[] = ['#57BCBC', '#454F5D', '#C8CACC'];

  note: string = '';
  noteControl: FormControl = new FormControl();
  noteIsSaving: boolean = null;

  constructor(
    private routeBreadcrumbs: RouteBreadcrumbs,
    private footerService: Footer,
    private courseService: CourseService,
    private questionnaireService: QuestionnaireService,
    private spinner: LoadingProvider,
    private route: ActivatedRoute,
    private router: Router,
    private localisation: LocalisationService,
    private rowColSorter: RowColumnSorter,
    private researchService: ResearchService
  ) {}

  ngOnInit() {
    this.locale = this.localisation.getTranslationsForComponent('CourseDetailComponent');

    let parentLocale = this.localisation.getTranslationsForComponent('CourseListComponent') as any;

    if (sessionStorage.getItem('navigatedFrom') == 'shortlist') {
      this.routeBreadcrumbs.breadcrumbs.next([
        new Breadcrumb('Shortlist', CourseShortlistComponent.route),
        new Breadcrumb(this.locale.breadcrumbText, null)
      ]);
      this.footerOptions = {
        title: this.locale.footerText,
        checkbox: true,
        action: '/centigrade/shortlist',
        helpText: 'Click here to shortlist this course'
      };
    } else if (sessionStorage.getItem('navigatedFrom') == 'courses') {
      this.routeBreadcrumbs.breadcrumbs.next([
        new Breadcrumb(parentLocale.breadcrumbText, CourseListComponent.route),
        new Breadcrumb(this.locale.breadcrumbText, null)
      ]);
      this.footerOptions = {
        title: this.locale.footerText,
        checkbox: true,
        action: '/centigrade/courses',
        helpText: 'Click here to shortlist this course'
      };
    } else if (sessionStorage.getItem('navigatedFrom') == 'research') {
      this.routeBreadcrumbs.breadcrumbs.next([
        new Breadcrumb('Research', ResearchSummaryComponent.route),
        new Breadcrumb(this.locale.breadcrumbText, null)
      ]);
      this.footerOptions = {
        title: this.locale.footerText,
        checkbox: true,
        action: '/centigrade/research/summary',
        helpText: 'Click here to shortlist this course'
      };
    }

    this.footerService.update(this.footerOptions);

    this.footerActionSubscription = this.footerService.onActionClicked.subscribe(() => {
      this.toggleShortlisted();
    });

    this.route.params.subscribe(params => {
      this.courseId = params['courseId'];

      this.courseService.getCourseDetail(this.courseId).subscribe(
        response => {
          this.course = response;

          this.footerOptions.checked = this.course.shortlisted;
          this.footerService.update(this.footerOptions);

          this.textSections = this.course.section.filter(sec => sec.type == 'DTYPE_TEXT');
          this.textSectionRows = this.rowColSorter.sortDynamic(this.textSections);
          this.satisfactionSection = this.course.section.find(
            sec => sec.type == 'DTYPE_SATISFACTION'
          );
          this.chartSection = this.course.section.find(sec => sec.type == 'DTYPE_OPPORTUNITIES');
          this.feesSection = this.course.section.find(sec => sec.type == 'DTYPE_FEES');

          this.entrySection = this.course.section.find(
            sec => sec.type == 'DTYPE_ENTRY'
          ) as EntryRequirementsDetailSection;

          this.researchAreas = this.course.researchAreas;

          this.researchAreas.forEach(researchArea => {
            researchArea.noteControl = new FormControl();
            researchArea.noteControl.valueChanges.debounceTime(1000).subscribe(value => {
              researchArea.noteIsSaving = true;
              this.onResearchAreaNoteChanged(value, researchArea);
            });
          });

          this.note = this.course.note;

          this.noteControl.valueChanges.debounceTime(1000).subscribe((text: string) => {
            if (text != '') {
              this.noteIsSaving = true;
              this.researchService
                .updateCourseNote(this.course.courseId, text)
                .subscribe(response => {
                  this.noteIsSaving = false;
                });
            }
          });

          if (this.satisfactionSection) {
            this.satisfactionSection.data.forEach((datum, index) => {
              if (index % 2 == 0) {
                this.satisfactionColumns.left.push(datum);
              } else {
                this.satisfactionColumns.right.push(datum);
              }
            });
          }

          if (this.chartSection) this.generateChart();
        },
        err => {}
      );
    });
  }

  ngOnDestroy() {
    this.footerActionSubscription.unsubscribe();
  }

  generateChart() {
    this.options = {
      title: {
        display: false
      },
      tooltips: {
        callbacks: {
          //This adds the percentage sign to the labels.
          label: function(tooltipItem, data) {
            //get the concerned dataset
            var dataset = data.datasets[tooltipItem.datasetIndex];

            //get the current items value
            var currentValue = dataset.data[tooltipItem.index];
            var currentLabel = dataset.label[tooltipItem.index];
            return currentLabel + ': ' + currentValue + '%';
          }
        }
      }
    };

    let values: number[] = [];
    let labels: string[] = [];

    this.chartSection.data.forEach(data => {
      values.push(data.value);
      labels.push(data.key);
    });

    this.doughnutChartLabels = labels;
    this.datasets = [new GraphDataset(values, labels, this.chartColors, this.chartColors)];

    //Flag to say graph is ready to be shown.
    this.graphReady = true;
  }

  chartClicked(e: any): void {
    //console.log(e);
  }

  chartHovered(e: any): void {
    //console.log(e);
  }

  toggleShortlisted() {
    if (this.course.shortlisted) {
      this.researchService.removeCourseFromShortlist(this.course.courseId).subscribe(res => {
        this.footerOptions.checked = false;
        this.course.shortlisted = false;
        this.footerService.update(this.footerOptions);
      });
    } else {
      this.researchService.addCourseToShortlist(this.course.courseId).subscribe(res => {
        this.footerOptions.checked = true;
        this.course.shortlisted = true;
        this.footerService.update(this.footerOptions);
      });
    }
  }

  onRatingChanged($event: number) {
    // if user has entered zero stars, delete the rating
    if ($event == 0) {
      this.researchService.deleteCourseRating(this.course.courseId).subscribe(result => {
        this.course.userRating = $event;
      });
      // else set the rating
    } else {
      this.researchService.rateCourse(this.course.courseId, $event).subscribe(result => {
        this.course.userRating = $event;
      });
    }
  }

  updateResearchAreaLink(researchArea: ResearchArea) {
    let model = new UpdateResearchAreaLink();
    model.aid = researchArea.areaId;
    model.areaRating = researchArea.userRating == null ? 0 : researchArea.userRating;
    model.text = researchArea.userText == null ? '' : researchArea.userText;
    model.linkId = this.course.courseId;

    this.researchService.addOrUpdateCourseLink(model).subscribe(result => {
      researchArea.noteIsSaving = false;
    });
  }

  onResearchAreaRatingChanged($event: number, researchArea: ResearchArea) {
    researchArea.userRating = $event;

    this.updateResearchAreaLink(researchArea);
  }

  onResearchAreaNoteChanged(value: string, researchArea: ResearchArea) {
    researchArea.userText = value;

    this.updateResearchAreaLink(researchArea);
  }
}
