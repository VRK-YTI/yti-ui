import { Component, Input } from '@angular/core';
import { Reference } from '../entities/node';

@Component({
  selector: 'concept-reference-input',
  styleUrls: ['./concept-reference-input.component.scss'],
  template: `
    <span *ngFor="let node of concept.values; let last = last">
      <a [routerLink]="['/concepts', node.graphId, 'concept', node.id]">{{node.label | translateValue}}<span *ngIf="!last">, </span></a>
    </span>
  `
})
export class ConceptReferenceInputComponent {

  @Input() concept: Reference;
}
