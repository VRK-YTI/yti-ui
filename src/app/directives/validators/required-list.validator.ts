import { Directive, Input, forwardRef } from '@angular/core';
import { PropertyMeta } from 'app/entities/meta';
import { FormControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[appRequiredList][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => RequiredListValidatorDirective), multi: true }
  ]
})
export class RequiredListValidatorDirective {

  @Input() validateMeta: PropertyMeta;

  validate(control: FormControl) {
    return requiredList(control);
  }
}

export function requiredList(control: FormControl) {
  return Object.values(control.value).length > 0 ? null : {
    required: {
      valid: false
    }
  };
}
