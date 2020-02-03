import { Component, OnInit } from '@angular/core';
import { Breadcrumb } from '../../../models/_base/breadcrumb.model';
import { RouteBreadcrumbs } from '../../../services/routeBreadcrumbs.service';
import { Footer } from '../../../services/footer.service';
import { LocalisationService } from '../../../services/localisation.service';
import { ResearchService } from 'app/services/research.service';
import { ModalProvider } from '../../_shared/modal/modal.component';
import { UserService } from 'app/services/user.service';
import { AppConfig } from 'app/app.config';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {
  static route = 'finalise/export';

  locale: any = {};

  emailAddress: string = null;
  public formSubmitted: boolean = false;

  constructor(
    private routeBreadcrumbs: RouteBreadcrumbs,
    private footer: Footer,
    private localisation: LocalisationService,
    private researchService: ResearchService,
    private userService: UserService,
    private modal: ModalProvider
  ) {}

  setFormSubmitted(value) {
    this.formSubmitted = value;
  }

  ngOnInit() {
    this.locale = this.localisation.getTranslationsForComponent('ExportComponent');

    let parentLocale = this.localisation.getTranslationsForComponent(
      'FinaliseListComponent'
    ) as any;

    this.routeBreadcrumbs.breadcrumbs.next([
      new Breadcrumb(parentLocale.breadcrumbText, 'finalise'),
      new Breadcrumb(this.locale.breadcrumbText, null)
    ]);

    this.userService.getUser().subscribe(user => {
      this.emailAddress = user.email;
    });

    this.footer.update(null);
  }

  export() {
    this.emailAddress = this.emailAddress.trim();

    if (!this.emailAddress || !this.validateEmail(this.emailAddress)) {
      this.modal.create(this.locale.noEmailModalTitle, this.locale.noEmailModalMessage);
      return;
    }
    this.setFormSubmitted(true);
    this.researchService.exportShortlist(this.emailAddress).subscribe(result => {
      this.setFormSubmitted(false);
      this.modal.create(this.locale.successModalTitle, this.locale.successModalMessage);
    });
  }

  validateEmail(email: string): boolean {
    var regex = AppConfig.emailRegex;
    return regex.test(email);
  }
}
