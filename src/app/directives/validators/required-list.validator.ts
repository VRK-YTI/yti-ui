import { FormControl } from '@angular/forms';

export function requiredList(control: FormControl) {
  return Object.values(control.value).length > 0 ? null : {
    required: {
      valid: false
    }
  };
}
