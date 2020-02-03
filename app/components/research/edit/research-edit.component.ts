import { Component, OnInit } from '@angular/core';
import { RouteBreadcrumbs } from '../../../services/routeBreadcrumbs.service';
import { Footer } from '../../../services/footer.service';
import { LocalisationService } from '../../../services/localisation.service';
import { ResearchSummaryComponent } from '../summary/research-summary.component';
import { Breadcrumb } from '../../../models/_base/breadcrumb.model';
import {
  ResearchAreaSummary,
  ResearchAreaType,
  ResearchArea
} from '../../../models/research/research.models';
import { ResearchService } from '../../../services/research.service';
import { ModalProvider } from '../../_shared/modal/modal.component';
import { DropdownItem } from '../../_shared/dropdown/dropdown.component';

@Component({
  selector: 'app-research-edit',
  templateUrl: './research-edit.component.html',
  styleUrls: ['./research-edit.component.scss'],
  host: {
    '(document:click)': 'documentClicked($event)'
  }
})
export class ResearchEditComponent implements OnInit {
  static route = 'research/edit';
  static footerPath = 'research/summary';

  locale: any = {};

  newAreaText: string = '';

  researchAreas: ResearchAreaSummary[] = [];
  deletingResearchAreas: ResearchAreaSummary[] = [];
  defaultOptions: ResearchAreaSummary[] = [];
  defaultOptionsDropdown: ResearchAreaSummary[] = [];
  showSuggestions: boolean = false;
  type: ResearchAreaType = 'course';
  pipeRefreshToken: number = 0;
  public formSubmitted: boolean = false;

  constructor(
    private routeBreadcrumbs: RouteBreadcrumbs,
    private footer: Footer,
    private localisation: LocalisationService,
    private researchService: ResearchService,
    private modal: ModalProvider
  ) {}

  ngOnInit() {
    this.locale = this.localisation.getTranslationsForComponent('ResearchEditComponent');

    let parentLocale: any = this.localisation.getTranslationsForComponent('ResearchIntroComponent');

    this.routeBreadcrumbs.breadcrumbs.next([
      new Breadcrumb(parentLocale.breadcrumbText, ResearchSummaryComponent.route),
      new Breadcrumb(this.locale.breadcrumbText, null)
    ]);

    this.footer.update({
      title: this.locale.footerText,
      action: ResearchEditComponent.footerPath
    });

    this.researchService.getResearchAreas().subscribe(result => {
      this.researchAreas = result.researchArea;
    });

    this.researchService.getDefaultResearchAreas().subscribe(result => {
      this.defaultOptions = result;
      this.changeType('course');
    });
  }

  setFormSubmitted(value) {
    this.formSubmitted = value;
  }

  changeType(type: ResearchAreaType) {
    this.type = type;
    this.newAreaText = '';
    this.defaultOptionsDropdown = this.defaultOptions.filter(e => e.type == type);
  }

  toggleSuggestions() {
    this.showSuggestions = !this.showSuggestions;
  }

  addSuggestion(option: ResearchAreaSummary) {
    this.newAreaText = option.text;
    this.showSuggestions = false;
  }

  addResearchArea() {
    this.setFormSubmitted(true);

    if (!this.newAreaText.trim().length) {
      this.setFormSubmitted(false);
      this.newAreaText = '';
      return;
    }

    if (this.researchAreas.some(e => e.text == this.newAreaText && e.type == this.type)) {
      this.setFormSubmitted(false);
      this.newAreaText = '';
      this.modal.create(this.locale.alreadyExistsModalTitle, this.locale.alreadyExistsModalMessage);
      return;
    }

    let model = new ResearchAreaSummary();

    model.text = this.newAreaText;
    model.type = this.type;

    this.researchService.addOrUpdateResearchArea(model).subscribe(result => {
      this.setFormSubmitted(false);
      this.newAreaText = '';
      this.researchAreas.push(result);
      this.pipeRefreshToken++;
    });
  }

  removeResearchArea(researchArea: ResearchAreaSummary) {
    this.setFormSubmitted(true);
    if (!this.deletingResearchAreas.some(e => e.id == researchArea.id)) {
      this.deletingResearchAreas.push(researchArea);

      this.researchService.deleteResearchArea(researchArea.id).subscribe(result => {
        if (this.researchAreas.some(e => e.id == researchArea.id)) {
          let index = this.researchAreas.indexOf(researchArea);
          this.researchAreas.splice(index, 1);
          this.pipeRefreshToken++;
        }
      });
    }
    this.setFormSubmitted(false);
  }

  documentClicked($event: any) {
    var path = $event.path || this.getPath($event);
    if (!!path && (path as any[]).some(obj => obj.className == 'suggestions-container')) return;

    this.showSuggestions = false;
  }

  private getPath($event: any) {
    var path = [];
    var currentElem = $event.target;
    while (currentElem) {
      path.push(currentElem);
      currentElem = currentElem.parentElement;
    }
    if (path.indexOf(window) === -1 && path.indexOf(document) === -1) path.push(document);
    if (path.indexOf(window) === -1) path.push(window);
    return path;
  }
}
