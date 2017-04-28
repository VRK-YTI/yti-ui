import { Component, Input } from '@angular/core';
import { ConceptNode, VocabularyNode } from '../../entities/node';
import { EditableService } from '../../services/editable.service';

@Component({
  selector: 'vocabulary-form',
  template: `    
    <div class="row">
      <property class="col-md-6" [value]="property"
                *ngFor="let property of vocabulary | properties: showEmpty"></property>
      <reference class="col-md-6" [value]="reference" [conceptsProvider]="conceptsProvider"
                 *ngFor="let reference of vocabulary | references: showEmpty"></reference>
    </div>
  `
})
export class VocabularyFormComponent {

  @Input() vocabulary: VocabularyNode;
  @Input() conceptsProvider: () => ConceptNode[];

  constructor(private editableService: EditableService) {
  }

  get showEmpty() {
    return this.editableService.editing;
  }
}
