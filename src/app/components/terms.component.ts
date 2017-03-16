import { Component, Input } from '@angular/core';
import { Reference } from '../entities/node';
import { EditableService } from '../services/editable.service';

@Component({
  selector: 'terms',
  styleUrls: ['./terms.component.scss'],
  template: `              
    <ngb-accordion>
      <ngb-panel *ngFor="let term of termReference.values">
        <template ngbPanelTitle>
          <localized-input [property]="term.properties.prefLabel"></localized-input>
        </template>
        <template ngbPanelContent>
          <div class="row" style="margin-left: 50px">
            <div class="col-md-6" *ngFor="let property of term | properties: showEmpty : ['prefLabel']">
              <property [value]="property"></property>
            </div>
          </div>
        </template>
      </ngb-panel>
    </ngb-accordion>
  `
})
export class TermsComponent {

  @Input('value') termReference: Reference;


  constructor(private editableService: EditableService) {
  }

  get showEmpty() {
    return this.editableService.editing;
  }
}
