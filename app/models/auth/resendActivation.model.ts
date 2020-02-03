import { IValidate } from './../_base/iValidate';

export class ResendActivationModel implements IValidate {
  email: string;
  url: string;

  validate(): boolean {
    var isValid = !!this.email && !!this.url;
    if (!isValid) console.error('ResendActivationModel is invalid');
    return isValid;
  }
}
