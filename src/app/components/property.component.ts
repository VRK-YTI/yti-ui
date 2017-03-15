import { Component, Input } from '@angular/core';
import { Node, Property } from '../entities/node';
import { EditableService } from '../services/editable.service';

@Component({
  selector: 'property',
  styleUrls: ['./property.component.scss'],
  template: `
    <dl *ngIf="show">
      <dt><label [for]="property.meta.id">{{property.meta.label | translateValue}}</label></dt>
      <dd>
        <localized-input *ngIf="property.meta.type === 'localizable'" [meta]="property.meta" [value]="property.value" [relatedConcepts]="relatedConcepts"></localized-input>
        <literal-input *ngIf="property.meta.type === 'string'" [meta]="property.meta" [property]="property"></literal-input>
        <span *ngIf="property.meta.type === 'translation-key'">{{property.value | translate}}</span>
      </dd>
    </dl>
  `
})
export class PropertyComponent {

  @Input('value') property: Property;
  @Input() relatedConcepts: Node<'Concept'>[];

  constructor(private editableService: EditableService) {
  }

  get show() {
    return this.editableService.editing || !this.property.empty;
  }
}
