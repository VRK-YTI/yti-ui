import { Component, Input } from '@angular/core';
import { Property } from '../entities/node';

@Component({
  selector: 'property',
  styleUrls: ['./property.component.scss'],
  template: `
    <dl class="row">
      <dt class="col-md-3">{{property.meta.label | translateValue}}</dt>
      <dd class="col-md-9">
        <localized *ngIf="property.meta.type === 'localizable'" [value]="property.value"></localized>
        <span *ngIf="property.meta.type === 'translation-key'">{{property.value | translate}}</span>
        <span *ngIf="property.meta.type === 'string'">{{property.value}}</span>
      </dd>
    </dl>
  `
})
export class PropertyComponent {

  @Input('value') property: Property;
}
