import { Injectable } from '@angular/core';
import { window } from 'rxjs/operators/window';
import { Observable } from 'rxjs/Observable';
import { QuestionnaireService } from './questionnaire.service';
import { AnswerRequest } from '../models/questionnaire/answerRequest.model';
import { Question } from 'app/models/questionnaire/question.model';
import { System } from 'typings';
import { first } from 'rxjs/operator/first';

class Queue<T> {
  private store: T[] = [];

  push(value: T) {
    this.store.push(value);
  }

  pop(): T | undefined {
    return this.store.shift();
  }

  popAndPush(): T | undefined {
    let value = this.pop();
    this.push(value);
    return value;
  }

  remove(value: T) {
    this.store.splice(this.store.indexOf(value));
  }

  getAll(): T[] {
    return this.store;
  }

  set(values: T[]) {
    this.store = values;
  }
}

export class QuestionPost {
  questionId: number;
  answer: AnswerRequest;
}

@Injectable()
export class OfflineQuestionnaireService {
  private indexedDB: IDBFactory;
  private questions: Queue<QuestionPost> = new Queue<QuestionPost>();
  private questionnaireService: QuestionnaireService;
  private name = 'questions';
  private index = 'questionId';
  private version = 1;
  private inProgress = 0;
  private saveLimit: number;

  constructor(questionnaireService: QuestionnaireService) {
    this.questionnaireService = questionnaireService;
    this.load();
  }

  setSaveLimit(saveLimit: number) {
    this.saveLimit = saveLimit;
  }

  sendQuestion(question: QuestionPost): number {
    if (this.count() >= this.saveLimit) {
      return -1;
    }

    this.questions.push(question);
    this.store();

    return this.count();
  }

  trySendAll(callback: () => void | null) {
    const count = this.count();
    this.inProgress = count;

    for (let i = 0; i < count; i++) {
      this.postQuestion(this.questions.popAndPush(), callback);
    }
  }

  private postQuestion(question: QuestionPost, callback: () => void | null) {
    this.questionnaireService.submitAnswer(question.questionId, question.answer).subscribe(
      response => {
        console.log('sent question #' + question.questionId);
        this.questions.remove(question);
        this.inProgress--;
        this.ifComplete(callback);
        return;
      },
      error => {
        console.log('failed to send question #' + question.questionId);
        this.inProgress--;
        this.ifComplete(callback);
        return;
      }
    );
  }

  ifComplete(callback: () => void) {
    this.store();
    if (callback != null && this.inProgress === 0) {
      callback();
    }
  }

  count(): number {
    return this.questions.getAll().length;
  }

  firstIncomplete(firstIncomplete: number): number {
    const max = Math.max(...this.questions.getAll().map(e => e.questionId));

    if (max > firstIncomplete) {
      return max + 1;
    }

    return firstIncomplete;
  }

  private store() {
    sessionStorage.setItem(this.name, JSON.stringify(this.questions.getAll()));
  }

  private load() {
    this.questions.set(JSON.parse(sessionStorage.getItem(this.name) || '[]'));
  }

  private clear() {
    sessionStorage.removeItem(this.name);
  }
}
