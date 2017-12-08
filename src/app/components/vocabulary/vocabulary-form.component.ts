import { Component, Input } from '@angular/core';
import { VocabularyNode } from 'app/entities/node';
import { FormNode, FormField } from 'app/services/form-state';
import { EditableService } from 'app/services/editable.service';

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
                       [unsaved]="!vocabulary.persistent"
                       [filterLanguage]="filterLanguage"
                       [vocabulary]="vocabulary"></app-reference>

      </ng-container>

      <div class="col-md-6 form-group">
        <label translate>Vocabulary type</label>
        <p class="form-control-static">{{vocabulary.meta.label | translateValue:true}}</p>
      </div>
      
      <div class="col-md-6 form-group">
        <label translate>Namespace</label>
        <p class="form-control-static">{{namespace}}</p>
      </div>
      
    </div>
  `
})
export class VocabularyFormComponent {

  @Input() vocabulary: VocabularyNode;
  @Input() form: FormNode;
  @Input() filterLanguage: string;
  @Input() namespace: string;

  constructor(private editableService: EditableService) {
  }

  get showEmpty() {
    return this.editableService.editing;
  }

  get fields() {

    const hasContent = (field: FormField) =>
      this.filterLanguage ? field.hasContentForLanguage(this.filterLanguage)
                          : !field.valueEmpty;

    return this.form.fields.filter(f => this.showEmpty || hasContent(f.value));
  }
}
