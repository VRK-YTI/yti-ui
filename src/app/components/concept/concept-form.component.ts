import { Component, Input } from '@angular/core';
import { ConceptNode, VocabularyNode } from 'app/entities/node';
import { SearchConceptModalService } from './search-concept-modal.component';
import { SelectConceptReferenceModalService } from './select-concept-reference-modal.component';
import { ignoreModalClose } from 'yti-common-ui/utils/modal';
import { anyMatching } from 'yti-common-ui/utils/array';
import { FormField, FormNode, FormProperty } from 'app/services/form-state';
import { EditableService } from 'app/services/editable.service';
import { requireDefined } from 'yti-common-ui/utils/object';
import { conceptIdPrefix } from 'app/utils/id-prefix';

@Component({
  selector: 'app-concept-form',
  template: `
    <div class="row">

      <ng-container *ngFor="let field of fields" [ngSwitch]="field.value.fieldType">

        <app-property *ngSwitchCase="'property'"
                      class="col-md-12"
                      [class.col-xl-6]="isMultiColumn(field)"
                      [property]="field.value"
                      [id]="idPrefix + '_' + field.name"
                      [conceptSelector]="conceptSelector"
                      [relatedConcepts]="form.referencedConcepts"
                      [filterLanguage]="filterLanguage"></app-property>

        <app-reference *ngSwitchCase="'reference'"
                       class="col-md-12"
                       [class.col-xl-6]="isMultiColumn(field)"
                       [unsaved]="!concept.persistent"
                       (conceptRemove)="onConceptRemove($event)"
                       [reference]="field.value"
                       [concept]="concept"
                       [id]="idPrefix + '_' + field.name"
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
  idPrefix: string = conceptIdPrefix;

  conceptSelector = (name: string) => this.selectConcept(name);

  constructor(private editableService: EditableService,
              private searchConceptModalService: SearchConceptModalService,
              private selectConceptReferenceModalService: SelectConceptReferenceModalService) {
  }

  get showEmpty() {
    return this.editableService.editing;
  }

  get fields(): { name: string, value: FormField }[] {

    const hasContent = (field: FormField) =>
      this.filterLanguage ? field.hasContentForLanguage(this.filterLanguage)
        : !field.valueEmpty;

    return this.form.fields.filter(f => this.showEmpty || hasContent(f.value));
  }

  onConceptRemove(concept: ConceptNode) {

    const lastReferenceRemoved = !anyMatching(this.form.referencedConcepts, ref => ref.id === concept.id);

    if (lastReferenceRemoved) {
      this.form.removeSemanticReferencesTo(concept);
    }
  }

  selectConcept(name: string): Promise<ConceptNode | null> {

    const restricts = [{ graphId: this.concept.graphId, conceptId: this.concept.id, reason: 'self reference error' }];

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
      }, ignoreModalClose);
  }

  isMultiColumn(field: FormField): boolean {
    if (!this.multiColumn) {
      return false;
    }
    if (field.fieldType === 'property') {
      return (field as FormProperty).multiColumn;
    } else if (field.fieldType === 'reference') {
      return !field.term;
    }
    return false;
  }
}
