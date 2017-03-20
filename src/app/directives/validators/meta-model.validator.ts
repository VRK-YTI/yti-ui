import { Directive, Input, OnInit, forwardRef } from '@angular/core';
import { PropertyMeta } from '../../entities/meta';
import { FormControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[validateMeta][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => MetaModelValidator), multi: true }
  ]
})
export class MetaModelValidator implements OnInit {

  @Input('validateMeta') meta: PropertyMeta;
  regex: RegExp;

  ngOnInit() {

    function normalize(regex: string) {
      // FIXME: figure out purpose of (?s)
      return regex.startsWith('(?s)') ? regex.substr(4) : regex;
    }

    this.regex = this.meta.regex ? new RegExp(normalize(this.meta.regex)) : new RegExp('.*');
  }

  validate(control: FormControl) {
    return this.regex.test(control.value) ? null : {
      validateMeta: {
        valid: false
      }
    };
  }
}
