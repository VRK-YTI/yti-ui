import { Component } from '@angular/core';
import { EditableService } from '../services/editable.service';
import { ConceptViewModelService } from '../services/concept.view.service';

@Component({
  selector: 'vocabulary',
  styleUrls: ['./vocabulary.component.scss'],
  providers: [EditableService],
  template: `
    <ngb-accordion *ngIf="vocabulary">
      <ngb-panel>
        <template ngbPanelTitle>
          <div class="main-panel-header">
            <h2>
              <span>{{vocabulary.label | translateValue}}</span>
              <accordion-chevron></accordion-chevron>
            </h2>
          </div>
        </template>
        <template ngbPanelContent>
          <form>
            <div class="row">
              <div class="col-md-12">
                <editable-buttons class="pull-right"></editable-buttons>
                <div class="page-header">
                  <h1>{{vocabulary.meta.label | translateValue}}</h1>
                </div>
              </div>
            </div>
            <div class="row">
              <property class="col-md-6" [value]="property"
                        *ngFor="let property of vocabulary | properties: showEmpty"></property>
              <reference class="col-md-6" [value]="reference" [conceptsProvider]="conceptsProvider"
                         *ngFor="let reference of vocabulary | references: showEmpty"></reference>
            </div>
            <meta-information [node]="vocabulary"></meta-information>
          </form>
        </template>
      </ngb-panel>
    </ngb-accordion>
  `
})
export class VocabularyComponent {

  constructor(private editableService: EditableService,
              private conceptViewModel: ConceptViewModelService) {

    editableService.onSave = () => conceptViewModel.saveVocabulary();
    editableService.onCanceled = () => conceptViewModel.resetVocabulary();
  }

  get conceptsProvider() {
    return () => this.conceptViewModel.allConcepts$.getValue();
  }

  get vocabulary() {
    return this.conceptViewModel.vocabulary;
  }

  get showEmpty() {
    return this.editableService.editing;
  }
}
