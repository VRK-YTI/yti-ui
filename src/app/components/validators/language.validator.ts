import { Directive } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive({
  selector: '[validateLanguage][ngModel]'
})
export class LanguageValidator {
  validate(_control: FormControl) {
    // TODO
    return null;
  }
}
