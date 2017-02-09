import { Component, Input } from '@angular/core';
import { Node, Property } from '../entities/node';

@Component({
  selector: 'property',
  styleUrls: ['./property.component.scss'],
  template: `
    <dl class="row">
      <dt class="col-md-3"><label [for]="property.meta.id">{{property.meta.label | translateValue}}</label></dt>
      <dd class="col-md-9">
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
}
