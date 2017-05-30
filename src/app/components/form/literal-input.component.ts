import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Property } from '../../entities/node';
import { EditableService } from '../../services/editable.service';
import { Attribute } from '../../entities/node-api';

@Component({
  styleUrls: ['./literal-input.component.scss'],
  selector: 'literal-input',
  template: `
    <span *ngIf="!editing">{{property.asString()}}</span>

    <div *ngIf="editing">

      <div *ngIf="canAdd()" class="clearfix">
        <button type="button"
                ngbTooltip="{{'Add' | translate}} {{property.meta.label | translateValue | lowercase}}" [placement]="'left'"
                class="btn btn-default add-button"
                (click)="addNewValue()">
          <i class="fa fa-plus"></i>
        </button>
      </div>
      
      <div *ngFor="let attribute of property.attributes; let index = index">
        <div class="form-group" 
             [ngClass]="{'has-danger': valueInError(index), 'removable': canRemove()}">

          <ng-container [ngSwitch]="editorType">

            <div *ngSwitchCase="'input'">
              <input type="text"
                     class="form-control"
                     [id]="property.meta.id + index"
                     autocomplete="off"
                     [(ngModel)]="attribute.value"
                     [validateMeta]="property.meta"
                     #ngModel="ngModel"/>
    
              <error-messages [control]="ngModel.control"></error-messages>
            </div>

            <div *ngSwitchCase="'markdown'">
              <markdown-input [id]="property.meta.id + index"
                              [(ngModel)]="attribute.value"
                              [validateMeta]="property.meta"
                              #ngModel="ngModel"></markdown-input>

              <error-messages [control]="ngModel.control"></error-messages>
            </div>
            
          </ng-container>
        </div>
  
        <button *ngIf="canRemove()" 
                class="btn btn-default remove-button"
                (click)="removeValue(attribute)"
                ngbTooltip="{{'Remove' | translate}} {{property.meta.label | translateValue | lowercase}}" [placement]="'left'">
          <i class="fa fa-trash"></i>
        </button>
      </div>
      
    </div>
  `
})
export class LiteralInputComponent {

  @Input() property: Property;

  @ViewChildren('ngModel') ngModel: QueryList<NgModel>;

  constructor(private editableService: EditableService) {
  }

  valueInError(index: number) {

    function isNgModelValid(ngModel: QueryList<NgModel>) {
      if (!ngModel) {
        return true;
      } else {
        const ngModels = ngModel.toArray();
        return ngModels.length === 0 || ngModels.length <= index || ngModels[index].valid;
      }
    }

    return !isNgModelValid(this.ngModel);
  }

  addNewValue() {
    this.property.newLiteral();
  }

  removeValue(attribute: Attribute) {
    this.property.remove(attribute);
  }

  get editorType() {
    return this.property.meta.typeAsString.editorType;
  }

  canAdd() {
    return this.property.meta.typeAsString.cardinality === 'multiple'
  }

  canRemove() {
    return this.property.attributes.length > 1;
  }

  get editing() {
    return this.editableService.editing;
  }
}
