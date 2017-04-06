import { Directive } from '@angular/core';
import { FormControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[validateLanguage][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useValue: validate, multi: true }
  ]
})
export class LanguageValidator {}

export function validate(control: FormControl) {

  const valid = control.value && typeof control.value === 'string' && control.value.length === 2;

  return valid ? null : {
    validateLanguage: {
      valid: false
    }
  }
}
