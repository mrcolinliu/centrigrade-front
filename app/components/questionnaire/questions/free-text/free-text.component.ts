import { SubmitAnswersModel } from './../../../../models/questionnaire/submitAnswers.model';
import { Subject, Subscription } from 'rxjs';
import { Answer } from './../../../../models/questionnaire/answer.model';
import { Question } from './../../../../models/questionnaire/question.model';
import { ModalProvider } from './../../../_shared/modal/modal.component';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { LocalisationService } from '../../../../services/localisation.service';

@Component({
  selector: 'question-free-text',
  templateUrl: './free-text.component.html',
  styleUrls: ['./free-text.component.scss']
})
export class FreeTextComponent implements OnInit, OnDestroy {
  @Input('active') isActive: boolean;
  @Input() question: Question;
  @Input() questionIndex: number;
  @Input('question-changed') onQuestionChanged: Subject<boolean>;

  @Output() submit: EventEmitter<SubmitAnswersModel> = new EventEmitter<SubmitAnswersModel>();

  locale: any = {};

  responseLimit: number = 255;

  subscription: Subscription;

  constructor(private modal: ModalProvider, private localisation: LocalisationService) {}

  ngOnInit() {
    this.locale = this.localisation.getTranslationsForComponent('FreeTextComponent');
    this.subscription = this.onQuestionChanged.subscribe(isNext => {
      if (!this.isActive) return;
      var answers = this.getAnswers();

      if (
        isNext &&
        this.question.responseType == 'RESPONSE_REQUIRED_NOW' &&
        !this.isQuestionAnswered(answers)
      ) {
        this.modal.create(
          this.locale.answerRequiredModalTitle,
          this.locale.answerRequiredModalMessage
        );
        return;
      }

      this.submit.next(new SubmitAnswersModel(isNext, answers));
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  isQuestionAnswered(answers: Answer[]): boolean {
    answers.forEach(ans => {
      if (ans.freeTextResponse == '') return false;
    });

    return true;
  }

  private getAnswers(): Answer[] {
    let answers: Answer[] = [];

    this.question.options.forEach(o => {
      let answer = new Answer();
      answer.id = o.id;
      answer.freeTextResponse = o.freeTextResponse;
      answer.selected = true;
      answers.push(answer);
    });

    return answers;
  }
}
