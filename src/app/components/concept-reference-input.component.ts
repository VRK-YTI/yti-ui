import { Component, Input } from '@angular/core';
import { Reference } from '../entities/node';

@Component({
  selector: 'concept-reference-input',
  styleUrls: ['./concept-reference-input.component.scss'],
  template: `
    <ul>
      <li *ngFor="let concept of conceptReference.values; let last = last">
        <a [routerLink]="['/concepts', concept.graphId, 'concept', concept.id]">{{concept.label | translateValue}}</a>
      </li>
    </ul>
  `
})
export class ConceptReferenceInputComponent {

  @Input('concept') conceptReference: Reference;
}
