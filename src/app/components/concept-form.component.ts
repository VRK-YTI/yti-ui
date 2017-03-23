import { Component, Input } from '@angular/core';
import { Node } from '../entities/node';
import { normalizeAsArray } from '../utils/array';
import { EditableService } from '../services/editable.service';

@Component({
  selector: 'concept-form',
  template: `
    <div class="row">
      <!-- Special handling for primary term, could be solved with mixed property/reference sorting -->
      <reference class="col-md-12" [multiColumnTerms]="true" [conceptsProvider]="conceptsProvider" [value]="concept.references['prefLabelXl']" *ngIf="concept.references['prefLabelXl']"></reference>
      <property class="col-md-12 col-xl-6" [value]="property" [relatedConcepts]="relatedConcepts" *ngFor="let property of concept | properties: showEmpty"></property>
      <reference class="col-md-12 col-xl-6" [value]="reference" [conceptsProvider]="conceptsProvider" *ngFor="let reference of concept | references: showEmpty : ['prefLabelXl']"></reference>
    </div>

    <meta-information [node]="concept"></meta-information>
  `
})
export class ConceptFormComponent {

  @Input() concept: Node<'Concept'>;
  @Input() conceptsProvider: () => Node<'Concept'>[];

  constructor(private editableService: EditableService) {
  }

  get relatedConcepts(): Node<'Concept'>[] {
    return [
      ...normalizeAsArray(this.concept.references['related'].values),
      ...normalizeAsArray(this.concept.references['broader'].values)
    ];
  }

  get showEmpty() {
    return this.editableService.editing;
  }
}
