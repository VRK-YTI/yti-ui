import { Component, Input } from '@angular/core';
import { ConceptNode } from 'app/entities/node';
import { EditableService } from 'app/services/editable.service';
import { FormPropertyLiteral, FormPropertyLiteralList, FormPropertyLocalizable } from 'app/services/form-state';

type FormProperty = FormPropertyLiteral
                  | FormPropertyLiteralList
                  | FormPropertyLocalizable;

@Component({
  selector: 'app-property',
  styleUrls: ['./property.component.scss'],
  template: `
    <dl *ngIf="show">
      <dt>
        <label [for]="id">
          {{label | translateValue:true}}
          <span *ngIf="hasDescription()" 
                class="fa fa-info-circle info" 
                ngbTooltip="{{description | translateValue:true}}"></span>
        </label>
        <app-required-symbol *ngIf="editing && property.required"></app-required-symbol>
      </dt>
      <dd [ngSwitch]="property.type">
        
        <app-localized-input *ngSwitchCase="'localizable'"
                             [id]="id"
                             [property]="property"
                             [conceptSelector]="conceptSelector"
                             [relatedConcepts]="relatedConcepts"
                             [filterLanguage]="filterLanguage"></app-localized-input>
        
        <app-literal-input *ngSwitchCase="'literal'" 
                           [id]="id" 
                           [property]="property"></app-literal-input>
        
        <app-literal-list-input *ngSwitchCase="'literal-list'" 
                                [id]="id" 
                                [property]="property"></app-literal-list-input>
        
        <span *ngSwitchDefault>ERROR - unknown property type</span>
      </dd>
    </dl>
  `
})
export class PropertyComponent {

  @Input() id: string;
  @Input() property: FormProperty;

  @Input() conceptSelector: (name: string) => Promise<ConceptNode|null>;
  @Input() relatedConcepts: ConceptNode[] = [];

  @Input() filterLanguage: string;

  constructor(private editableService: EditableService) {
  }

  get show() {
    return this.editableService.editing || !this.property.valueEmpty;
  }

  get label() {
    return this.property.label;
  }

  hasDescription() {
    return Object.values(this.property.description).length > 0;
  }

  get description() {
    return this.property.description;
  }

  get editing() {
    return this.editableService.editing;
  }
}
