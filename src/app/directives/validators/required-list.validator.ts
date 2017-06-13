import { Directive, Input, forwardRef } from '@angular/core';
import { PropertyMeta } from '../../entities/meta';
import { FormControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[requiredList][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => RequiredListValidator), multi: true }
  ]
})
export class RequiredListValidator {

  @Input('validateMeta') meta: PropertyMeta;

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
