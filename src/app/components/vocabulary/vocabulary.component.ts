import { Component } from '@angular/core';
import { EditableService, EditingComponent } from '../../services/editable.service';
import { ConceptViewModelService } from '../../services/concept.view.service';
import { requireDefined } from '../../utils/object';
import { DeleteConfirmationModalService } from '../common/delete-confirmation-modal.component';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-vocabulary',
  styleUrls: ['./vocabulary.component.scss'],
  providers: [EditableService],
  template: `
    <ngb-accordion *ngIf="vocabulary">
      <ngb-panel>
        <ng-template ngbPanelTitle>
          <div class="main-panel-header">
            <h2>
              <span>{{vocabulary.label | translateValue}}</span>
              <app-accordion-chevron></app-accordion-chevron>
            </h2>            
          </div>
        </ng-template>
        <ng-template ngbPanelContent>
          <form #form="ngForm" [formGroup]="formNode.control">
            
            <div class="row">
              <div class="col-md-4">
                <app-filter-language [(ngModel)]="filterLanguage"
                                     [ngModelOptions]="{standalone: true}"
                                     [languages]="filterLanguages"
                                     style="width: auto"></app-filter-language>
              </div>
              <div class="col-md-8">
                <app-editable-buttons [form]="form" [canRemove]="true"></app-editable-buttons>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12">
                <div class="page-header">
                  <h1>{{vocabulary.meta.label | translateValue}}</h1>
                </div>
              </div>
            </div>
            
            <app-vocabulary-form [vocabulary]="vocabulary" [form]="formNode" [filterLanguage]="filterLanguage"></app-vocabulary-form>
            <app-meta-information [node]="vocabulary"></app-meta-information>
          </form>
        </ng-template>
      </ngb-panel>
    </ngb-accordion>
  `
})
export class VocabularyComponent implements EditingComponent {

  constructor(private editableService: EditableService,
              private conceptViewModel: ConceptViewModelService,
              deleteConfirmationModal: DeleteConfirmationModalService,
              private languageService: LanguageService) {

    editableService.onSave = () => conceptViewModel.saveVocabulary();
    editableService.onCanceled = () => conceptViewModel.resetVocabulary();
    editableService.onRemove = () =>
      deleteConfirmationModal.open(requireDefined(this.vocabulary))
        .then(() => conceptViewModel.removeVocabulary());
  }

  get formNode() {
    return this.conceptViewModel.vocabularyForm;
  }

  get vocabulary() {
    return this.conceptViewModel.vocabulary;
  }

  isEditing(): boolean {
    return this.editableService.editing;
  }

  cancelEditing(): void {
    this.editableService.cancel();
  }

  get filterLanguage() {
    return this.languageService.filterLanguage;
  }

  set filterLanguage(lang: string) {
    this.languageService.filterLanguage = lang;
  }

  get filterLanguages() {
    return this.conceptViewModel.languages;
  }

}
