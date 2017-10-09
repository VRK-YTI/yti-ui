import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConceptNode, VocabularyNode } from '../../entities/node';
import { EditableService } from '../../services/editable.service';
import { FormReferenceLiteral, FormReferenceTerm } from '../../services/form-state';

export type FormReference = FormReferenceLiteral<any>
                          | FormReferenceTerm;

@Component({
  selector: 'app-reference',
  styleUrls: ['./reference.component.scss'],
  template: `
    <dl *ngIf="show">
      <dt><label [for]="id">{{reference.label | translateValue:false}}</label></dt>
      <dd>
        <ng-container [ngSwitch]="reference.referenceType">

          <app-terms *ngSwitchCase="'Term'"
                     [reference]="reference"
                     [multiColumn]="multiColumnTerms"
                     [unsaved]="unsaved"
                     [filterLanguage]="filterLanguage"></app-terms>

          <app-concept-reference-input *ngSwitchCase="'Concept'"
                                       [reference]="reference"
                                       [self]="concept"
                                       [vocabulary]="vocabulary"
                                       (conceptRemove)="conceptRemove.next($event)"></app-concept-reference-input>

          <app-concept-link-reference-input *ngSwitchCase="'ConceptLink'"
                                            [reference]="reference"
                                            [vocabulary]="vocabulary"></app-concept-link-reference-input>
          
          <app-group-input *ngSwitchCase="'Group'" 
                           [reference]="reference"></app-group-input>

          <app-organization-input *ngSwitchCase="'Organization'" 
                                  [reference]="reference"></app-organization-input>

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
  @Input() vocabulary: VocabularyNode;
  @Input() concept: ConceptNode;
  @Input() multiColumnTerms = false;
  @Input() filterLanguage: string;
  @Output() conceptRemove = new EventEmitter<ConceptNode>();

  constructor(private editableService: EditableService) {
  }

  get show() {
    return this.editableService.editing || this.reference.value.length > 0;
  }
}
