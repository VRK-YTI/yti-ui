import { PropertyMeta } from 'app/entities/meta';
import { FormControl } from '@angular/forms';
import { allMatching } from 'yti-common-ui/utils/array';


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
