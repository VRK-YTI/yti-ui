import { Component, Input } from '@angular/core';
import { VocabularyNode } from '../../entities/node';
import { FormNode } from '../../services/form-state';
import { EditableService } from '../../services/editable.service';

@Component({
  selector: 'app-vocabulary-form',
  template: `
    <div class="row">
      <app-property class="col-md-6"
                *ngFor="let child of properties"
                [property]="child.property"
                [id]="child.name"
                [filterLanguage]="filterLanguage"></app-property>
      
      <app-reference class="col-md-6"
                 *ngFor="let child of references"
                 [reference]="child.reference"
                 [id]="child.name"
                 [unsaved]="!vocabulary.persistent"></app-reference>
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

  get properties() {
    return this.form.properties.filter(prop => this.showEmpty || !prop.property.valueEmpty);
  }

  get references() {
    return this.form.references.filter(ref => this.showEmpty || !ref.reference.valueEmpty);
  }
}
