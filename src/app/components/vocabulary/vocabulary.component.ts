import { Component, ViewChild, ElementRef } from '@angular/core';
import { EditableService, EditingComponent } from 'app/services/editable.service';
import { ConceptViewModelService } from 'app/services/concept.view.service';
import { requireDefined } from 'yti-common-ui/utils/object';
import { DeleteConfirmationModalService } from 'app/components/common/delete-confirmation-modal.component';
import { LanguageService } from 'app/services/language.service';
import { ImportVocabularyModalService } from 'app/components/vocabulary/import-vocabulary-modal.component';
import { ignoreModalClose } from 'yti-common-ui/utils/modal';
import { AuthorizationManager } from 'app/services/authorization-manager.sevice';

@Component({
  selector: 'app-vocabulary',
  styleUrls: ['./vocabulary.component.scss'],
  providers: [EditableService],
  template: `
    <div *ngIf="vocabulary">

      <div class="header row">
        <div class="col-12">
          <h2>

            <span class="mr-4">{{vocabulary.label | translateValue}}</span>

            <button class="btn btn-action"
                    id="vocabulary_show_details_button"
                    [hidden]="open"
                    (click)="open = true" translate>Show vocabulary details</button>

            <button class="btn btn-action"
                    id="vocabulary_hide_details_button"
                    [hidden]="!open"
                    (click)="open = false" translate>Hide vocabulary details</button>
          </h2>

          <app-filter-language [(ngModel)]="filterLanguage"
                               [languages]="filterLanguages"
                               class="pull-right mt-2"></app-filter-language>
        </div>
      </div>

      <div *ngIf="open">

        <hr />

        <form #form="ngForm" [formGroup]="formNode.control">

          <div class="top-actions">
            
            <button type="button"
                    id="vocabulary_close_button"
                    *ngIf="!isEditing()"
                    class="btn btn-link pull-right"
                    (click)="open = false">
              <i class="fa fa-times"></i>
              <span translate>Close</span>
            </button>
            
            <app-editable-buttons [form]="form"
                                  [canRemove]="true"
                                  [vocabulary]="vocabulary"></app-editable-buttons>

            <div class="pull-right" *ngIf="canImport()">
              <input #fileInput id="vocabulary_import_input" type="file" id="fileElem" accept=".csv" style="display:none" (change)="selectFile(fileInput.files)">
              <label for="fileElem" class="btn btn-secondary-action" translate>Import vocabulary</label>
            </div>

          </div>

          <app-vocabulary-form [vocabulary]="vocabulary"
                               [form]="formNode"
                               [filterLanguage]="filterLanguage"
                               [namespace]="namespace"></app-vocabulary-form>

          <app-meta-information [node]="vocabulary"></app-meta-information>

        </form>
      </div>
    </div>
  `
})
export class VocabularyComponent implements EditingComponent {

  @ViewChild('fileInput') fileInput: ElementRef;

  open = false;

  constructor(private editableService: EditableService,
              private conceptViewModel: ConceptViewModelService,
              deleteConfirmationModal: DeleteConfirmationModalService,
              private languageService: LanguageService,
              private importVocabularyModal: ImportVocabularyModalService,
              private authorizationManager: AuthorizationManager) {

    editableService.onSave = () => conceptViewModel.saveVocabulary();
    editableService.onCanceled = () => conceptViewModel.resetVocabulary();
    editableService.onRemove = () =>
      deleteConfirmationModal.open(requireDefined(this.vocabulary))
        .then(() => conceptViewModel.removeVocabulary());
  }

  canImport() {

    if (!this.conceptViewModel.vocabulary) {
      return false;
    }

    return !this.isEditing() && this.authorizationManager.canEdit(this.conceptViewModel.vocabulary);
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
      this.importVocabularyModal.open(selectedFile, requireDefined(this.vocabulary))
        .then(() => this.conceptViewModel.refreshConcepts(), ignoreModalClose)

      this.fileInput.nativeElement.value = '';
    }
  }

  get namespace() {
    return this.conceptViewModel.prefixAndNamespace ? this.conceptViewModel.prefixAndNamespace.namespace : null;
  }
}
