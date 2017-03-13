import { Directive } from '@angular/core';
import { FormControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[validateLocalization][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useValue: validate, multi: true }
  ]
})
export class LocalizationValidator {}

function validate(control: FormControl) {
  // TODO
  return null;
}
