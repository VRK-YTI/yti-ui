import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConceptNode, VocabularyNode } from 'app/entities/node';
import { EditableService } from 'app/services/editable.service';
import { FormReferenceLiteral, FormReferenceTerm } from 'app/services/form-state';

export type FormReference = FormReferenceLiteral<any>
                          | FormReferenceTerm;

@Component({
  selector: 'app-reference',
  styleUrls: ['./reference.component.scss'],
  template: `
    <dl *ngIf="show">
      <dt><label [for]="id">{{reference.label | translateValue:true}}</label></dt>
      <dd>
        <ng-container [ngSwitch]="reference.referenceType">

          <app-terms *ngSwitchCase="'Term'"
                     [id]="id"
                     [reference]="reference"
                     [unsaved]="unsaved"
                     [filterLanguage]="filterLanguage"></app-terms>

          <app-concept-reference-input *ngSwitchCase="'Concept'"
                                       [reference]="reference"
                                       [id]="id"
                                       [self]="concept"
                                       [vocabulary]="vocabulary"
                                       (conceptRemove)="conceptRemove.next($event)"></app-concept-reference-input>

          <app-concept-link-reference-input *ngSwitchCase="'ConceptLink'"
                                            [id]="id"
                                            [reference]="reference"
                                            [vocabulary]="vocabulary"></app-concept-link-reference-input>
          
          <app-group-input *ngSwitchCase="'Group'"
                           [id]="id"
                           [reference]="reference"></app-group-input>

          <app-organization-input *ngSwitchCase="'Organization'"
                                  [id]="id"
                                  [reference]="reference"
                                  [vocabulary]="vocabulary"></app-organization-input>

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
  @Input() filterLanguage: string;
  @Output() conceptRemove = new EventEmitter<ConceptNode>();

  constructor(private editableService: EditableService) {
  }

  get show() {
    return this.editableService.editing || this.reference.value.length > 0;
  }
}
