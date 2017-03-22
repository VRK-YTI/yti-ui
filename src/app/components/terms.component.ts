import { Component, Input } from '@angular/core';
import { Reference } from '../entities/node';
import { EditableService } from '../services/editable.service';
import { Node } from '../entities/node';
import { Localization } from '../entities/localization';

@Component({
  selector: 'terms',
  styleUrls: ['./terms.component.scss'],
  template: `              
    <ngb-accordion>
      <ngb-panel *ngFor="let term of nonEmptyTerms">
        <template ngbPanelTitle>
          <div class="language">{{term.properties['prefLabel'].value[0].lang.toUpperCase()}}</div> 
          <div class="localization">{{term.properties['prefLabel'].value[0].value}} <accordion-chevron class="pull-right"></accordion-chevron></div>
        </template>
        <template ngbPanelContent>
          <div class="row">
            <div class="col-md-6" *ngFor="let property of term | properties: showEmpty">
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

  get nonEmptyTerms() {
    return this.termReference.values.filter(term => this.editableService.editing || !!this.localizationOfTerm(term).value.trim());
  }

  localizationOfTerm(term: Node<'Term'>): Localization {
    return term.properties['prefLabel'].value[0] as Localization;
  }

  get showEmpty() {
    return this.editableService.editing;
  }
}
