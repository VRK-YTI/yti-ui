import { Component, Input } from '@angular/core';
import { Node, Property } from '../entities/node';
import { normalizeAsArray } from '../utils/array';
import { EditableService } from '../services/editable.service';

@Component({
  selector: 'concept-form',
  template: `
    <div class="row">
      <!-- Special handling for primary term, could be solved with mixed property/reference sorting -->
      <reference class="col-md-12" [multiColumnTerms]="multiColumn" [conceptsProvider]="conceptsProvider" [value]="concept.references['prefLabelXl']" *ngIf="concept.references['prefLabelXl']"></reference>
      <property class="col-md-12" [class.col-xl-6]="multiColumn && !property.meta.area" [value]="property" [relatedConcepts]="relatedConcepts" *ngFor="let property of concept | properties: showEmpty"></property>
      <reference class="col-md-12" [class.col-xl-6]="multiColumn && !reference.term" [value]="reference" [conceptsProvider]="conceptsProvider" *ngFor="let reference of concept | references: showEmpty : ['prefLabelXl']"></reference>
    </div>

    <meta-information [node]="concept"></meta-information>
  `
})
export class ConceptFormComponent {

  @Input() concept: Node<'Concept'>;
  @Input() conceptsProvider: () => Node<'Concept'>[];
  @Input() multiColumn = false;

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
