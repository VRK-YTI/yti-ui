import { Component, ViewChild, ElementRef } from '@angular/core';
import { EditableService, EditingComponent } from '../../services/editable.service';
import { ConceptViewModelService } from '../../services/concept.view.service';
import { requireDefined } from '../../utils/object';
import { DeleteConfirmationModalService } from '../common/delete-confirmation-modal.component';
import { LanguageService } from '../../services/language.service';
import * as Papa from 'papaparse';
import { ImportVocabularyModalService } from 'app/components/vocabulary/import-vocabulary-modal.component';
import { ignoreModalClose } from 'app/utils/modal';
import { UserService } from '../../services/user.service';

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

            <div class="top-actions">

              <app-filter-language [(ngModel)]="filterLanguage"
                                   [ngModelOptions]="{standalone: true}"
                                   [languages]="filterLanguages"
                                   class="pull-left"
                                   style="width: auto"></app-filter-language>

              <app-editable-buttons [form]="form" [canRemove]="true"></app-editable-buttons>

              <div class="pull-right">
                <input #fileInput type="file" id="fileElem" accept=".csv" style="display:none" (change)="selectFile(fileInput.files)">
                <label for="fileElem" class="btn btn-default import-button" translate>Import vocabulary</label>
              </div>

            </div>

            <div class="row">
              <div class="col-md-12">
                <div class="page-header">
                  <h1>{{vocabulary.meta.label | translateValue:false}}</h1>
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

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private editableService: EditableService,
              private conceptViewModel: ConceptViewModelService,
              deleteConfirmationModal: DeleteConfirmationModalService,
              private languageService: LanguageService,
              private importVocabularyModal: ImportVocabularyModalService) {

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

  selectFile(files: FileList) {
    const selectedFile = files[0] || false;

    if (selectedFile) {

      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        newline: '\r\n',
        complete: results =>
          this.importVocabularyModal.open(results.data, requireDefined(this.vocabulary))
            .then(() => this.conceptViewModel.refreshConcepts(), ignoreModalClose)
      });

      this.fileInput.nativeElement.value = '';
    }
  }

}
