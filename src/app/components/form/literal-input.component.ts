import { Component, Input  } from '@angular/core';
import { EditableService } from '../../services/editable.service';
import { FormPropertyLiteral } from '../../services/form-state';

@Component({
  styleUrls: ['./literal-input.component.scss'],
  selector: 'literal-input',
  template: `
    
    <span *ngIf="!editing && property.valueIsLocalizationKey">{{property.value | translate}}</span>
    <span *ngIf="!editing && !property.valueIsLocalizationKey">{{property.value}}</span>

    <div *ngIf="editing">

      <div class="form-group" [ngClass]="{'has-danger': valueInError()}">
      
        <ng-container [ngSwitch]="property.editorType">
          
          <input *ngSwitchCase="'input'" 
                 type="text"
                 class="form-control"
                 [id]="id"
                 autocomplete="off"
                 [formControl]="property.control" />
          
          <markdown-input *ngSwitchCase="'markdown'" 
                          [id]="id"
                          [formControl]="property.control"></markdown-input>
          
          <status-input *ngSwitchCase="'status'"
                        [id]="id"
                        [formControl]="property.control"></status-input>
  
          <error-messages [control]="property.control"></error-messages>
          
        </ng-container>
        
      </div>
      
    </div>
  `
})
export class LiteralInputComponent {

  @Input() id: string;
  @Input() property: FormPropertyLiteral;

  constructor(private editableService: EditableService) {
  }

  valueInError() {
    return !this.property.control.valid;
  }

  get editing() {
    return this.editableService.editing;
  }
}
