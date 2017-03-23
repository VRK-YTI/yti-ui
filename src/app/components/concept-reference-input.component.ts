import { Component, Input } from '@angular/core';
import { Reference, Node } from '../entities/node';
import { EditableService } from '../services/editable.service';
import { remove } from '../utils/array';

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
  `
})
export class ConceptReferenceInputComponent {

  @Input('concept') conceptReference: Reference;

  constructor(private editableService: EditableService) {
  }

  get editing() {
    return this.editableService.editing;
  }

  removeReference(concept: Node<'Concept'>) {
    remove(this.conceptReference.values, concept);
  }
}
