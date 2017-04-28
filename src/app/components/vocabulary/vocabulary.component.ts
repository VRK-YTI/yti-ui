import { Component } from '@angular/core';
import { EditableService, EditingComponent } from '../../services/editable.service';
import { ConceptViewModelService } from '../../services/concept.view.service';

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
          <form #form>
            <div class="row">
              <div class="col-md-12">
                <editable-buttons [form]="form" [canRemove]="false"></editable-buttons>
                <div class="page-header">
                  <h1>{{vocabulary.meta.label | translateValue}}</h1>
                </div>
              </div>
            </div>

            <vocabulary-form [vocabulary]="vocabularyInEdit" [conceptsProvider]="conceptsProvider"></vocabulary-form>
            <meta-information [node]="vocabulary"></meta-information>
          </form>
        </template>
      </ngb-panel>
    </ngb-accordion>
  `
})
export class VocabularyComponent implements EditingComponent {

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

  get vocabularyInEdit() {
    return this.conceptViewModel.vocabularyInEdit;
  }

  get showEmpty() {
    return this.editableService.editing;
  }

  isEditing(): boolean {
    return this.editableService.editing;
  }

  cancelEditing(): void {
    this.editableService.cancel();
  }
}
