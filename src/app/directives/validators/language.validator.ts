import { FormControl } from '@angular/forms';
import { contains } from 'yti-common-ui/utils/array';
import { ietfLanguageTags } from 'yti-common-ui';

export function validateLanguage(control: FormControl) {
  return contains(ietfLanguageTags, control.value)  ? null : {
    validateLanguage: {
      valid: false
    }
  };
}
