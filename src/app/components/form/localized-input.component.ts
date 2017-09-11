import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ConceptNode } from '../../entities/node';
import { EditableService } from '../../services/editable.service';
import { FormPropertyLocalizable } from '../../services/form-state';
import { remove } from '../../utils/array';

@Component({
  selector: 'app-localized-input',
  styleUrls: ['./localized-input.component.scss'],
  template: `

    <div *ngIf="canAdd()" class="clearfix">
      <div ngbDropdown class="add-button">
        <button class="btn btn-default" 
                ngbDropdownToggle 
                ngbTooltip="{{'Add' | translate}} {{property.label | translateValue | lowercase}}">
          <i class="fa fa-plus"></i>
        </button>
        <div class="dropdown-menu">
          <button class="dropdown-item" 
                  *ngFor="let language of addableLanguages" 
                  (click)="addNewLocalization(language)">{{language | uppercase}}</button>
        </div>
      </div>
    </div>

    <div *ngIf="property.value.length > 0">
      <div class="localized" *ngFor="let child of visibleLocalizations">
          <div class="language">
            <span>{{child.lang.toUpperCase()}}</span>
          </div>
          <div class="localization" [class.editing]="editing" [class.removable]="canRemove()">
            <div *ngIf="!editing" app-markdown-links [value]="child.control.value" [relatedConcepts]="relatedConcepts"></div>
            <div *ngIf="editing" class="form-group" [ngClass]="{'has-danger': !child.control.valid}">

              <ng-container [ngSwitch]="property.editorType">

                <input *ngSwitchCase="'input'"
                      type="text"
                      class="form-control"
                      [id]="id"
                      autocomplete="off"
                      [formControl]="child.control" />

                <app-markdown-input *ngSwitchCase="'markdown'"
                                [id]="id"
                                [formControlClass]="false"
                                [conceptSelector]="conceptSelector"
                                [relatedConcepts]="relatedConcepts"
                                [formControl]="child.control"></app-markdown-input>

              </ng-container>

              <app-error-messages [control]="child.control"></app-error-messages>
            </div>
          </div>

          <button *ngIf="canRemove()"
                  class="btn btn-default remove-button"
                  (click)="removeValue(child)"
                  ngbTooltip="{{'Remove' | translate}} {{property.label | translateValue | lowercase}}" [placement]="'left'">
            <i class="fa fa-trash"></i>
          </button>
      </div>
    </div>

    <div *ngIf="property.value.length === 0" translate>No values yet</div>
    <app-error-messages [control]="property.control"></app-error-messages>
  `
})
export class LocalizedInputComponent {

  @Input() id: string;
  @Input() property: FormPropertyLocalizable;
  @Input() conceptSelector: (name: string) => Promise<ConceptNode|null>;
  @Input() relatedConcepts: ConceptNode[];
  @Input() filterLanguage: string;

  constructor(private editingService: EditableService) {
  }

  get languages() {
    return this.property.languages;
  }

  get addableLanguages() {

    if (this.property.cardinality === 'multiple') {
      return this.languages;
    } else {

      const result = this.languages.slice();

      for (const addedLanguage of this.property.addedLanguages) {
        remove(result, addedLanguage);
      }

      return result;
    }
  }

  canAdd() {
    return this.editing && !this.property.fixed && this.addableLanguages.length > 0;
  }

  canRemove() {
    return this.editing && !this.property.fixed;
  }

  addNewLocalization(language: string) {
    this.property.append(language, '');
  }

  removeValue(child: { lang: string, control: FormControl }) {
    this.property.remove(child);
  }

  get editing() {
    return this.editingService.editing;
  }

  get visibleLocalizations() {
    return this.property.children.filter(child =>
        !this.filterLanguage || child.lang === this.filterLanguage);
  }
}
