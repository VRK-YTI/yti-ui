import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ConceptNode, Property } from '../../entities/node';
import { EditableService } from '../../services/editable.service';
import { Localization } from '../../entities/localization';
import { Attribute } from '../../entities/node-api';

@Component({
  selector: 'localized-input',
  styleUrls: ['./localized-input.component.scss'],
  template: `

    <div *ngIf="canAdd()" class="clearfix">
      <div ngbDropdown class="add-button">
        <button class="btn btn-default" ngbDropdownToggle ngbTooltip="{{'Add' | translate}} {{property.meta.label | translateValue | lowercase}}"><i class="fa fa-plus"></i></button>
        <div class="dropdown-menu">
          <button class="dropdown-item" *ngFor="let language of property.languages" (click)="addNewLocalization(language)">{{language | uppercase}}</button>
        </div>
      </div>
    </div>
    
    <div *ngIf="visibleValues.length > 0">
      <div class="localized" *ngFor="let localization of visibleValues; let index = index">
        <div class="language">
          <span>{{localization.lang.toUpperCase()}}</span>
        </div> 
        <div class="localization" [class.editing]="editing" [class.removable]="canRemove()">
          <div *ngIf="!editing" markdown-links [value]="localization.value" [relatedConcepts]="relatedConcepts"></div>
          <div *ngIf="editing" class="form-group" [ngClass]="{'has-danger': valueInError(index)}">
          
            <div *ngIf="!area">
              <input type="text"
                     class="form-control"
                     [id]="property.meta.id + localization.lang"
                     autocomplete="off"
                     validateLocalization
                     [(ngModel)]="localization.value"
                     #ngModel="ngModel" />
                   
              <error-messages [control]="ngModel.control"></error-messages>
            </div>
                  
            <div *ngIf="area">
              <textarea class="form-control"
                        [id]="property.meta.id + localization.lang"
                        autocomplete="off"
                        rows="4"
                        validateLocalization
                        [(ngModel)]="localization.value"
                        #areaNgModel="ngModel"></textarea>
             
              <error-messages [control]="areaNgModel.control"></error-messages>
            </div>                         
          </div>
        </div>
        
        <button *ngIf="canRemove()"
                class="btn btn-default remove-button"
                (click)="removeValue(localization)"
                ngbTooltip="{{'Remove' | translate}} {{property.meta.label | translateValue | lowercase}}" [placement]="'left'">
          <i class="fa fa-trash"></i>
        </button>
      </div>
    </div>

    <div *ngIf="visibleValues.length === 0" translate>No values yet</div>
  `
})
export class LocalizedInputComponent {

  @Input() property: Property;
  @Input() relatedConcepts: ConceptNode[];

  @ViewChildren('ngModel') ngModel: QueryList<NgModel>;
  @ViewChildren('areaNgModel') areaNgModel: QueryList<NgModel>;

  constructor(private editingService: EditableService) {
  }

  canAdd() {
    return this.editing && this.property.meta.typeAsLocalizable.cardinality === 'multiple';
  }

  canRemove() {
    return this.canAdd();
  }

  get value() {
    return this.property.attributes as Localization[];
  }

  get visibleValues() {
    return this.value.filter(localization => this.editing || !!localization.value.trim());
  }

  valueInError(index: number) {

    function isNgModelValid(ngModel: QueryList<NgModel>) {
      if (!ngModel) {
        return true;
      } else {
        const ngModels = ngModel.toArray();
        return ngModels.length > index && ngModels[index].valid;
      }
    }

    return !isNgModelValid(this.area ? this.areaNgModel : this.ngModel);
  }

  addNewLocalization(language: string) {
    this.property.newLocalization(language);
  }

  removeValue(attribute: Attribute) {
    this.property.remove(attribute);
  }

  get area() {
    return this.property.meta.typeAsLocalizable.area;
  }

  get cardinality() {
    return this.property.meta.typeAsLocalizable.cardinality;
  }

  get editing() {
    return this.editingService.editing;
  }
}
