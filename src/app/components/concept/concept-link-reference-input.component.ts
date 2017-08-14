import { Component, Directive, Input, OnInit } from '@angular/core';
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
           [ngbPopover]="popContent" 
           [triggers]="'mouseenter:mouseleave'"
           [popoverTitle]="conceptLink.label | translateValue">
          {{conceptLink.label | translateValue}}
        </a>

        <ng-template #popContent>
          <concept-link-reference-popover [link]="conceptLink"></concept-link-reference-popover>
        </ng-template>
      </li>
    </ul>

    <div *ngIf="editing">
      <div *ngFor="let conceptLink of reference.value">
        <a><i class="fa fa-times" (click)="removeReference(conceptLink)"></i></a>
        <span [ngbPopover]="editingPopContent" 
              [triggers]="'mouseenter:mouseleave'"
              [popoverTitle]="conceptLink.label | translateValue">
          {{conceptLink.label | translateValue}}
        </span>

        <ng-template #editingPopContent>
          <concept-link-reference-popover [link]="conceptLink"></concept-link-reference-popover>
        </ng-template>
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
    this.reference.removeReference(conceptLink);
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

@Component({
  selector: 'concept-link-reference-popover',
  template: `
    <dl>
      <dt>
        <label>{{link.vocabularyMetaLabel | translateValue}}</label>
      </dt>
      <dd>
        <span>{{link.vocabularyLabel | translateValue}}</span>
      </dd>
    </dl>
    
    <meta-information [hidden]="!link.persistent" [showModified]="false" [node]="link"></meta-information>
  `
})
export class ConceptLinkReferencePopover implements Directive {

  @Input() link: ConceptLinkNode;

  constructor() {
  }
}
