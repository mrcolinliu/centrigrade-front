import { Component, OnInit } from '@angular/core';
import { Breadcrumb } from '../../../models/_base/breadcrumb.model';
import { RouteBreadcrumbs } from '../../../services/routeBreadcrumbs.service';
import { Footer } from '../../../services/footer.service';
import { ExportComponent } from '../export/export.component';
import { LocalisationService } from '../../../services/localisation.service';
import { ResearchService } from '../../../services/research.service';
import { FinalisedShortlistCourse } from '../../../models/research/research.models';

@Component({
  selector: 'app-finalise-list',
  templateUrl: './finalise-list.component.html',
  styleUrls: ['./finalise-list.component.scss']
})
export class FinaliseListComponent implements OnInit {
  static route: string = 'finalise';

  locale: any = {};
  detailed: boolean = false;
  courses: FinalisedShortlistCourse[] = [];

  constructor(
    private routeBreadcrumbs: RouteBreadcrumbs,
    private footer: Footer,
    private localisation: LocalisationService,
    private researchService: ResearchService
  ) {}

  ngOnInit() {
    this.locale = this.localisation.getTranslationsForComponent('FinaliseListComponent');

    this.routeBreadcrumbs.breadcrumbs.next([new Breadcrumb(this.locale.breadcrumbText, null)]);

    this.footer.update({
      action: ExportComponent.route,
      title: this.locale.footerText,
      helpText: this.locale.overlayFooterText
    });

    this.researchService.getFinalisedList().subscribe(result => {
      this.courses = result.courses;
    });
  }
}
