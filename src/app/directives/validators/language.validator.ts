import { Directive, forwardRef } from '@angular/core';
import { FormControl, NG_VALIDATORS } from '@angular/forms';
import { contains } from 'yti-common-ui/utils/array';
import { ietfLanguageTags } from 'yti-common-ui';

@Directive({
  selector: '[appValidateLanguage][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => LanguageValidatorDirective), multi: true }
  ]
})
export class LanguageValidatorDirective {

  validate(control: FormControl) {
    return validateLanguage(control);
  }
}

export function validateLanguage(control: FormControl) {
  return contains(ietfLanguageTags, control.value)  ? null : {
    validateLanguage: {
      valid: false
    }
  };
}
