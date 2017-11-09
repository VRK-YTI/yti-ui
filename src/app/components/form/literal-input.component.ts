import { Component, Input  } from '@angular/core';
import { EditableService } from '../../services/editable.service';
import { FormPropertyLiteral } from '../../services/form-state';

@Component({
  styleUrls: ['./literal-input.component.scss'],
  selector: 'app-literal-input',
  template: `
    
    <span *ngIf="!editing && property.valueIsLocalizationKey">{{property.value | translate}}</span>
    <span *ngIf="!editing && !property.valueIsLocalizationKey">{{property.value}}</span>

    <div *ngIf="editing">

      <div class="form-group">
      
        <ng-container [ngSwitch]="property.editorType">
          
          <input *ngSwitchCase="'input'" 
                 type="text"
                 class="form-control"
                 [ngClass]="{'is-invalid': valueInError()}"
                 [id]="id"
                 autocomplete="off"
                 [formControl]="property.control" />

          <app-markdown-input *ngSwitchCase="'markdown'"
                              [id]="id"
                              [formControl]="property.control"></app-markdown-input>

          <app-status-input *ngSwitchCase="'status'"
                            [id]="id"
                            [formControl]="property.control"></app-status-input>

          <app-language-input *ngSwitchCase="'language'"
                              [id]="id"
                              [formControl]="property.control"></app-language-input>

          <app-error-messages [control]="property.control"></app-error-messages>
          
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
