import { Component, Input } from '@angular/core';
import { ConceptNode } from '../../entities/node';
import { EditableService } from '../../services/editable.service';

@Component({
  selector: 'concept-form',
  template: `
    <div class="row">
      <!-- Special handling for primary term, could be solved with mixed property/reference sorting -->
      <reference class="col-md-12" 
                 [multiColumnTerms]="multiColumn" 
                 [conceptsProvider]="conceptsProvider" 
                 [value]="concept.references['prefLabelXl']"
                 [primaryTerm]="true"
                 *ngIf="concept.references['prefLabelXl']"></reference>
      
      <property class="col-md-12" 
                [class.col-xl-6]="multiColumn && !property.meta.area" 
                [value]="property" 
                [relatedConcepts]="relatedConcepts" 
                *ngFor="let property of concept | properties: showEmpty"></property>
      
      <reference class="col-md-12" 
                 [class.col-xl-6]="multiColumn && !reference.term"
                 [multiColumnTerms]="multiColumn"
                 [value]="reference" 
                 [conceptsProvider]="conceptsProvider" 
                 *ngFor="let reference of concept | references: showEmpty : ['prefLabelXl']"></reference>
    </div>

    <meta-information [hidden]="!concept.persistent" [node]="concept"></meta-information>
  `
})
export class ConceptFormComponent {

  @Input() concept: ConceptNode;
  @Input() conceptsProvider: () => ConceptNode[];
  @Input() multiColumn = false;

  constructor(private editableService: EditableService) {
  }

  get relatedConcepts(): ConceptNode[] {
    return [...this.concept.relatedConcepts, ...this.concept.broaderConcepts];
  }

  get showEmpty() {
    return this.editableService.editing;
  }
}
