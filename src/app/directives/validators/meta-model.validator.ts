import { Directive, Input, forwardRef } from '@angular/core';
import { PropertyMeta } from '../../entities/meta';
import { FormControl, NG_VALIDATORS } from '@angular/forms';
import { allMatching } from '../../utils/array';

@Directive({
  selector: '[appValidateMeta][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => MetaModelValidatorDirective), multi: true }
  ]
})
export class MetaModelValidatorDirective {

  @Input() validateMeta: PropertyMeta;

  validate(control: FormControl) {
    return validateMeta(control, this.validateMeta);
  }
}

function match(regexpString: string, value: string) {

  if (!regexpString) {
    return true;
  }

  const singleLineMode = regexpString.startsWith('(?s)');
  const regexp = new RegExp(singleLineMode ? regexpString.substring(4) : regexpString);

  return allMatching(singleLineMode ? (value || '').split(/\n+/) : [value], line => regexp.test(line));
}

export function validateMeta(control: FormControl, meta: PropertyMeta) {
  return match(meta.regex, control.value) ? null : {
    validateMeta: {
      valid: false
    }
  };
}
