import { Directive, Input, forwardRef } from '@angular/core';
import { PropertyMeta } from '../../entities/meta';
import { FormControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[validateMeta][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => MetaModelValidator), multi: true }
  ]
})
export class MetaModelValidator {

  @Input('validateMeta') meta: PropertyMeta;

  validate(control: FormControl) {
    return validateMeta(control, this.meta);
  }
}


export function validateMeta(control: FormControl, meta: PropertyMeta) {

  function normalize(regex: string) {
    // FIXME: figure out purpose of (?s)
    return regex.startsWith('(?s)') ? regex.substr(4) : regex;
  }

  const regex = meta.regex ? new RegExp(normalize(meta.regex)) : new RegExp('.*');

  return regex.test(control.value) ? null : {
    validateMeta: {
      valid: false
    }
  };
}
