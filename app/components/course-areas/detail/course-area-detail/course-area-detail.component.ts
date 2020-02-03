import { RowColumnSorter } from './../../../../services/row-column-sorter.service';
import { Column, Row } from './../../../../models/_shared/column.model';
import { Breadcrumb } from './../../../../models/_base/breadcrumb.model';
import { CourseAreaListComponent } from './../../list/course-area-list/course-area-list.component';
import { Footer } from './../../../../services/footer.service';
import { Component, OnInit, Input } from '@angular/core';
import { CourseService } from './../../../../services/course.service';
import { RouteBreadcrumbs } from './../../../../services/routeBreadcrumbs.service';
import { CourseAreaDetail } from './../../../../models/courses/courseAreaDetail.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailSection } from './../../../../models/courses/detailSection.model';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { GraphDataset } from 'app/models/_base/graphDataset.model';
import { LocalisationService } from '../../../../services/localisation.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-course-area-detail',
  templateUrl: './course-area-detail.component.html',
  styleUrls: ['./course-area-detail.component.scss']
})
export class CourseAreaDetailComponent implements OnInit {
  public static route: string = 'course-areas/detail/:id';
  public static footerPath: string = CourseAreaListComponent.route;

  locale: any = {};

  id: number;

  details: CourseAreaDetail;
  matchSection: DetailSection = new DetailSection();
  chartSection: DetailSection;
  textSections: DetailSection[];
  textSectionRows: Row<DetailSection>[] = [];

  graphReady: boolean = false;
  doughnutChartLabels: string[] = [];
  doughnutChartType: string = 'doughnut';
  datasets: GraphDataset[] = [];
  options: any = {};
  chartColors: any[] = ['#57BCBC', '#454F5D', '#C8CACC'];
  public formSubmitted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private routeBreadcrumbs: RouteBreadcrumbs,
    private localisation: LocalisationService,
    private courseService: CourseService,
    private footerService: Footer,
    private rowColumnSorter: RowColumnSorter,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.locale = this.localisation.getTranslationsForComponent('CourseAreaDetailComponent');

    let parentLocale = this.localisation.getTranslationsForComponent(
      'CourseAreaListComponent'
    ) as any;

    this.routeBreadcrumbs.breadcrumbs.next([
      new Breadcrumb(parentLocale.breadcrumbText, CourseAreaListComponent.route),
      new Breadcrumb(this.locale.breadcrumbText, null)
    ]);

    this.footerService.update({
      title: this.locale.footerText,
      action: CourseAreaDetailComponent.footerPath
    });

    this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.courseService.getCourseAreaDetail(this.id).subscribe(
        details => {
          this.details = details;

          this.details.safeImage = this.sanitizer.bypassSecurityTrustStyle(
            `url(${this.details.image})`
          );

          this.routeBreadcrumbs.breadcrumbs.next([
            new Breadcrumb(parentLocale.breadcrumbText, CourseAreaListComponent.route),
            new Breadcrumb(details.title, null)
          ]);

          this.matchSection = this.details.sections.find(sec => sec.type == 'DTYPE_MATCH');
          this.textSections = this.details.sections.filter(sec => sec.type == 'DTYPE_TEXT');
          this.chartSection = this.details.sections.find(sec => sec.type == 'DTYPE_PIE');

          if (this.textSections.length) {
            this.textSectionRows = this.rowColumnSorter.sortDynamic<DetailSection>(
              this.textSections
            );
          }

          if (this.chartSection) this.generateChart();
        },
        err => {}
      );
    });
  }

  setFormSubmitted(value) {
    this.formSubmitted = value;
  }

  toggleSelected(): void {
    this.details.selected = !this.details.selected;
    this.setFormSubmitted(true);
    if (this.details.selected) {
      this.courseService.selectCourseArea(this.details.id).subscribe(result => {});
    } else {
      this.courseService.deselectCourseArea(this.details.id).subscribe(result => {});
    }
    this.setFormSubmitted(false);
  }

  generateChart() {
    this.options = {
      title: {
        text: this.chartSection.keyHeader
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

  chartClicked(e: any): void {}

  chartHovered(e: any): void {}
}
