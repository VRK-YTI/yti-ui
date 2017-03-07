import { Component, Input, ViewChild } from '@angular/core';
import { Node } from '../entities/node';
import { EditableService } from '../services/editable.service';
import { NgModel } from '@angular/forms';
import { PropertyMeta } from '../entities/meta';

@Component({
  selector: 'localized-input',
  styleUrls: ['./localized-input.component.scss'],
  template: `
    <div class="localized" *ngFor="let localization of value">
      <div class="language" [class.editing]="editing">
        <span *ngIf="!editing">{{localization.lang}}</span>
        <div *ngIf="editing" class="form-group" [ngClass]="{'has-danger': langNgModel.control.errors}"> 
          <input type="text" class="form-control"
                 autocomplete="off"
                 validateLanguage
                 [(ngModel)]="localization.lang"
                 #langNgModel="ngModel" />
                         
          <error-messages [control]="langNgModel.control"></error-messages>
        </div>        
      </div> 
      <div class="localization" [class.editing]="editing">
        <div *ngIf="!editing" markdown-links [value]="localization.value" [relatedConcepts]="relatedConcepts"></div>
        <div *ngIf="editing" class="form-group" [ngClass]="{'has-danger': valueInError}">
        
          <div *ngIf="!area">
            <input type="text" 
                   class="form-control"
                   autocomplete="off"
                   validateLocalization
                   [(ngModel)]="localization.value"
                   #valueNgModel="ngModel" />
                 
            <error-messages [control]="valueNgModel.control"></error-messages>
          </div>
                
          <div *ngIf="area">
            <textarea class="form-control"
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

  @Input() meta: PropertyMeta;
  @Input() value: { [language: string]: string; };
  @Input() relatedConcepts: Node<'Concept'>[];

  @ViewChild('valueNgModel') valueNgModel: NgModel;
  @ViewChild('areaValueNgModel') areaValueNgModel: NgModel;
  @ViewChild('langNgModel') langNgModel: NgModel;

  constructor(private editingService: EditableService) {
  }

  get valueInError() {
    return (this.valueNgModel && this.valueNgModel.errors) || (this.areaValueNgModel && this.areaValueNgModel.errors);
  }

  get area() {
    return this.meta.area;
  }

  get editing() {
    return this.editingService.editing;
  }
}
