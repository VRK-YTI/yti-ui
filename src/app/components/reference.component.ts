import { Component, Input } from '@angular/core';
import { Reference } from '../entities/node';
import { EditableService } from '../services/editable.service';

@Component({
  selector: 'reference',
  styleUrls: ['./reference.component.scss'],
  template: `
    <dl *ngIf="show">
      <dt><label [for]="reference.meta.id">{{reference.meta.label | translateValue}}</label></dt>
      <dd>
        <terms *ngIf="reference.term" [value]="reference"></terms>
        <div *ngIf="!reference.term">
          <span *ngFor="let referenceNode of reference.values; let last = last">
            <a *ngIf="referenceNode.concept" [routerLink]="['/concepts', referenceNode.graphId, 'concept', referenceNode.id]">{{referenceNode.label | translateValue}}<span *ngIf="!last">, </span></a>
            <span *ngIf="!referenceNode.concept">{{referenceNode.label | translateValue}}<span *ngIf="!last">, </span></span>
          </span>
        </div>
      </dd>
    </dl>
  `
})
export class ReferenceComponent {

  @Input('value') reference: Reference;

  constructor(private editableService: EditableService) {
  }

  get show() {
    return this.editableService.editing || !this.reference.empty;
  }
}
