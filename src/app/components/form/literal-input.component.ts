import { Component, Input  } from '@angular/core';
import { EditableService } from 'app/services/editable.service';
import { FormPropertyLiteral } from 'app/services/form-state';

@Component({
  styleUrls: ['./literal-input.component.scss'],
  selector: 'app-literal-input',
  template: `
    
    <div *ngIf="!editing">
      <ng-container [ngSwitch]="property.editor.type">

        <div *ngSwitchCase="'semantic'"
             app-semantic-text-links
             [format]="property.editor.format"
             [value]="property.value">
        </div>

        <div *ngSwitchCase="'status'">
          {{property.value | translate}}
        </div>
        
        <div *ngSwitchDefault>
          {{property.value}}
        </div>

      </ng-container>
    </div>

    <div *ngIf="editing">

      <div class="form-group">
      
        <ng-container [ngSwitch]="property.editor.type">
          
          <input *ngSwitchCase="'input'" 
                 type="text"
                 class="form-control"
                 [ngClass]="{'is-invalid': valueInError()}"
                 [id]="id"
                 autocomplete="off"
                 [formControl]="property.control" />
          
          <textarea *ngSwitchCase="'textarea'"
                    class="form-control"
                    [ngClass]="{'is-invalid': valueInError()}"
                    [id]="id"
                    [formControl]="property.control"></textarea>

          <app-semantic-text-input *ngSwitchCase="'semantic'"
                                   [id]="id"
                                   [format]="property.editor.format"
                                   [formControl]="property.control"></app-semantic-text-input>
          
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
