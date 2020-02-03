import { Directive } from '@angular/core';
import { ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';

@Directive({
  selector: '[appEqualsTrueValidator]'
})
export class EqualsValidatorDirective {
  constructor() {}
}

export function equalsValidator(controlKey: string, compareControlKey: string): ValidatorFn {
  return (form: FormGroup): { [key: string]: any } => {
    if (form.controls[controlKey].value != form.controls[compareControlKey].value) {
      let error = { unequalValues: true };
      form.controls[compareControlKey].setErrors(error);
      return error;
    }
    return null;
  };
}
