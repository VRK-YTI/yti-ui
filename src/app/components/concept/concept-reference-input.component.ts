import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConceptNode } from '../../entities/node';
import { EditableService } from '../../services/editable.service';
import { Restrict, SearchConceptModalService } from './search-concept.modal';
import { ignoreModalClose } from '../../utils/modal';
import { FormReferenceLiteral } from '../../services/form-state';
import { isDefined } from '../../utils/object';

@Component({
  selector: 'concept-reference-input',
  styleUrls: ['./concept-reference-input.component.scss'],
  template: `
    <ul *ngIf="!editing">
      <li *ngFor="let concept of reference.value">
        <a [routerLink]="['/concepts', concept.graphId, 'concept', concept.id]">{{concept.label | translateValue}}</a>
      </li>
    </ul>

    <div *ngIf="editing">
      <div *ngFor="let concept of reference.value">
        <a><i class="fa fa-times" (click)="removeReference(concept)"></i></a>
        <span>{{concept.label | translateValue}}</span>
      </div>
    </div>

    <button type="button"
            class="btn btn-default"
            *ngIf="editing"
            (click)="addReference()" translate>Add concept</button>
  `
})
export class ConceptReferenceInputComponent {

  @Input() self?: ConceptNode;
  @Input() reference: FormReferenceLiteral<ConceptNode>;
  @Output('conceptRemove') conceptRemove = new EventEmitter<ConceptNode>();

  constructor(private editableService: EditableService,
              private searchConceptModal: SearchConceptModalService) {
  }

  get editing() {
    return this.editableService.editing;
  }

  removeReference(concept: ConceptNode) {
    this.reference.removeReference(concept);
    this.conceptRemove.next(concept);
  }

  addReference() {

    const restricts: Restrict[] = [
      ...(isDefined(this.self) ? [{ graphId: this.self.graphId, conceptId: this.self.id, reason: 'self reference error'}] : []),
      ...this.reference.value.map(({ graphId, id }) => ({ graphId, conceptId: id, reason: 'already added error'}))
    ];

    this.searchConceptModal.openForGraph(this.reference.targetGraph, '', restricts)
      .then(result => this.reference.addReference(result), ignoreModalClose);
  }
}
