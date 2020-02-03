import { Component, OnInit } from '@angular/core';
import { RouteBreadcrumbs } from '../../../services/routeBreadcrumbs.service';
import { Footer } from '../../../services/footer.service';
import { LocalisationService } from '../../../services/localisation.service';
import { Breadcrumb } from '../../../models/_base/breadcrumb.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-research-intro',
  templateUrl: './research-intro.component.html',
  styleUrls: ['./research-intro.component.scss']
})
export class ResearchIntroComponent implements OnInit {
  static route = 'research';

  static footerPath: string = 'research/edit';

  locale: any = {};

  constructor(
    private router: Router,
    private routeBreadcrumbs: RouteBreadcrumbs,
    private footer: Footer,
    private localisation: LocalisationService
  ) {}

  ngOnInit() {
    this.locale = this.localisation.getTranslationsForComponent('ResearchIntroComponent');

    this.routeBreadcrumbs.breadcrumbs.next([new Breadcrumb(this.locale.breadcrumbText, null)]);

    this.footer.update({
      title: this.locale.footerText,
      action: ResearchIntroComponent.footerPath
    });
  }
}
