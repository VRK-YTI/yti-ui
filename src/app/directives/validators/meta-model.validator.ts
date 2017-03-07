import { Directive, Input, OnInit } from '@angular/core';
import { PropertyMeta } from '../../entities/meta';
import { FormControl } from '@angular/forms';

@Directive({
  selector: '[validateMeta][ngModel]'
})
export class MetaModelValidator implements OnInit {

  @Input('validateMeta') meta: PropertyMeta;
  regex: RegExp;

  ngOnInit() {
    this.regex = this.meta.regex ? new RegExp(normalize(this.meta.regex)) : new RegExp('.*');
  }

  validate(control: FormControl) {
    return this.regex.test(control.value) ? null : {
      validateRegex: {
        valid: false
      }
    };
  }
}

function normalize(regex: string) {
  // FIXME: figure out purpose of (?s)
  return regex.startsWith('(?s)') ? regex.substr(4) : regex;
}
