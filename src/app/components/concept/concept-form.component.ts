import { Component, Input } from '@angular/core';
import { ConceptNode } from '../../entities/node';
import { SearchConceptModalService } from './search-concept.modal';
import { SelectConceptReferenceModalService } from './select-concept-reference.modal';
import { ignoreModalClose, isModalClose } from '../../utils/modal';
import { anyMatching, firstMatching } from '../../utils/array';
import { FormNode, FormReferenceTerm } from '../../services/form-state';
import { EditableService } from '../../services/editable.service';

@Component({
  selector: 'concept-form',
  template: `
    <div class="row">
      <!-- Special handling for primary term, could be solved with mixed property/reference sorting -->
      <reference *ngIf="hasPrimaryTerm()"
                 class="col-md-12"
                 [multiColumnTerms]="multiColumn"
                 [unsaved]="!concept.persistent"
                 [reference]="primaryTermReference">
                 [id]="'prefLabelXl'"</reference>
      
      <property *ngFor="let child of properties"
                class="col-md-12" 
                [class.col-xl-6]="multiColumn && child.property.multiColumn" 
                [property]="child.property"
                [id]="child.name"
                [conceptSelector]="conceptSelector"
                [relatedConcepts]="form.referencedConcepts"></property>
      
      <reference *ngFor="let reference of references" 
                 class="col-md-12" 
                 [class.col-xl-6]="multiColumn && !reference.reference.term"
                 [multiColumnTerms]="multiColumn"
                 [unsaved]="!concept.persistent"
                 (conceptRemove)="onConceptRemove($event)"
                 [reference]="reference.reference"
                 [id]="reference.name"></reference>
    </div>

    <meta-information [hidden]="!concept.persistent" [node]="concept"></meta-information>
  `
})
export class ConceptFormComponent {

  @Input() concept: ConceptNode;
  @Input() form: FormNode;
  @Input() multiColumn = false;

  conceptSelector = (name: string) => this.selectConcept(name);

  constructor(private editableService: EditableService,
              private searchConceptModalService: SearchConceptModalService,
              private selectConceptReferenceModalService: SelectConceptReferenceModalService) {
  }

  get showEmpty() {
    return this.editableService.editing;
  }

  get properties() {
    return this.form.properties.filter(prop => this.showEmpty || !prop.property.valueEmpty);
  }

  get references() {
    return this.form.references.filter(ref => ref.name !== 'prefLabelXl' && (this.showEmpty || !ref.reference.valueEmpty));
  }

  get primaryTermReference(): FormReferenceTerm {
    return firstMatching(this.form.references, child => child.name === 'prefLabelXl')!.reference as FormReferenceTerm;
  }

  hasPrimaryTerm() {
    return anyMatching(this.references, child => child.name === 'prefLabelXl');
  }

  onConceptRemove(concept: ConceptNode) {

    const lastReferenceRemoved = !anyMatching(this.form.referencedConcepts, ref => ref.id === concept.id);

    if (lastReferenceRemoved) {
      this.form.removeMarkdownReferences(concept);
    }
  }

  selectConcept(name: string): Promise<ConceptNode|null> {
    return this.searchConceptModalService.openForGraph(this.concept.graphId, name)
      .then(concept => {
        if (!this.form.hasConceptReference(concept.id)) {
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
