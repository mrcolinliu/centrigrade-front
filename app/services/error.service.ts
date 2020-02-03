import { Injectable } from '@angular/core';
import { OnInit, Output, OnDestroy } from '@angular/core';

@Injectable()
export class ErrorService {
  error: Error = null;

  constructor() {
    this.error = this.load();
  }

  updateError(error: Error) {
    this.save(error);
  }

  clear() {
    sessionStorage.removeItem('error');
    this.error = null;
  }

  private save(error: Error) {
    this.error = error;
    sessionStorage.setItem('error', JSON.stringify(error));
    return error;
  }

  private load(): Error {
    return JSON.parse(sessionStorage.getItem('error'));
  }
}

export class Error {
  code: string;
  title: string;
  message: string;
}
