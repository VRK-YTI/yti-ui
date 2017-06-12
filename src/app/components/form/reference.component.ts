import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConceptNode } from '../../entities/node';
import { EditableService } from '../../services/editable.service';
import { FormReferenceLiteral, FormReferenceTerm } from '../../services/form-state';

export type FormReference = FormReferenceLiteral<any>
                          | FormReferenceTerm;

@Component({
  selector: 'reference',
  styleUrls: ['./reference.component.scss'],
  template: `
    <dl *ngIf="show">
      <dt><label [for]="id">{{reference.label | translateValue}}</label></dt>
      <dd>
        <ng-container [ngSwitch]="reference.referenceType">
          
          <primary-terms *ngSwitchCase="'PrimaryTerm'" 
                         [reference]="reference"
                         [multiColumn]="multiColumnTerms"
                         [unsaved]="unsaved"></primary-terms>

          <synonyms *ngSwitchCase="'Synonym'" 
                    [reference]="reference"
                    [multiColumn]="multiColumnTerms"></synonyms>

          <concept-reference-input *ngSwitchCase="'Concept'" [reference]="reference" (conceptRemove)="conceptRemove.next($event)"></concept-reference-input>

          <concept-link-reference-input *ngSwitchCase="'ConceptLink'" [reference]="reference"></concept-link-reference-input>
          
          <group-input *ngSwitchCase="'Group'" [reference]="reference"></group-input>
          
          <organization-input *ngSwitchCase="'Organization'" [reference]="reference"></organization-input>
          
          <div *ngSwitchDefault>
            <span *ngFor="let referenceNode of reference.value; let last = last">
              <span>{{referenceNode.label | translateValue}}<span *ngIf="!last">, </span></span>
            </span>
          </div>

        </ng-container>
      </dd>
    </dl>
  `
})
export class ReferenceComponent {

  @Input() id: string;
  @Input() reference: FormReference;
  @Input() unsaved: boolean;
  @Input() multiColumnTerms = false;
  @Output() conceptRemove = new EventEmitter<ConceptNode>();

  constructor(private editableService: EditableService) {
  }

  onConceptRemove(concept: ConceptNode) {
    this.conceptRemove.next(concept);
  }

  get show() {
    return this.editableService.editing || this.reference.value.length > 0;
  }
}
