import { Component, Input } from '@angular/core';
import { EditableService } from 'app/services/editable.service';
import { FormPropertyLiteralList } from 'app/services/form-state';
import { FormControl } from '@angular/forms';

@Component({
  styleUrls: ['./literal-list-input.component.scss'],
  selector: 'app-literal-list-input',
  template: `

    <div *ngIf="!editing">
      <ng-container [ngSwitch]="property.editor.type">

        <div *ngSwitchCase="'semantic'">

          <div *ngFor="let value of property.value">
            <div app-semantic-text-links
                 [format]="property.editor.format"
                 [value]="value">
            </div>
          </div>
        </div>

        <div *ngSwitchDefault>
          {{property.valueAsString}}
        </div>

      </ng-container>
    </div>

    <div *ngIf="editing">

      <div class="clearfix">
        <button type="button"
                class="btn btn-link add-button"
                (click)="addNewValue()">
          <span>{{'Add' | translate}} {{property.label | translateValue:true | lowercase}}</span>
        </button>
      </div>

      <div [appDragSortable]="property" [dragDisabled]="!canReorder()">
        <div *ngFor="let control of property.children; let i = index">

          <div class="d-inline-block" style="width: 100%" [appDragSortableItem]="control" [index]="i">
            <div class="form-group" [ngClass]="{'removable': canRemove()}">

              <div [ngSwitch]="property.editor.type">

                <input *ngSwitchCase="'input'"
                       type="text"
                       class="form-control"
                       [ngClass]="{'is-invalid': !control.valid}"
                       [id]="id"
                       autocomplete="off"
                       [formControl]="control" />

                <textarea *ngSwitchCase="'textarea'"
                          class="form-control"
                          [ngClass]="{'is-invalid': !control.valid}"
                          [id]="id"
                          [formControl]="control"></textarea>

                <app-semantic-text-input *ngSwitchCase="'semantic'"
                                         [id]="id"
                                         [format]="property.editor.format"
                                         [formControl]="control"></app-semantic-text-input>

                <app-language-input *ngSwitchCase="'language'"
                                    [id]="id"
                                    [formControl]="control"></app-language-input>

              </div>

              <app-error-messages [control]="control"></app-error-messages>
            </div>

            <button *ngIf="canRemove()"
                    class="btn btn-link remove-button"
                    (click)="removeValue(control)"
                    ngbTooltip="{{'Remove' | translate}} {{property.label | translateValue:true | lowercase}}" [placement]="'left'">
              <i class="fa fa-trash"></i>
            </button>

            <div class="reorder-handle">
              <span class="fa fa-bars"></span>
            </div>

          </div>
        </div>
      </div>

      <div *ngIf="property.value.length === 0" translate>No values yet</div>
      <app-error-messages [control]="property.control"></app-error-messages>

    </div>
  `
})
export class LiteralListInputComponent {

  @Input() id: string;
  @Input() property: FormPropertyLiteralList;

  constructor(private editableService: EditableService) {
  }

  addNewValue() {
    this.property.append('');
  }

  removeValue(control: FormControl) {
    this.property.remove(control);
  }

  canRemove() {
    return true;
  }

  get editing() {
    return this.editableService.editing;
  }

  canReorder() {
    return this.editing && this.property.children.length > 1;
  }
}
