import { Component, Input } from '@angular/core';
import { EditableService } from '../../services/editable.service';
import { FormPropertyLiteralList } from '../../services/form-state';
import { FormControl } from '@angular/forms';

@Component({
  styleUrls: ['./literal-list-input.component.scss'],
  selector: 'literal-list-input',
  template: `    
    <span *ngIf="!editing">{{property.valueAsString}}</span>

    <div *ngIf="editing">

      <div class="clearfix">
        <button type="button"
                ngbTooltip="{{'Add' | translate}} {{property.label | translateValue | lowercase}}" [placement]="'left'"
                class="btn btn-default add-button"
                (click)="addNewValue()">
          <i class="fa fa-plus"></i>
        </button>
      </div>

      <div *ngFor="let control of property.children">
        <div class="form-group" [ngClass]="{'has-danger': !control.valid, 'removable': canRemove()}">

          <ng-container [ngSwitch]="property.editorType">
            
            <input *ngSwitchCase="'input'"
                   type="text"
                   class="form-control"
                   [id]="id"
                   autocomplete="off" 
                   [formControl]="control" />
              
            <markdown-input *ngSwitchCase="'markdown'"
                            [id]="id"
                            [formControl]="control"></markdown-input>

          </ng-container>

          <error-messages [control]="control"></error-messages>
        </div>

        <button *ngIf="canRemove()"
                class="btn btn-default remove-button"
                (click)="removeValue(control)"
                ngbTooltip="{{'Remove' | translate}} {{property.label | translateValue | lowercase}}" [placement]="'left'">
          <i class="fa fa-trash"></i>
        </button>
      </div>

      <div *ngIf="property.value.length === 0" translate>No values yet</div>
      <error-messages [control]="property.control"></error-messages>

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
}
