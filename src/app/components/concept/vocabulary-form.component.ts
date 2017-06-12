import { Component, Input } from '@angular/core';
import { VocabularyNode } from '../../entities/node';
import { FormNode } from '../../services/form-state';

@Component({
  selector: 'vocabulary-form',
  template: `
    <div class="row">
      <property class="col-md-6"
                *ngFor="let child of form.properties"
                [property]="child.property"
                [id]="child.name"></property>
      
      <reference class="col-md-6"
                 *ngFor="let child of form.references"
                 [reference]="child.reference"
                 [id]="child.name"
                 [unsaved]="!vocabulary.persistent"></reference>
    </div>
  `
})
export class VocabularyFormComponent {

  @Input() vocabulary: VocabularyNode;
  @Input() form: FormNode;
}
