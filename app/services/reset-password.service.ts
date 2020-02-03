import { Injectable } from '@angular/core';

@Injectable()
export class ResetPasswordService {
  private passwordTokenError: boolean = false;

  getPasswordTokenError() {
    return this.passwordTokenError;
  }

  setPasswordTokenError(value: boolean) {
    this.passwordTokenError = value;
  }
}
