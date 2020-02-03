import { IValidate } from './../_base/iValidate';

export class ForgottenPasswordModel implements IValidate {
  email: string;
  url: string; //Return URL for the activation link

  constructor(email: string, url: string) {
    this.email = email;
    this.url = url;
  }

  validate(): boolean {
    var isValid = !!this.email && !!this.url;
    if (!isValid) console.error('ForgottenPasswordModel is invalid');
    return isValid;
  }
}
