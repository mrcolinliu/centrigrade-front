import { Component, OnInit } from '@angular/core';
import { LocalisationService } from '../../../services/localisation.service';
import { HelpService } from 'app/services/help.service';
import { FaqItem } from 'app/models/help/help.models';
import { LoadingProvider } from 'app/components/_shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  static route: string = 'help';

  locale: any = {};
  items: FaqItem[];

  constructor(
    private localisation: LocalisationService,
    private loading: LoadingProvider,
    private helpService: HelpService
  ) {}

  ngOnInit() {
    this.loading.show(null, true);
    this.locale = this.localisation.getTranslationsForComponent('HelpComponent');

    this.helpService.getFaq().subscribe(result => {
      this.items = result.items;
      this.loading.hide();
    });
  }
}
