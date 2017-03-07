import { Directive } from '@angular/core';
import { EditableService } from '../services/editable.service';

@Directive({
  selector: 'form.editable',
  providers: [EditableService]
})
export class EditableFormDirective {
}
