import { SubmitAnswersModel } from './../../../../models/questionnaire/submitAnswers.model';
import { Subject, Subscription } from 'rxjs';
import { Question } from './../../../../models/questionnaire/question.model';
import { Answer } from './../../../../models/questionnaire/answer.model';
import { QuestionOption } from './../../../../models/questionnaire/questionOption.model';
import { ModalProvider } from './../../../_shared/modal/modal.component';

import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { LocalisationService } from '../../../../services/localisation.service';

@Component({
  selector: 'question-multi-choice',
  templateUrl: './multi-choice.component.html',
  styleUrls: ['./multi-choice.component.scss']
})
export class MultiChoiceComponent implements OnInit, OnDestroy {
  @Input('active') isActive: boolean;
  @Input() question: Question;
  @Input() questionIndex: number;
  @Input('question-changed') onQuestionChanged: Subject<boolean>;
  @Input('question-submitted') onQuestionSubmitted: Subject<void>;

  @Output() submit: EventEmitter<SubmitAnswersModel> = new EventEmitter<SubmitAnswersModel>();

  locale: any = {};
  changedSubscription: Subscription;
  submittedSubscription: Subscription;

  answered: boolean = false;

  constructor(private localisation: LocalisationService, private modal: ModalProvider) {}

  ngOnInit() {
    this.answered = false;
    this.locale = this.localisation.getTranslationsForComponent('MultiChoiceComponent');

    this.changedSubscription = this.onQuestionChanged.subscribe(isNext => {
      this.submitQuestion(isNext);
      this.answered = false;
    });

    this.submittedSubscription = this.onQuestionSubmitted.subscribe(() => {
      this.answered = false;
    });
  }

  ngOnDestroy() {
    this.changedSubscription.unsubscribe();
  }

  submitQuestion(isNext: boolean) {
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
    } else {
      this.submit.next(new SubmitAnswersModel(isNext, answers));
    }
  }

  isQuestionAnswered(answers: Answer[]): boolean {
    var answered = false;

    answers.forEach(ans => {
      if (ans.selected) answered = true;
      this.question.answered = true;
    });

    return answered;
  }

  toggleSelection(option: QuestionOption): boolean {
    if (!this.answered || !this.hasSelection()) {
      this.answered = true;
      this.question.answered = true;
      this.clearSelections();
      option.selected = true;

      this.submitQuestion(true);
    }

    return true;
  }

  hasSelection(): boolean {
    return this.question.options.some(e => e.selected == true);
  }

  private clearSelections() {
    _.forEach(this.question.options, opt => {
      opt.selected = false;
    });
  }

  private getAnswers(): Answer[] {
    let answers: Answer[] = [];

    this.question.options.forEach(o => {
      let answer = new Answer();
      answer.id = o.id;
      answer.selected = o.selected;
      answers.push(answer);
    });

    return answers;
  }
}
