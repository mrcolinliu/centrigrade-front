import { CourseListComponent } from './../../list/course-list.component';
import { CourseShortlistComponent } from './../../shortlist/course-shortlist.component';
import { InstitutionDetail } from './../../../../models/courses/institutionDetail.model';
import { DetailSection } from './../../../../models/courses/detailSection.model';
import { CourseDetail } from './../../../../models/courses/courseDetail.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Breadcrumb } from './../../../../models/_base/breadcrumb.model';
import { LoadingProvider } from './../../../_shared/loading-spinner/loading-spinner.component';
import { QuestionnaireService } from './../../../../services/questionnaire.service';
import { CourseService } from './../../../../services/course.service';
import { Footer } from './../../../../services/footer.service';
import { RouteBreadcrumbs } from './../../../../services/routeBreadcrumbs.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';
import { LocalisationService } from '../../../../services/localisation.service';
import { RowColumnSorter } from '../../../../services/row-column-sorter.service';
import { Row, IColumnSortable } from '../../../../models/_shared/column.model';
import { ResearchService } from '../../../../services/research.service';
import { ResearchArea, UpdateResearchAreaLink } from '../../../../models/research/research.models';

@Component({
  selector: 'app-university-detail',
  templateUrl: './university-detail.component.html',
  styleUrls: ['./university-detail.component.scss']
})
export class UniversityDetailComponent implements OnInit {
  public static route: string = 'courses/university-detail';
  public static shortlistRoute: string = 'shortlist/university-detail';

  locale: any = {};

  institutionId: string;
  institute: InstitutionDetail = new InstitutionDetail();

  tefIcon: string;

  overview: DetailSection;
  textSections: DetailSection[] = [];
  textSectionRows: Row<IColumnSortable>[] = [];

  locationSection: DetailSection = new DetailSection();
  feeSection: DetailSection = new DetailSection();

  researchAreas: ResearchArea[] = [];

  zoom: number = 7;

  note: string = '';
  noteControl: FormControl = new FormControl();
  noteIsSaving: boolean = null;

  constructor(
    private routeBreadcrumbs: RouteBreadcrumbs,
    private footerService: Footer,
    private courseService: CourseService,
    private questionnaireService: QuestionnaireService,
    private researchService: ResearchService,
    private spinner: LoadingProvider,
    private route: ActivatedRoute,
    private router: Router,
    private localisation: LocalisationService,
    private rowColSorter: RowColumnSorter
  ) {}

  ngOnInit() {
    this.locale = this.localisation.getTranslationsForComponent('UniversityDetailComponent');

    let parentLocale = this.localisation.getTranslationsForComponent('CourseListComponent') as any;

    if (sessionStorage.getItem('navigatedFrom') == 'shortlist') {
      this.routeBreadcrumbs.breadcrumbs.next([
        new Breadcrumb('Shortlist', CourseShortlistComponent.route),
        new Breadcrumb(this.locale.breadcrumbText, null)
      ]);
    } else {
      this.routeBreadcrumbs.breadcrumbs.next([
        new Breadcrumb(parentLocale.breadcrumbText, CourseListComponent.route),
        new Breadcrumb(this.locale.breadcrumbText, null)
      ]);
    }

    if (sessionStorage.getItem('navigatedFrom') == 'courses') {
      this.footerService.update({
        title: this.locale.coursesfooterText,
        action: 'courses'
      });
    } else {
      this.footerService.update({
        title: this.locale.shortlistfooterText,
        action: 'shortlist'
      });
    }

    this.route.params.subscribe(params => {
      this.institutionId = params['institutionId'];

      this.courseService.getInstitutionDetail(this.institutionId).subscribe(
        response => {
          this.institute = response;

          this.textSections = this.institute.section.filter(ins => ins.type == 'DTYPE_TEXT');
          this.textSectionRows = this.rowColSorter.sortDynamic(this.textSections);
          this.locationSection = this.institute.section.find(ins => ins.type == 'DTYPE_LOCATION');
          this.feeSection = this.institute.section.find(ins => ins.type == 'DTYPE_FEES');

          this.researchAreas = this.institute.researchAreas;

          this.overview = this.institute.section.find(ins => ins.type == 'DTYPE_OVERVIEW');

          this.tefIcon = (<any>this.overview).tefIcon;

          this.researchAreas.forEach(researchArea => {
            researchArea.noteControl = new FormControl();
            researchArea.noteControl.valueChanges.debounceTime(1000).subscribe(value => {
              if (value != '') {
                this.onResearchAreaNoteChanged(value, researchArea);
              }
            });
          });

          this.note = this.institute.note;

          this.noteControl.valueChanges.debounceTime(1000).subscribe((text: string) => {
            if (text != '') {
              this.noteIsSaving = true;
              this.researchService
                .updateInstitutionNote(this.institutionId, text)
                .subscribe(response => {
                  this.noteIsSaving = false;
                });
            }
          });
        },
        err => {
          this.router.navigateByUrl('error');
        }
      );
    });
  }

  updateResearchAreaLink(researchArea: ResearchArea) {
    let model = new UpdateResearchAreaLink();
    model.aid = researchArea.areaId;
    model.areaRating = researchArea.userRating;
    model.text = researchArea.userText;
    model.linkId = this.institute.institutionId;

    this.researchService.addOrUpdateInstitutionLink(model).subscribe();
  }

  onResearchAreaRatingChanged($event: number, researchArea: ResearchArea) {
    researchArea.userRating = $event;

    this.updateResearchAreaLink(researchArea);
  }

  onResearchAreaNoteChanged(value: string, researchArea: ResearchArea) {
    researchArea.userText = value;

    this.updateResearchAreaLink(researchArea);
  }

  goToUniWebsite() {
    window.open(
      (this.institute.website.includes('http') ? '' : 'http://') + this.institute.website,
      '_blank'
    );
  }
}
