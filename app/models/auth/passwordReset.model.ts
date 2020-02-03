import { IValidate } from './../_base/iValidate';

export class PasswordResetModel implements IValidate {
  email: string;
  password: string;
  passwordConfirmation: string;
  token: string;

  validate(): boolean {
    var isValid = !!this.email && !!this.password && !!this.passwordConfirmation && !!this.token;
    if (!isValid) console.error('PasswordResetModel is invalid');
    return isValid;
  }
}
