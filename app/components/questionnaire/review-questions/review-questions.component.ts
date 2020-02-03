import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalProvider } from './../../_shared/modal/modal.component';
import { QuestionnaireService } from './../../../services/questionnaire.service';
import { LocalisationService } from '../../../services/localisation.service';

@Component({
  selector: 'app-review-questions',
  templateUrl: './review-questions.component.html',
  styleUrls: ['./review-questions.component.scss']
})
export class ReviewQuestionsComponent implements OnInit {
  static route: string = 'review-questions';

  locale: any = {};

  constructor(
    private router: Router,
    private questionnaireService: QuestionnaireService,
    public modal: ModalProvider,
    private localalisation: LocalisationService
  ) {}

  ngOnInit() {
    this.locale = this.localalisation.getTranslationsForComponent('ReviewQuestionsComponent');
    this.questionnaireService.getQuestionnaireStatus().subscribe();
  }

  seeMyResults() {
    this.router.navigate([`/centigrade/course-areas`]);
  }
}
