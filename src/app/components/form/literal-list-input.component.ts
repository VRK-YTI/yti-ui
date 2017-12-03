import { Component, Input } from '@angular/core';
import { EditableService } from '../../services/editable.service';
import { FormPropertyLiteralList } from '../../services/form-state';
import { FormControl } from '@angular/forms';

@Component({
  styleUrls: ['./literal-list-input.component.scss'],
  selector: 'app-literal-list-input',
  template: `    
    <span *ngIf="!editing">{{property.valueAsString}}</span>

    <div *ngIf="editing">

      <div class="clearfix">
        <button type="button"
                class="btn btn-link add-button"
                (click)="addNewValue()">
          <span>{{'Add' | translate}} {{property.label | translateValue:false | lowercase}}</span>
        </button>
      </div>

      <div *ngFor="let control of property.children">
        <div class="form-group" [ngClass]="{'removable': canRemove()}">

          <ng-container [ngSwitch]="property.editorType">

            <input *ngSwitchCase="'input'"
                   type="text"
                   class="form-control"
                   [ngClass]="{'is-invalid': !control.valid}"
                   [id]="id"
                   autocomplete="off"
                   [formControl]="control" />

            <app-markdown-input *ngSwitchCase="'markdown'"
                                [id]="id"
                                [formControl]="control"></app-markdown-input>

            <app-language-input *ngSwitchCase="'language'"
                                [id]="id"
                                [formControl]="control"></app-language-input>

          </ng-container>

          <app-error-messages [control]="control"></app-error-messages>
        </div>

        <button *ngIf="canRemove()"
                class="btn btn-link remove-button"
                (click)="removeValue(control)"
                ngbTooltip="{{'Remove' | translate}} {{property.label | translateValue:false | lowercase}}" [placement]="'left'">
          <i class="fa fa-trash"></i>
        </button>
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
}
