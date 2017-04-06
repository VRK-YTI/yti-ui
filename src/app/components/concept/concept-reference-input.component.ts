import { Component, Input } from '@angular/core';
import { Reference, ConceptNode } from '../../entities/node';
import { EditableService } from '../../services/editable.service';
import { SearchConceptModalService } from './search-concept.modal';
import { remove } from '../../utils/array';

@Component({
  selector: 'concept-reference-input',
  styleUrls: ['./concept-reference-input.component.scss'],
  template: `
    <ul *ngIf="!editing">
      <li *ngFor="let concept of conceptReference.values">
        <a [routerLink]="['/concepts', concept.graphId, 'concept', concept.id]">{{concept.label | translateValue}}</a>
      </li>
    </ul>

    <div *ngIf="editing">
      <div *ngFor="let concept of conceptReference.values">
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

  @Input('concept') conceptReference: Reference<ConceptNode>;
  @Input() conceptsProvider: () => ConceptNode[];

  constructor(private editableService: EditableService,
              private searchConceptModal: SearchConceptModalService) {
  }

  get editing() {
    return this.editableService.editing;
  }

  removeReference(concept: ConceptNode) {
    remove(this.conceptReference.values, concept);
  }

  addReference() {
    this.searchConceptModal.open(this.conceptsProvider).then(result => {
      this.conceptReference.values.push(result);
    });
  }
}
