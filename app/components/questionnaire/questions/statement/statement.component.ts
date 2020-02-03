import { Subject, Subscription } from 'rxjs';
import { SubmitAnswersModel } from './../../../../models/questionnaire/submitAnswers.model';
import { Question } from './../../../../models/questionnaire/question.model';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Answer } from './../../../../models/questionnaire/answer.model';

@Component({
  selector: 'question-statement',
  templateUrl: './statement.component.html',
  styleUrls: ['./statement.component.scss']
})
export class StatementComponent implements OnInit, OnDestroy {
  @Input('active') isActive: boolean;
  @Input() question: Question;
  @Input() questionIndex: number;
  @Input('question-changed') onQuestionChanged: Subject<boolean>;

  @Output() submit: EventEmitter<SubmitAnswersModel> = new EventEmitter<SubmitAnswersModel>();

  subscription: Subscription;

  constructor() {}

  ngOnInit() {
    this.subscription = this.onQuestionChanged.subscribe(isNext => {
      if (!this.isActive) return;
      this.submit.next(new SubmitAnswersModel(isNext, this.getAnswers()));
    });
  }

  getAnswers(): Answer[] {
    let answers: Answer[] = [];

    this.question.options.forEach(o => {
      let answer = new Answer();
      answer.id = o.id;
      answer.selected = true;
      answers.push(answer);
    });

    return answers;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
