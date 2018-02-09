import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ConceptNode } from 'app/entities/node';
import { EditableService } from 'app/services/editable.service';
import { FormPropertyLocalizable } from 'app/services/form-state';
import { contains } from 'yti-common-ui/utils/array';

@Component({
  selector: 'app-localized-input',
  styleUrls: ['./localized-input.component.scss'],
  template: `

    <div *ngIf="canAdd()" class="clearfix">
      <div ngbDropdown class="add-button" placement="bottom-right">
        <button class="btn btn-link" ngbDropdownToggle>
          <span>{{'Add' | translate}} {{property.label | translateValue:true | lowercase}}</span>
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

          <div *ngIf="!editing">
            <ng-container [ngSwitch]="property.editor.type">

              <div *ngSwitchCase="'semantic'"
                   app-semantic-text-links
                   [format]="property.editor.format"
                   [value]="child.control.value"
                   [relatedConcepts]="relatedConcepts">
              </div>

              <div *ngSwitchDefault>
                {{child.control.value}}
              </div>

            </ng-container>  
          </div>
          
          <div *ngIf="editing" class="form-group">

            <ng-container [ngSwitch]="property.editor.type">

              <input *ngSwitchCase="'input'"
                     type="text"
                     class="form-control"
                     [ngClass]="{'is-invalid': !child.control.valid}"
                     [id]="id"
                     autocomplete="off"
                     [formControl]="child.control" />

              <textarea *ngSwitchCase="'textarea'"
                        class="form-control"
                        [ngClass]="{'is-invalid': valueInError()}"
                        [id]="id"
                        [formControl]="property.control"></textarea>              

              <app-semantic-text-input *ngSwitchCase="'semantic'"
                                       [id]="id"
                                       [format]="property.editor.format"
                                       [conceptSelector]="conceptSelector"
                                       [relatedConcepts]="relatedConcepts"
                                       [formControl]="child.control"></app-semantic-text-input>

            </ng-container>

            <app-error-messages [control]="child.control"></app-error-messages>
          </div>
        </div>

        <button *ngIf="canRemove()"
                class="btn btn-link remove-button"
                (click)="removeValue(child)"
                ngbTooltip="{{'Remove' | translate}} {{property.label | translateValue:true | lowercase}}" [placement]="'left'">
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
    const isNotAddedYet = (lang: string) => !contains(this.property.addedLanguages, lang);

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
