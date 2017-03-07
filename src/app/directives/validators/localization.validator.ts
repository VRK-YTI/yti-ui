import { Directive } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive({
  selector: '[validateLocalization][ngModel]'
})
export class LocalizationValidator {
  validate(_control: FormControl) {
    // TODO
    return null;
  }
}
