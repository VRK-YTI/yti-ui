import { Component, Input } from '@angular/core';
import { ConceptNode } from '../../entities/node';
import { EditableService } from '../../services/editable.service';
import { SearchConceptModalService } from './search-concept.modal';

@Component({
  selector: 'concept-form',
  template: `
    <div class="row">
      <!-- Special handling for primary term, could be solved with mixed property/reference sorting -->
      <reference *ngIf="concept.hasTerms()"
                 class="col-md-12"
                 [multiColumnTerms]="multiColumn"
                 [unsaved]="!concept.persistent"
                 [value]="concept.terms"></reference>
      
      <property *ngFor="let property of concept | properties: showEmpty"
                class="col-md-12" 
                [class.col-xl-6]="multiColumn && property.multiColumn" 
                [value]="property"
                [conceptSelector]="conceptSelector"
                [relatedConcepts]="relatedConcepts"></property>
      
      <reference *ngFor="let reference of concept | references: showEmpty : ['prefLabelXl']" 
                 class="col-md-12" 
                 [class.col-xl-6]="multiColumn && !reference.term"
                 [multiColumnTerms]="multiColumn"
                 [unsaved]="!concept.persistent"
                 [value]="reference"></reference>
    </div>

    <meta-information [hidden]="!concept.persistent" [node]="concept"></meta-information>
  `
})
export class ConceptFormComponent {

  @Input() concept: ConceptNode;
  @Input() multiColumn = false;

  conceptSelector = (name: string) => this.searchConceptModalService.openForGraph(this.concept.graphId, name);

  constructor(private editableService: EditableService,
              private searchConceptModalService: SearchConceptModalService) {
  }

  get relatedConcepts(): ConceptNode[] {
    return [...this.concept.relatedConcepts.values, ...this.concept.broaderConcepts.values];
  }

  get showEmpty() {
    return this.editableService.editing;
  }
}
