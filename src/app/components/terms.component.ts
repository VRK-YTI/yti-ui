import { Component, Input } from '@angular/core';
import { Reference } from '../entities/node';

@Component({
  selector: 'terms',
  styleUrls: ['./terms.component.scss'],
  template: `              
    <ngb-accordion>
      <ngb-panel *ngFor="let term of termReference.values">
        <template ngbPanelTitle>
          <localized-input [value]="term.properties.prefLabel.value"></localized-input>
        </template>
        <template ngbPanelContent>
          <property [value]="property" *ngFor="let property of term | properties: ['prefLabel']"></property>
        </template>
      </ngb-panel>
    </ngb-accordion>
  `
})
export class TermsComponent {

  @Input('value') termReference: Reference;
}
