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
    <div *ngIf="editing" class="form-group" [ngClass]="{'has-danger': ngModel.control.errors}"> 
        <input type="text" class="form-control" [name]="meta.id"
               autocomplete="off"
               [(ngModel)]="property.value"
               [validateMeta]="meta"
               #ngModel="ngModel" />
                       
        <error-messages [control]="ngModel.control"></error-messages>
    </div>
  `
})
export class LiteralInputComponent {

  @Input() property: Property;
  @Input() meta: PropertyMeta;

  @ViewChild('ngModel') ngModel: NgModel;

  constructor(private editableService: EditableService) {
  }

  get editing() {
    return this.editableService.editing;
  }
}
