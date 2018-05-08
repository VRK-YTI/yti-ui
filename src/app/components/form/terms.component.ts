import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { EditableService } from 'app/services/editable.service';
import { FormReferenceTerm, TermChild } from 'app/services/form-state';
import { MetaModelService } from 'app/services/meta-model.service';
import { contains, last } from 'yti-common-ui/utils/array';

@Component({
  selector: 'app-terms',
  styleUrls: ['./terms.component.scss'],
  template: `

    <div class="clearfix" *ngIf="canAdd()">
      <div ngbDropdown class="add-button" placement="bottom-right">
        <button class="btn btn-link"
                id="add_term_button"
                ngbDropdownToggle>
          <span>{{'Add' | translate}} {{reference.label | translateValue:true | lowercase}}</span>
        </button>
        <div ngbDropdownMenu>
          <button class="dropdown-item"
                  *ngFor="let language of addableLanguages"
                  id="{{language + '_add_term_button'}}"
                  (click)="addTerm(language)">{{language | uppercase}}</button>
        </div>
      </div>
    </div>

    <ngb-accordion *ngIf="children.length > 0"
                   [activeIds]="openTerms"
                   [appDragSortable]="reference"
                   [dragDisabled]="!canReorder()">
      <ngb-panel [id]="node.id" *ngFor="let node of visibleChildren; let i = index">
        <ng-template ngbPanelTitle>
          <div class="localized" [appDragSortableItem]="node" [index]="i">
            <div class="language">{{node.language | uppercase}}</div>
            <div class="localization">
              <span>{{node.formNode.prefLabelProperty[0].value}}</span>
              <app-accordion-chevron class="pull-right" [id]="id + '_' + i + '_term_accordion_chevron'"></app-accordion-chevron>
            </div>
            <div class="property-ordering" [hidden]="!editing">
              <span id="{{id + '_' + i +  '_term_reorder_handle'}}" class="fa fa-bars"></span>
            </div>
          </div>
        </ng-template>
        <ng-template ngbPanelContent>
          <div class="row">
            <div class="col-md-12">

              <app-status *ngIf="node.formNode.hasStatus()"
                          [status]="node.formNode.status"></app-status>

              <div *ngIf="canRemove()" class="remove-button">
                <button class="btn btn-link"
                        id="{{node.id + '_remove_term_button'}}"
                        (click)="removeTerm(node)">
                  <i class="fa fa-trash"></i>
                  <span translate>Remove term</span>
                </button>
              </div>
            </div>
          </div>
          <app-term [term]="node.formNode" [filterLanguage]="filterLanguage"></app-term>
        </ng-template>
      </ngb-panel>
    </ngb-accordion>

    <div *ngIf="children.length === 0" translate>No terms yet</div>
  `
})
export class TermsComponent implements OnChanges {

  @Input() reference: FormReferenceTerm;
  @Input() unsaved: boolean;
  @Input() filterLanguage: string;
  @Input() id: string;

  openTerms: string[] = [];

  constructor(private editableService: EditableService,
              private metaModelModel: MetaModelService) {
  }

  ngOnChanges() {
    this.openTerms = this.unsaved && this.editableService.editing && this.reference.value.length > 0 ? [this.reference.value[0].id] : [];
  }

  get languages() {
    return this.reference.languagesProvider();
  }

  get addableLanguages() {

    const allowMultiple = this.reference.cardinality === 'multiple';
    const isNotAddedYet = (lang: string) => !contains(this.reference.addedLanguages, lang);

    return this.languages.filter(lang =>
      this.isLanguageVisible(lang) && (allowMultiple || isNotAddedYet(lang)));
  }

  canAdd() {
    return this.editing && this.addableLanguages.length > 0;
  }

  canRemove() {
    return this.editing;
  }

  get children() {
    if (this.showEmpty) {
      return this.reference.children;
    } else {
      return this.reference.children.filter(child => child.formNode.hasNonEmptyPrefLabel);
    }
  }

  get showEmpty() {
    return this.editing;
  }

  get editing() {
    return this.editableService.editing;
  }

  addTerm(language: string) {
    this.metaModelModel.getMeta(this.reference.graphId).subscribe(metaModel => {
      this.reference.addTerm(metaModel, language);
      this.openTerms.push(last(this.children).id);
    });
  }

  removeTerm(node: TermChild) {
    this.reference.remove(node);
  }

  get visibleChildren() {
    return this.children.filter(child => this.isLanguageVisible(child.language));
  }

  isLanguageVisible(language: string) {
    return !this.filterLanguage || language === this.filterLanguage;
  }

  canReorder() {
    return this.editing && !this.filterLanguage && this.visibleChildren.length > 1;
  }
}
