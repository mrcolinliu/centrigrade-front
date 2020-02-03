import { Component, OnInit } from '@angular/core';
import { RouteBreadcrumbs } from '../../../services/routeBreadcrumbs.service';
import { Footer } from '../../../services/footer.service';
import { LocalisationService } from '../../../services/localisation.service';
import { Breadcrumb } from '../../../models/_base/breadcrumb.model';
import { ResearchIntroComponent } from '../intro/research-intro.component';
import { ResearchService } from '../../../services/research.service';
import {
  ResearchArea,
  ResearchAreasResponse,
  ResearchAreaSummary,
  ResearchAreaType
} from '../../../models/research/research.models';
import { ModalProvider } from '../../_shared/modal/modal.component';

@Component({
  selector: 'app-research-course',
  templateUrl: './research-course.component.html',
  styleUrls: ['./research-course.component.scss']
})
export class ResearchCourseComponent implements OnInit {
  static route = 'research/course';

  locale: any = {};

  newAreaText: string = '';

  researchAreas: ResearchAreaSummary[] = [];
  otherAreas: ResearchAreaSummary[] = [];
  deletingResearchAreas: ResearchAreaSummary[] = [];
  defaultOptions: ResearchAreaSummary[] = [];

  private type: ResearchAreaType = 'course';
  public formSubmitted: boolean = false;

  constructor(
    private routeBreadcrumbs: RouteBreadcrumbs,
    private footer: Footer,
    private localisation: LocalisationService,
    private researchService: ResearchService,
    private modal: ModalProvider
  ) {}

  ngOnInit() {
    this.locale = this.localisation.getTranslationsForComponent('ResearchCourseComponent');

    let parentLocale: any = this.localisation.getTranslationsForComponent('ResearchIntroComponent');

    this.routeBreadcrumbs.breadcrumbs.next([
      new Breadcrumb(parentLocale.breadcrumbText, ResearchIntroComponent.route),
      new Breadcrumb(this.locale.breadcrumbText, null)
    ]);

    this.footer.update(null);

    this.researchService.getResearchAreas().subscribe(result => {
      this.researchAreas = result.researchArea.filter(area => area.type == this.type);
      this.otherAreas = result.researchArea.filter(area => area.type != this.type);
    });

    this.researchService.getDefaultResearchAreas().subscribe(result => {
      this.defaultOptions = result.filter(e => e.type == this.type);
    });
  }

  setFormSubmitted(value) {
    this.formSubmitted = value;
  }

  addSuggestion(option: ResearchAreaSummary) {
    if (this.areaExists(option)) {
      this.removeResearchArea(this.researchAreas.find(e => e.text == option.text));
    } else {
      this.addResearchArea(option.text);
    }
  }

  areaExists(option: ResearchAreaSummary) {
    return this.researchAreas.some(e => e.text == option.text);
  }

  addResearchArea(text: string) {
    this.setFormSubmitted(true);

    if (this.researchAreas.some(e => e.text == text) || this.otherAreas.some(e => e.text == text)) {
      this.setFormSubmitted(false);
      this.modal.create(this.locale.alreadyExistsModalTitle, this.locale.alreadyExistsModalMessage);
      return;
    }

    let model = new ResearchAreaSummary();

    model.text = text;
    model.type = this.type;

    this.researchService.addOrUpdateResearchArea(model).subscribe(result => {
      this.setFormSubmitted(false);
      this.newAreaText = '';
      this.researchAreas.push(result);
    });
  }

  addResearchAreaFromText() {
    if (!this.newAreaText.trim().length) {
      this.newAreaText = '';
      return;
    }

    if (this.addResearchArea(this.newAreaText)) {
      this.newAreaText = '';
    }
  }

  removeResearchArea(researchArea: ResearchAreaSummary) {
    this.setFormSubmitted(true);

    if (!this.deletingResearchAreas.some(e => e.id == researchArea.id)) {
      this.deletingResearchAreas.push(researchArea);

      this.researchService.deleteResearchArea(researchArea.id).subscribe(result => {
        if (this.researchAreas.some(e => e.id == researchArea.id)) {
          let index = this.researchAreas.indexOf(researchArea);
          this.researchAreas.splice(index, 1);
        }
      });
    }
    this.setFormSubmitted(false);
  }
}
