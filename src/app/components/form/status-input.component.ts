import { Component, Input, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { EditableService } from '../../services/editable.service';
import { Property } from '../../entities/node';
import { statuses } from '../../entities/constants';

@Component({
  selector: 'status-input',
  styleUrls: ['./status-input.component.scss'],
  template: `
    <span *ngIf="!editing">{{property.value | translate}}</span>
    <div *ngIf="editing" class="form-group" [ngClass]="{'has-danger': valueInError}">
      <div>
        <select class="form-control" 
                [id]="property.meta.id"
                [(ngModel)]="property.value"
                #ngModel="ngModel">
          <option *ngFor="let status of statuses" [ngValue]="status">{{status | translate}}</option>        
        </select>
             
         <error-messages [control]="ngModel.control"></error-messages>
      </div>
    </div>
  `
})
export class StatusInputComponent {

  @Input() property: Property;
  @ViewChild('ngModel') ngModel: NgModel;

  statuses = statuses;

  constructor(private editableService: EditableService) {
  }

  get valueInError() {
    return this.ngModel && this.ngModel.errors;
  }

  get editing() {
    return this.editableService.editing;
  }
}
