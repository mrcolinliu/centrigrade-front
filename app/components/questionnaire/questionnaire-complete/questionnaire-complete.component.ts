import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalisationService } from '../../../services/localisation.service';
import { QuestionnaireService } from 'app/services/questionnaire.service';
import { LoadingProvider } from 'app/components/_shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-questionnaire-complete',
  templateUrl: './questionnaire-complete.component.html',
  styleUrls: ['./questionnaire-complete.component.scss']
})
export class QuestionnaireCompleteComponent implements OnInit {
  static route: string = 'questions/complete';

  locale: any = {};

  paused: boolean;

  constructor(
    private router: Router,
    private localisation: LocalisationService,
    private questionnaireService: QuestionnaireService,
    private loading: LoadingProvider
  ) {}

  ngOnInit() {
    this.loading.show(null, true);

    sessionStorage.setItem('completed', 'true');

    this.locale = this.localisation.getTranslationsForComponent('QuestionnaireCompleteComponent');
    this.questionnaireService.status.subscribe(status => {
      this.paused = status.pause === status.status + 1;
      this.loading.hide();
    });
  }

  seeMyResults() {
    this.router.navigate([`/centigrade/course-areas`]);
  }

  reload() {
    window.location.reload();
  }
}
