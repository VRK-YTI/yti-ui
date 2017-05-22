import { Component, Input } from '@angular/core';
import { Reference } from '../../entities/node';
import { EditableService } from '../../services/editable.service';

@Component({
  selector: 'reference',
  styleUrls: ['./reference.component.scss'],
  template: `
    <dl *ngIf="show">
      <dt><label [for]="reference.meta.id">{{reference.meta.label | translateValue}}</label></dt>
      <dd>
        <ng-container [ngSwitch]="reference.type">

          <primary-terms *ngSwitchCase="'PrimaryTerm'" [value]="reference"
                         [multiColumn]="multiColumnTerms"
                         [unsaved]="unsaved"></primary-terms>

          <synonyms *ngSwitchCase="'Synonym'" [value]="reference" [multiColumn]="multiColumnTerms"></synonyms>

          <concept-reference-input *ngSwitchCase="'Concept'" [concept]="reference"></concept-reference-input>

          <concept-link-reference-input *ngSwitchCase="'ConceptLink'" [concept]="reference"></concept-link-reference-input>
          
          <group-input *ngSwitchCase="'Group'" [group]="reference"></group-input>
          
          <organization-input *ngSwitchCase="'Organization'" [organization]="reference"></organization-input>
          
          <div *ngSwitchDefault>
            <span *ngFor="let referenceNode of reference.values; let last = last">
              <span>{{referenceNode.label | translateValue}}<span *ngIf="!last">, </span></span>
            </span>
          </div>

        </ng-container>
      </dd>
    </dl>
  `
})
export class ReferenceComponent {

  @Input('value') reference: Reference<any>;
  @Input() unsaved: boolean;
  @Input() multiColumnTerms = false;

  constructor(private editableService: EditableService) {
  }

  get show() {
    return this.editableService.editing || !this.reference.empty;
  }
}
