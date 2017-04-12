import { Component, Input, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Property } from '../../entities/node';
import { EditableService } from '../../services/editable.service';

@Component({
  styleUrls: ['./literal-input.component.scss'],
  selector: 'literal-input',
  template: `
    <span *ngIf="!editing">{{property.value}}</span>
    <div *ngIf="editing" class="form-group" [ngClass]="{'has-danger': valueInError}">
        <div *ngIf="!area">
          <input type="text" 
                 class="form-control" 
                 [id]="property.meta.id"
                 autocomplete="off"
                 [(ngModel)]="property.value"
                 [validateMeta]="property.meta"
                 #ngModel="ngModel" />
               
           <error-messages [control]="ngModel.control"></error-messages>
        </div>
        
       <div *ngIf="area">
         <textarea class="form-control" 
                   [id]="property.meta.id"
                   autocomplete="off"
                   [(ngModel)]="property.value"
                   [validateMeta]="property.meta"
                   #areaNgModel="ngModel"></textarea>
                       
          <error-messages [control]="areaNgModel.control"></error-messages> 
       </div>
    </div>
  `
})
export class LiteralInputComponent {

  @Input() property: Property;

  @ViewChild('ngModel') ngModel: NgModel;
  @ViewChild('areaNgModel') areaNgModel: NgModel;

  constructor(private editableService: EditableService) {
  }

  get valueInError() {
    return (this.ngModel && this.ngModel.errors) || (this.areaNgModel && this.areaNgModel.errors);
  }

  get area() {

    if (this.property.meta.type.type !== 'string') {
      throw new Error('Property is not string literal');
    }

    return this.property.meta.type.area;
  }

  get editing() {
    return this.editableService.editing;
  }
}
