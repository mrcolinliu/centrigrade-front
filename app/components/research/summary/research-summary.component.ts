import { Component, OnInit } from '@angular/core';
import { RouteBreadcrumbs } from '../../../services/routeBreadcrumbs.service';
import { Footer } from '../../../services/footer.service';
import { LocalisationService } from '../../../services/localisation.service';
import { ResearchIntroComponent } from '../intro/research-intro.component';
import { Breadcrumb } from '../../../models/_base/breadcrumb.model';
import {
  ResearchCourse,
  ResearchArea,
  UpdateResearchAreaLink
} from '../../../models/research/research.models';
import { ResearchService } from '../../../services/research.service';
import { ModalProvider } from '../../_shared/modal/modal.component';
import { DropdownItem } from '../../_shared/dropdown/dropdown.component';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-research-summary',
  templateUrl: './research-summary.component.html',
  styleUrls: ['./research-summary.component.scss']
})
export class ResearchSummaryComponent implements OnInit {
  static route = 'research/summary';
  static footerPath = 'shortlist';

  locale: any = {};

  courses: ResearchCourse[] = [];

  public formSubmitted: boolean = false;

  constructor(
    private routeBreadcrumbs: RouteBreadcrumbs,
    private footer: Footer,
    private localisation: LocalisationService,
    private researchService: ResearchService,
    private modal: ModalProvider,
    private router: Router
  ) {}

  ngOnInit() {
    this.locale = this.localisation.getTranslationsForComponent('ResearchSummaryComponent');

    let parentLocale: any = this.localisation.getTranslationsForComponent(
      'ResearchSummaryComponent'
    );

    this.footer.update({
      title: this.locale.footerText,
      action: ResearchSummaryComponent.footerPath
    });

    if (sessionStorage.getItem('research-intro-seen') == null) {
      sessionStorage.setItem('research-intro-seen', 'true');
      this.router.navigateByUrl('centigrade/research');
    }

    this.researchService.getResearchSummary().subscribe(result => {
      this.courses = result.courses;

      this.courses.forEach(course => {
        course.researchAreas.forEach(researchArea => {
          researchArea.noteControl = new FormControl();
          researchArea.noteControl.valueChanges.debounceTime(1000).subscribe(value => {
            this.onResearchAreaNoteChanged(value, researchArea, course.courseId, 'course');
          });
        });

        course.institution.researchAreas.forEach(researchArea => {
          researchArea.noteControl = new FormControl();
          researchArea.noteControl.valueChanges.debounceTime(1000).subscribe(value => {
            this.onResearchAreaNoteChanged(
              value,
              researchArea,
              course.institution.institutionId,
              'institution'
            );
          });
        });
      });
    });
  }

  setFormSubmitted(value) {
    this.formSubmitted = value;
  }

  updateResearchAreaLink(
    researchArea: ResearchArea,
    courseId: string,
    type: string,
    updateStatus: boolean = false
  ) {
    let model = new UpdateResearchAreaLink();
    this.setFormSubmitted(true);
    model.aid = researchArea.areaId;
    model.areaRating = researchArea.userRating == null ? 0 : researchArea.userRating;
    model.text = researchArea.userText == null ? '' : researchArea.userText;
    model.linkId = courseId;

    switch (type) {
      case 'course':
        this.researchService.addOrUpdateCourseLink(model).subscribe(e => {
          if (updateStatus) {
            researchArea.noteStatus = this.locale.notesUpdateLabelText;
          }
        });
        break;
      case 'institution':
        this.researchService.addOrUpdateInstitutionLink(model).subscribe(e => {
          if (updateStatus) {
            researchArea.noteStatus = this.locale.notesUpdateLabelText;
          }
        });
        break;
    }
    this.setFormSubmitted(false);
  }

  onResearchAreaRatingChanged(
    $event: number,
    researchArea: ResearchArea,
    linkId: string,
    type: string
  ) {
    researchArea.userRating = $event;

    this.updateResearchAreaLink(researchArea, linkId, type);
  }

  onResearchAreaNoteChanged(
    value: string,
    researchArea: ResearchArea,
    linkId: string,
    type: string
  ) {
    researchArea.noteStatus = this.locale.notesSavingLabelText;
    researchArea.userText = value;

    this.updateResearchAreaLink(researchArea, linkId, type, true);
  }

  goToCourse(id: string) {
    sessionStorage.setItem('navigatedFrom', 'research');
    this.router.navigateByUrl('/centigrade/courses/detail;courseId=' + id);
  }

  createRange(number) {
    let items: number[] = [];
    for (let i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }
}
