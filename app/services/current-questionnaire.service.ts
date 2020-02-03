import { Injectable } from '@angular/core';

@Injectable()
export class CurrentQuestionnaireService {
  constructor() {}

  get() {
    return sessionStorage.getItem('q-id');
  }
}
