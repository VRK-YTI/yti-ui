import { Component, Input, OnInit } from '@angular/core';
import { ConceptLinkNode, ConceptNode, VocabularyNode } from '../../entities/node';
import { EditableService } from '../../services/editable.service';
import { SearchConceptModalService } from './search-concept.modal';
import { remove } from '../../utils/array';
import { MetaModelService } from '../../services/meta-model.service';
import { TermedService } from '../../services/termed.service';
import { ignoreModalClose } from '../../utils/modal';
import { FormReferenceLiteral } from '../../services/form-state';
import { MetaModel } from '../../entities/meta';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'concept-link-reference-input',
  styleUrls: ['./concept-link-reference-input.component.scss'],
  template: `
    <ul *ngIf="!editing">
      <li *ngFor="let conceptLink of reference.value">
        <a [routerLink]="['/concepts', conceptLink.targetGraph, 'concept', conceptLink.targetId]"
           [ngbPopover]="conceptLink.vocabularyLabel | translateValue" 
           [triggers]="'mouseenter:mouseleave'"
           [popoverTitle]="'Vocabulary' | translate">
          {{conceptLink.label | translateValue}}
        </a>
      </li>
    </ul>

    <div *ngIf="editing">
      <div *ngFor="let conceptLink of reference.value">
        <a><i class="fa fa-times" (click)="removeReference(conceptLink)"></i></a>
        <span [ngbPopover]="conceptLink.vocabularyLabel | translateValue" 
              [triggers]="'mouseenter:mouseleave'"
              [popoverTitle]="'Vocabulary' | translate">
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
export class ConceptLinkReferenceInputComponent implements OnInit {

  @Input() reference: FormReferenceLiteral<ConceptLinkNode>;
  metaModel: Observable<MetaModel>;

  constructor(private editableService: EditableService,
              private termedService: TermedService,
              private metaModelService: MetaModelService,
              private searchConceptModal: SearchConceptModalService) {
  }

  ngOnInit() {
    this.metaModel = this.metaModelService.getMeta(this.reference.graphId);
  }

  get editing() {
    return this.editableService.editing;
  }

  removeReference(conceptLink: ConceptLinkNode) {
    remove(this.reference.value, conceptLink);
  }

  addReference() {

    const graphId = this.reference.targetGraph;
    const restricts = this.reference.value.map(ref => ({ graphId: ref.targetGraph, conceptId: ref.targetId, reason: 'already added error'}));

    this.searchConceptModal.openOtherThanGraph(graphId, '', restricts).then(concept => {
      this.termedService.getVocabulary(concept.graphId)
        .flatMap(vocabulary => this.createConceptLink(graphId, vocabulary, concept))
        .subscribe(conceptLink => this.reference.addReference(conceptLink));
    }, ignoreModalClose);
  }

  createConceptLink(toGraphId: string, fromVocabulary: VocabularyNode, concept: ConceptNode) {
    return this.metaModel.map(meta => meta.createConceptLink(toGraphId, fromVocabulary, concept));
  }
}
