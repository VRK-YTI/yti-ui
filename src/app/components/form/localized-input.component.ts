import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ConceptNode } from '../../entities/node';
import { EditableService } from '../../services/editable.service';
import { FormPropertyLocalizable } from '../../services/form-state';

@Component({
  selector: 'app-localized-input',
  styleUrls: ['./localized-input.component.scss'],
  template: `

    <div *ngIf="canAdd()" class="clearfix">
      <div ngbDropdown class="add-button" placement="bottom-right">
        <button class="btn btn-default"
                ngbDropdownToggle
                ngbTooltip="{{'Add' | translate}} {{property.label | translateValue:false | lowercase}}">
          <i class="fa fa-plus"></i>
        </button>
        <div ngbDropdownMenu>
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
          <div *ngIf="editing" class="form-group">

            <ng-container [ngSwitch]="property.editorType">

              <input *ngSwitchCase="'input'"
                     type="text"
                     class="form-control"
                     [ngClass]="{'is-invalid': !child.control.valid}"
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
                ngbTooltip="{{'Remove' | translate}} {{property.label | translateValue:false | lowercase}}" [placement]="'left'">
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

    const allowMultiple = this.property.cardinality === 'multiple';
    const isNotAddedYet = (lang: string) => !this.property.addedLanguages.includes(lang);

    return this.languages.filter(lang =>
      this.isLanguageVisible(lang) && (allowMultiple || isNotAddedYet(lang)));
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
    return this.property.children.filter(child => this.isLanguageVisible(child.lang));
  }

  isLanguageVisible(language: string) {
    return !this.filterLanguage || language === this.filterLanguage;
  }
}
