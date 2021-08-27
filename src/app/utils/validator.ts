import { ietfLanguageTags } from 'yti-common-ui/index';
import { FormControl } from '@angular/forms';
import { allMatching, contains } from 'yti-common-ui/utils/array';
import { PropertyMeta } from '../entities/meta';

function match(regexpString: string, value: string) {

  if (!regexpString) {
    return true;
  }

  const singleLineMode = regexpString.startsWith('(?s)');
  const regexp = new RegExp(singleLineMode ? regexpString.substring(4) : regexpString);

  return allMatching(singleLineMode ? (value || '').split(/[\r?\n]+/) : [value], line => regexp.test(line));
}

export function validateMeta(control: FormControl, meta: PropertyMeta) {
  return match(meta.regex, control.value) ? null : {
    validateMeta: {
      valid: false
    }
  };
}
