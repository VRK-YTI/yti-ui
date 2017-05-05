import { Component, Input } from '@angular/core';
import { VocabularyNode } from '../../entities/node';
import { EditableService } from '../../services/editable.service';

@Component({
  selector: 'vocabulary-form',
  template: `    
    <div class="row">
      <property class="col-md-6" [value]="property"
                *ngFor="let property of vocabulary | properties: showEmpty"></property>
      <reference class="col-md-6" [value]="reference"
                 *ngFor="let reference of vocabulary | references: showEmpty"></reference>
    </div>
  `
})
export class VocabularyFormComponent {

  @Input() vocabulary: VocabularyNode;

  constructor(private editableService: EditableService) {
  }

  get showEmpty() {
    return this.editableService.editing;
  }
}
