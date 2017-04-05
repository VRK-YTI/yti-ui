import { Component, Input, ViewChild } from '@angular/core';
import { ConceptNode, Property } from '../entities/node';
import { EditableService } from '../services/editable.service';
import { NgModel } from '@angular/forms';
import { Localization } from '../entities/localization';

@Component({
  selector: 'localized-input',
  styleUrls: ['./localized-input.component.scss'],
  template: `
    <div class="localized" *ngFor="let localization of visibleValues">
      <div class="language">
        <span>{{localization.lang.toUpperCase()}}</span>
      </div> 
      <div class="localization" [class.editing]="editing">
        <div *ngIf="!editing" markdown-links [value]="localization.value" [relatedConcepts]="relatedConcepts"></div>
        <div *ngIf="editing" class="form-group" [ngClass]="{'has-danger': valueInError}">
        
          <div *ngIf="!area">
            <input type="text"
                   class="form-control"
                   [id]="property.meta.id"
                   autocomplete="off"
                   validateLocalization
                   [(ngModel)]="localization.value"
                   #valueNgModel="ngModel" />
                 
            <error-messages [control]="valueNgModel.control"></error-messages>
          </div>
                
          <div *ngIf="area">
            <textarea class="form-control"
                      [id]="property.meta.id"
                      autocomplete="off"
                      rows="4"
                      validateLocalization
                      [(ngModel)]="localization.value"
                      #areaValueNgModel="ngModel"></textarea>
           
            <error-messages [control]="areaValueNgModel.control"></error-messages>
          </div>                         
        </div>
      </div>
    </div>
  `
})
export class LocalizedInputComponent {

  @Input() property: Property;
  @Input() relatedConcepts: ConceptNode[];

  @ViewChild('valueNgModel') valueNgModel: NgModel;
  @ViewChild('areaValueNgModel') areaValueNgModel: NgModel;
  @ViewChild('langNgModel') langNgModel: NgModel;

  constructor(private editingService: EditableService) {
  }

  get value() {
    return this.property.value as Localization[];
  }

  get visibleValues() {
    return this.value.filter(localization => this.editing || !!localization.value.trim());
  }

  get valueInError() {
    return (this.valueNgModel && this.valueNgModel.errors) || (this.areaValueNgModel && this.areaValueNgModel.errors);
  }

  get area() {
    return this.property.meta.area;
  }

  get editing() {
    return this.editingService.editing;
  }
}
