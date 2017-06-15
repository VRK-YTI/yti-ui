import { Component, Input } from '@angular/core';
import { EditableService } from '../../services/editable.service';
import { FormNode, FormReferenceTerm } from '../../services/form-state';
import { MetaModelService } from '../../services/meta-model.service';

@Component({
  selector: 'synonyms',
  styleUrls: ['./synonyms.component.scss'],
  template: `
    
    <div class="clearfix" *ngIf="editing">
      <div ngbDropdown class="add-button">
        <button class="btn btn-default" ngbDropdownToggle ngbTooltip="{{'Add' | translate}} {{reference.label | translateValue | lowercase}}"><i class="fa fa-plus"></i></button>
        <div class="dropdown-menu">
          <button class="dropdown-item" *ngFor="let language of languages" (click)="addTerm(language)">{{language | uppercase}}</button>
        </div>
      </div>
    </div>
    
    <ngb-accordion *ngIf="children.length > 0" [activeIds]="openTerms">
      <ngb-panel [id]="index" *ngFor="let node of children; let index = index">
        <ng-template ngbPanelTitle>
          <div class="language">{{node.language | uppercase}}</div>
          <div class="localization">{{node.formNode.prefLabelProperty[0].value}} <accordion-chevron class="pull-right"></accordion-chevron></div>
        </ng-template>
        <ng-template ngbPanelContent>
          <div class="row" *ngIf="editing">
            <div class="col-md-12">
              <div class="remove-button">
                <button class="btn btn-default" ngbTooltip="{{'Remove term' | translate}}" (click)="removeTerm(node)"><i class="fa fa-trash"></i></button>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12" [class.col-xl-6]="multiColumn" *ngFor="let child of node.formNode.properties">
              <property [id]="child.name" [property]="child.property"></property>
            </div>
          </div>
        </ng-template>
      </ngb-panel>
    </ngb-accordion>

    <div *ngIf="children.length === 0" translate>No terms yet</div>
  `
})
export class SynonymsComponent {

  @Input() reference: FormReferenceTerm;
  @Input() multiColumn = false;

  openTerms: number[] = [];

  constructor(private editableService: EditableService,
              private metaModelModel: MetaModelService) {
  }

  get languages() {
    return this.reference.languages;
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
      this.openTerms.push((this.children.length - 1));
    });
  }

  removeTerm(node: { formNode: FormNode, language: string }) {
    this.reference.remove(node);
  }
}
