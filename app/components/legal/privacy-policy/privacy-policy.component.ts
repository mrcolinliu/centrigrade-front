import { Component, OnInit } from '@angular/core';
import { LocalisationService } from '../../../services/localisation.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  static route: string = 'privacy';

  locale: any = {};

  constructor(private localisation: LocalisationService) {}

  ngOnInit() {
    this.locale = this.localisation.getTranslationsForComponent('PrivacyPolicyComponent');
  }
}
