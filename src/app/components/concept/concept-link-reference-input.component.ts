import { Component, Input } from '@angular/core';
import { Reference, ConceptLinkNode } from '../../entities/node';
import { EditableService } from '../../services/editable.service';
import { SearchConceptModalService } from './search-concept.modal';
import { remove } from '../../utils/array';
import { MetaModelService } from '../../services/meta-model.service';
import { TermedService } from '../../services/termed.service';
import { defaultLanguages } from '../../utils/language';
import { ignoreModalClose } from '../../utils/modal';

@Component({
  selector: 'concept-link-reference-input',
  styleUrls: ['./concept-link-reference-input.component.scss'],
  template: `
    <ul *ngIf="!editing">
      <li *ngFor="let conceptLink of conceptLinkReference.values">
        <a [routerLink]="['/concepts', conceptLink.source, 'concept', conceptLink.linkedConceptId]"
           [ngbPopover]="conceptLink.vocabularyLabel | translateValue" [triggers]="'mouseenter:mouseleave'" [popoverTitle]="'Vocabulary' | translate">
          {{conceptLink.label | translateValue}}
        </a>
      </li>
    </ul>

    <div *ngIf="editing">
      <div *ngFor="let conceptLink of conceptLinkReference.values">
        <a><i class="fa fa-times" (click)="removeReference(conceptLink)"></i></a>
        <span [ngbPopover]="conceptLink.vocabularyLabel | translateValue" [triggers]="'mouseenter:mouseleave'" [popoverTitle]="'Vocabulary' | translate">
          {{conceptLink.label | translateValue}}
        </span>
      </div>
    </div>

    <button type="button"
            class="btn btn-default"
            *ngIf="editing"
            (click)="addReference()" translate>Add concept
    </button>
  `
})
export class ConceptLinkReferenceInputComponent {

  @Input('concept') conceptLinkReference: Reference<ConceptLinkNode>;

  constructor(private editableService: EditableService,
              private termedService: TermedService,
              private metaModelService: MetaModelService,
              private searchConceptModal: SearchConceptModalService) {
  }

  get editing() {
    return this.editableService.editing;
  }

  removeReference(conceptLink: ConceptLinkNode) {
    remove(this.conceptLinkReference.values, conceptLink);
  }

  addReference() {

    const graphId = this.conceptLinkReference.meta.graphId;

    this.searchConceptModal.openOtherThanGraph(graphId).then(concept => {
      this.termedService.getVocabulary(concept.graphId, defaultLanguages)
        .flatMap(vocabulary => this.metaModelService.createConceptLink(graphId, vocabulary, concept))
        .subscribe(conceptLink => this.conceptLinkReference.values.push(conceptLink));
    }, ignoreModalClose);
  }
}
