import { SubmitAnswersModel } from './../../../../models/questionnaire/submitAnswers.model';
import { Answer } from './../../../../models/questionnaire/answer.model';
import { Subject, Subscription } from 'rxjs';
import { QuestionOption } from './../../../../models/questionnaire/questionOption.model';
import { Question } from './../../../../models/questionnaire/question.model';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnChanges
} from '@angular/core';
import { ModalProvider } from './../../../_shared/modal/modal.component';

import * as _ from 'lodash';
import { LocalisationService } from '../../../../services/localisation.service';

@Component({
  selector: 'question-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent implements OnInit, OnDestroy, OnChanges {
  @Input('active') isActive: boolean;
  @Input() question: Question;
  @Input() questionIndex: number;
  @Input('question-changed') onQuestionChanged: Subject<boolean>;

  @Output() submit: EventEmitter<SubmitAnswersModel> = new EventEmitter<SubmitAnswersModel>();

  locale: any = {};

  count: number = 0;
  subscription: Subscription;

  filterText: string;

  isSingleResponse: boolean;

  notApplicableField: QuestionOption;

  constructor(private modal: ModalProvider, private localisation: LocalisationService) {}

  ngOnChanges(changes: any) {
    if (changes.question) {
      this.updateCount();
    }
    this.isSingleResponse = 1 == this.question.responseMin && 1 == this.question.responseMax;
    this.notApplicableField = this.question.options.find(opt => opt.notApplicableField);
    this.filterText = '';
    //If no answers are selected select the notApplicableField by default.
    if (this.notApplicableField && this.getAnswers().length == 0)
      this.notApplicableField.selected = true;
  }
  ngOnInit() {
    this.locale = this.localisation.getTranslationsForComponent('MultiSelectComponent');
    this.subscription = this.onQuestionChanged.subscribe(isNext => {
      if (!this.isActive) return;
      var answers = this.getAnswers();
      if (isNext && this.question.responseType == 'RESPONSE_REQUIRED_NOW') {
        var responseCount = this.getResponseCount(answers);
        if (
          responseCount < this.question.responseMin ||
          responseCount > this.question.responseMax
        ) {
          this.modal.create(
            this.locale.answerRequiredModelTitle,
            this.locale.answerRequiredModelMessage.format([
              this.question.responseMin,
              this.question.responseMax
            ])
          );
          return;
        }
      }

      this.submit.next(new SubmitAnswersModel(isNext, answers));
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getSelectedOptions(): QuestionOption[] {
    return this.question.options.filter(e => e.selected && !e.notApplicableField);
  }

  getResponseCount(answers: Answer[]): number {
    var answered = 0;

    answers.forEach(ans => {
      if (ans.selected) answered++;
    });

    return answered;
  }

  unselectOption(option: QuestionOption) {
    option.selected = false;
    this.clearChildOptions(option);

    //If no options are selected, select the notApplicableField.
    if (this.notApplicableField && this.getResponseCount(this.getAnswers()) == 0)
      this.notApplicableField.selected = true;

    this.updateCount();
  }

  toggleSelection(option: QuestionOption): boolean {
    this.clearOptions(this.isSingleResponse || option.notApplicableField);

    option.selected = !option.selected;

    if (this.question.options.filter(e => e.selected).length > this.question.responseMax) {
      option.selected = false;
      this.modal.create(
        'Oops',
        'You can only select up to ' + this.question.responseMax + ' options'
      );
    }

    if (!option.selected) {
      this.clearChildOptions(option);

      //If no options are selected, select the notApplicableField.
      if (this.notApplicableField && this.getResponseCount(this.getAnswers()) == 0)
        this.notApplicableField.selected = true;
    }

    this.updateCount();

    return true;
  }

  clearOptions(clearAll: boolean) {
    _.forEach(this.question.options, option => {
      if (clearAll || (!clearAll && option.notApplicableField)) {
        option.selected = false;
        this.clearChildOptions(option);
      }
    });
  }

  toggleChildSelection(child: QuestionOption, parent: QuestionOption) {
    _.forEach(parent.children, option => {
      option.selected = false;
    });

    child.selected = !child.selected;

    this.updateCount();
  }

  private clearChildOptions(parent: QuestionOption) {
    _.forEach(parent.children, ch => {
      ch.selected = false;
    });
  }

  private updateCount() {
    this.count = 0;

    this.question.options.forEach(o => {
      if (o.selected && !o.notApplicableField) this.count++;
    });

    this.question.answered = this.count > this.question.responseMin;
  }

  private getAnswers(): Answer[] {
    return this.getChildren(null, this.question.options);
  }

  public getChildren(parentId: number, options: QuestionOption[]): Answer[] {
    let answers: Answer[] = [];

    if (options) {
      options.forEach(o => {
        if (o.selected) {
          let answer = new Answer();
          answer.id = o.id;
          answer.selected = o.selected;
          answer.parent = parentId;
          answer.children = this.getChildren(o.id, o.children);

          answers.push(answer);
        }
      });
    }

    return answers;
  }
}
