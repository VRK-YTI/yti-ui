import { Component, Input } from '@angular/core';
import { Reference, TermNode } from '../../entities/node';
import { EditableService } from '../../services/editable.service';

@Component({
  selector: 'synonyms',
  styleUrls: ['./synonyms.component.scss'],
  template: `
    
    <div class="clearfix" *ngIf="editing">
      <div ngbDropdown class="add-button">
        <button class="btn btn-default" ngbDropdownToggle ngbTooltip="{{'Add term' | translate}}"><i class="fa fa-plus"></i></button>
        <div class="dropdown-menu">
          <button class="dropdown-item" *ngFor="let language of termReference.languages" (click)="addTerm(language)">{{language | uppercase}}</button>
        </div>
      </div>
    </div>
    
    <ngb-accordion *ngIf="nonEmptyTerms.length > 0" [activeIds]="openTerms">
      <ngb-panel [id]="term.id" *ngFor="let term of nonEmptyTerms">
        <template ngbPanelTitle>
          <div class="language">{{term.language | uppercase}}</div>
          <div class="localization">{{term.value}} <accordion-chevron class="pull-right"></accordion-chevron></div>
        </template>
        <template ngbPanelContent>
          <div class="row" *ngIf="editing">
            <div class="col-md-12">
              <div class="remove-button">
                <button class="btn btn-default" ngbTooltip="{{'Remove term' | translate}}" (click)="removeTerm(term)"><i class="fa fa-trash"></i></button>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12" [class.col-xl-6]="multiColumn" *ngFor="let property of term | properties: showEmpty">
              <property [value]="property"></property>
            </div>
          </div>
        </template>
      </ngb-panel>
    </ngb-accordion>

    <div *ngIf="nonEmptyTerms.length === 0" translate>No terms yet</div>
  `
})
export class SynonymsComponent {

  @Input('value') termReference: Reference<TermNode>;
  @Input() multiColumn = false;

  openTerms: string[] = [];

  constructor(private editableService: EditableService) {
  }

  get nonEmptyTerms() {
    if (this.showEmpty) {
      return this.termReference.values;
    } else {
      return this.termReference.values.filter(term => !term.empty!);
    }
  }

  get showEmpty() {
    return this.editing;
  }

  get editing() {
    return this.editableService.editing;
  }

  addTerm(language: string) {
    const newTerm = this.termReference.createNewReference([language]);
    newTerm.language = language;
    this.openTerms.push(newTerm.id);
  }

  removeTerm(term: TermNode) {
    this.termReference.removeReference(term);
  }
}
