import { Component, Input } from '@angular/core';
import { ConceptNode, VocabularyNode } from '../../entities/node';
import { SearchConceptModalService } from './search-concept-modal.component';
import { SelectConceptReferenceModalService } from './select-concept-reference-modal.component';
import { ignoreModalClose, isModalClose } from '../../utils/modal';
import { anyMatching } from '../../utils/array';
import { FormNode, FormField } from '../../services/form-state';
import { EditableService } from '../../services/editable.service';
import { requireDefined } from '../../utils/object';

@Component({
  selector: 'app-concept-form',
  template: `
    <div class="row">
    
      <ng-container *ngFor="let field of fields" [ngSwitch]="field.value.fieldType">

        <app-property *ngSwitchCase="'property'"
                      class="col-md-12"
                      [class.col-xl-6]="multiColumn && field.value.multiColumn"
                      [property]="field.value"
                      [id]="field.name"
                      [conceptSelector]="conceptSelector"
                      [relatedConcepts]="form.referencedConcepts"
                      [filterLanguage]="filterLanguage"></app-property>

        <app-reference *ngSwitchCase="'reference'"
                       class="col-md-12"
                       [class.col-xl-6]="multiColumn && !field.value.term"
                       [unsaved]="!concept.persistent"
                       (conceptRemove)="onConceptRemove($event)"
                       [reference]="field.value"
                       [concept]="concept"
                       [id]="field.name"
                       [filterLanguage]="filterLanguage"
                       [vocabulary]="vocabulary"></app-reference>

      </ng-container>
      
    </div>

    <app-meta-information [hidden]="!concept.persistent" [node]="concept"></app-meta-information>
  `
})
export class ConceptFormComponent {

  @Input() vocabulary: VocabularyNode;
  @Input() concept: ConceptNode;
  @Input() form: FormNode;
  @Input() multiColumn = false;
  @Input() filterLanguage: string;

  conceptSelector = (name: string) => this.selectConcept(name);

  constructor(private editableService: EditableService,
              private searchConceptModalService: SearchConceptModalService,
              private selectConceptReferenceModalService: SelectConceptReferenceModalService) {
  }

  get showEmpty() {
    return this.editableService.editing;
  }

  get fields() {

    const hasContent = (field: FormField) =>
      this.filterLanguage ? field.hasContentForLanguage(this.filterLanguage)
                          : !field.valueEmpty;

    return this.form.fields.filter(f => this.showEmpty || hasContent(f.value));
  }

  onConceptRemove(concept: ConceptNode) {

    const lastReferenceRemoved = !anyMatching(this.form.referencedConcepts, ref => ref.id === concept.id);

    if (lastReferenceRemoved) {
      this.form.removeMarkdownReferences(concept);
    }
  }

  selectConcept(name: string): Promise<ConceptNode|null> {

    const restricts = [{ graphId: this.concept.graphId, conceptId: this.concept.id, reason: 'self reference error'}];

    return this.searchConceptModalService.openForVocabulary(requireDefined(this.vocabulary), name, restricts)
      .then(concept => {
        if (!this.form.hasConceptReference(concept.id)) {
          return this.selectConceptReferenceModalService.open(this.form)
            .then(reference => {
              reference.addReference(concept);
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
