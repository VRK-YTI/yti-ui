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
              <property class="col-md-6" [value]="property" *ngFor="let property of conceptScheme | properties: showEmpty"></property>
              <reference class="col-md-6" [value]="reference" [conceptsProvider]="conceptsProvider" *ngFor="let reference of conceptScheme | references: showEmpty"></reference>
            </div>
            <meta-information [node]="conceptScheme"></meta-information>
          </form>
        </template>
      </ngb-panel>
    </ngb-accordion>
  `
})
export class VocabularyComponent {

  constructor(private editableService: EditableService,
              private conceptViewModel: ConceptViewModelService) {

    editableService.onSave = () => conceptViewModel.saveConceptScheme();
    editableService.onCanceled = () => conceptViewModel.resetConceptScheme();
  }

  get conceptsProvider() {
    return () => this.conceptViewModel.allConcepts$.getValue();
  }

  get conceptScheme() {
    return this.conceptViewModel.conceptScheme;
  }

  get showEmpty() {
    return this.editableService.editing;
  }
}
