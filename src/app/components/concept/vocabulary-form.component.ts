import { Component, Input } from '@angular/core';
import { VocabularyNode } from '../../entities/node';
import { FormNode } from '../../services/form-state';
import { EditableService } from '../../services/editable.service';

@Component({
  selector: 'app-vocabulary-form',
  template: `
    <div class="row">

      <ng-container *ngFor="let field of fields" [ngSwitch]="field.value.fieldType">

        <app-property *ngSwitchCase="'property'"
                      class="col-md-6"
                      [property]="field.value"
                      [id]="field.name"
                      [filterLanguage]="filterLanguage"></app-property>

        <app-reference *ngSwitchCase="'reference'"
                       class="col-md-6"
                       [reference]="field.value"
                       [id]="field.name"
                       [unsaved]="!vocabulary.persistent"></app-reference>

      </ng-container>
    </div>
  `
})
export class VocabularyFormComponent {

  @Input() vocabulary: VocabularyNode;
  @Input() form: FormNode;
  @Input() filterLanguage: string;

  constructor(private editableService: EditableService) {
  }

  get showEmpty() {
    return this.editableService.editing;
  }

  get fields() {
    return this.form.fields.filter(f => this.showEmpty || !f.value.valueEmpty);
  }
}
