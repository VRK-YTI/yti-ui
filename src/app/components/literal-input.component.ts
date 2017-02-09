import { Component, Input, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { PropertyMeta } from '../entities/meta';
import { Property } from '../entities/node';
import { EditableService } from '../services/editable.service';

@Component({
  styleUrls: ['./literal-input.component.scss'],
  selector: 'literal-input',
  template: `
    <span *ngIf="!editing">{{property.value}}</span>
    <div *ngIf="editing" class="form-group" [ngClass]="{'has-danger': valueInError}">
        <div *ngIf="!area">
          <input type="text" 
                 class="form-control" 
                 [name]="meta.id"
                 autocomplete="off"
                 [(ngModel)]="property.value"
                 [validateMeta]="meta"
                 #ngModel="ngModel" />
               
           <error-messages [control]="ngModel.control"></error-messages>
        </div>
        
       <div *ngIf="area">
         <textarea class="form-control" 
                   [name]="meta.id"
                   autocomplete="off"
                   [(ngModel)]="property.value"
                   [validateMeta]="meta"
                   #areaNgModel="ngModel"></textarea>
                       
          <error-messages [control]="areaNgModel.control"></error-messages> 
       </div>
    </div>
  `
})
export class LiteralInputComponent {

  @Input() property: Property;
  @Input() meta: PropertyMeta;

  @ViewChild('ngModel') ngModel: NgModel;
  @ViewChild('areaNgModel') areaNgModel: NgModel;

  constructor(private editableService: EditableService) {
  }

  get valueInError() {
    return (this.ngModel && this.ngModel.errors) || (this.areaNgModel && this.areaNgModel.errors);
  }

  get area() {
    return this.meta ? this.meta.area : false;
  }

  get editing() {
    return this.editableService.editing;
  }
}
