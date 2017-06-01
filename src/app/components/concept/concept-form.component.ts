import { Component, Input } from '@angular/core';
import { ConceptNode } from '../../entities/node';
import { EditableService } from '../../services/editable.service';
import { SearchConceptModalService } from './search-concept.modal';
import { SelectConceptReferenceModalService } from './select-concept-reference.modal';
import { ignoreModalClose, isModalClose } from '../../utils/modal';

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
                [relatedConcepts]="concept.referencedConcepts"></property>
      
      <reference *ngFor="let reference of concept | references: showEmpty : ['prefLabelXl']" 
                 class="col-md-12" 
                 [class.col-xl-6]="multiColumn && !reference.term"
                 [multiColumnTerms]="multiColumn"
                 [unsaved]="!concept.persistent"
                 (conceptRemove)="onConceptRemove($event)"
                 [value]="reference"></reference>
    </div>

    <meta-information [hidden]="!concept.persistent" [node]="concept"></meta-information>
  `
})
export class ConceptFormComponent {

  @Input() concept: ConceptNode;
  @Input() multiColumn = false;

  conceptSelector = (name: string) => this.selectConcept(name);

  constructor(private editableService: EditableService,
              private searchConceptModalService: SearchConceptModalService,
              private selectConceptReferenceModalService: SelectConceptReferenceModalService) {
  }

  get showEmpty() {
    return this.editableService.editing;
  }

  onConceptRemove(concept: ConceptNode) {
    this.concept.removeMarkdownReferences(concept);
  }

  selectConcept(name: string): Promise<ConceptNode|null> {
    return this.searchConceptModalService.openForGraph(this.concept.graphId, name)
      .then(concept => {
        if (!this.concept.hasConceptReference(concept.id)) {
          return this.selectConceptReferenceModalService.open(this.concept)
            .then(reference => {
              reference.values.push(concept);
              return concept;
            }, ignoreModalClose)
        } else {
          return concept;
        }
      }, err => {
        if (isModalClose(err)) {
          return null;
        } else {
          throw new Error(err);
        }
      });
  }
}
