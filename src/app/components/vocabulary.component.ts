import { Component } from '@angular/core';
import { EditableService } from '../services/editable.service';
import { ConceptViewModelService } from '../services/concept.view.service';

@Component({
  selector: 'vocabulary',
  styleUrls: ['./vocabulary.component.scss'],
  providers: [EditableService],
  template: `
    <ngb-accordion *ngIf="conceptScheme">
      <ngb-panel>
        <template ngbPanelTitle>
          <div class="main-panel-header">
            <h2>{{conceptScheme.label | translateValue}} <accordion-chevron></accordion-chevron></h2>
          </div>
        </template>
        <template ngbPanelContent>
          <form>
            <div class="row">
              <div class="col-md-12">
                <editable-buttons class="pull-right"></editable-buttons>
                <div class="page-header">
                  <h1>{{conceptScheme.meta.label | translateValue}}</h1>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">              
                <property [value]="property" *ngFor="let property of conceptScheme | properties"></property>
                <reference [value]="reference" *ngFor="let reference of conceptScheme | references"></reference>
              </div>
            </div>
            <meta-information [node]="conceptScheme"></meta-information>
          </form>
        </template>
      </ngb-panel>
    </ngb-accordion>
  `
})
export class VocabularyComponent {

  constructor(editableService: EditableService,
              private conceptViewModel: ConceptViewModelService) {

    editableService.save$.subscribe(() => conceptViewModel.saveConceptScheme());
    editableService.cancel$.subscribe(() => conceptViewModel.resetConceptScheme());
  }

  get conceptScheme() {
    return this.conceptViewModel.conceptScheme;
  }
}
