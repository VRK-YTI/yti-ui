import { Component, Input, OnInit } from '@angular/core';
import { ConceptLinkNode, ConceptNode, VocabularyNode } from 'app/entities/node';
import { EditableService } from 'app/services/editable.service';
import { SearchConceptModalService } from './search-concept-modal.component';
import { MetaModelService } from 'app/services/meta-model.service';
import { TermedService } from 'app/services/termed.service';
import { ignoreModalClose } from 'yti-common-ui/utils/modal';
import { FormReferenceLiteral } from 'app/services/form-state';
import { MetaModel } from 'app/entities/meta';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-concept-link-reference-input',
  styleUrls: ['./concept-link-reference-input.component.scss'],
  template: `
    <ul *ngIf="!editing">
      <li *ngFor="let conceptLink of reference.value">
        <a [routerLink]="['/concepts', conceptLink.targetGraph, 'concept', conceptLink.targetId]"
           id="{{conceptLink.id + '_concept_link_reference_link'}}"
           [ngbPopover]="popContent"
           [triggers]="'mouseenter:mouseleave'"
           [popoverTitle]="conceptLink.label | translateValue">
          {{conceptLink.label | translateValue}}
        </a>

        <ng-template #popContent>
          <app-concept-link-reference-popover [link]="conceptLink"></app-concept-link-reference-popover>
        </ng-template>
      </li>
    </ul>

    <div *ngIf="editing" [appDragSortable]="reference" [dragDisabled]="!canReorder()">
      <div *ngFor="let conceptLink of reference.value; let i = index"
           class="removable-text"
           [appDragSortableItem]="conceptLink"
           [index]="i">

        <a><i class="fa fa-times" id="{{conceptLink.id + '_concept_link_remove_reference'}}" (click)="removeReference(conceptLink)"></i></a>
        <span [ngbPopover]="editingPopContent"
              [triggers]="'mouseenter:mouseleave'"
              #p="ngbPopover"
              (mousedown)="p.close()"
              [popoverTitle]="conceptLink.label | translateValue">
          {{conceptLink.label | translateValue}}
        </span>

        <ng-template #editingPopContent>
          <app-concept-link-reference-popover [link]="conceptLink"></app-concept-link-reference-popover>
        </ng-template>
      </div>
    </div>

    <button type="button"
            id="concept_link_add_reference_button"
            id="{{id + '_concept_link_reference_add_reference_button'}}"
            class="btn btn-sm btn-action"
            *ngIf="editing"
            (click)="addReference()" translate>Add concept
    </button>
  `
})
export class ConceptLinkReferenceInputComponent implements OnInit {

  @Input() id: string;
  @Input() vocabulary: VocabularyNode;
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

    this.searchConceptModal.openOtherThanVocabulary(this.vocabulary, '', restricts).then(concept => {
      this.termedService.getVocabulary(concept.graphId)
        .flatMap(vocabulary => this.createConceptLink(graphId, vocabulary, concept))
        .subscribe(conceptLink => this.reference.addReference(conceptLink));
    }, ignoreModalClose);
  }

  createConceptLink(toGraphId: string, fromVocabulary: VocabularyNode, concept: ConceptNode) {
    return this.metaModel.map(meta => meta.createConceptLink(toGraphId, fromVocabulary, concept));
  }

  canReorder() {
    return this.editing && this.reference.value.length > 1;
  }
}

@Component({
  selector: 'app-concept-link-reference-popover',
  template: `
    <div class="form-group">
      <label>{{link.vocabularyMetaLabel | translateValue:true}}</label>
      <p class="form-control-static">{{link.vocabularyLabel | translateValue}}</p>
    </div>

    <app-meta-information [hidden]="!link.persistent" [showModified]="false" [node]="link"></app-meta-information>
  `
})
export class ConceptLinkReferencePopoverComponent  {

  @Input() link: ConceptLinkNode;

  constructor() {
  }
}
