import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EditableService, EditingComponent } from 'app/services/editable.service';
import { ConceptViewModelService } from 'app/services/concept.view.service';
import { requireDefined } from 'yti-common-ui/utils/object';
import { DeleteConfirmationModalService } from 'app/components/common/delete-confirmation-modal.component';
import { LanguageService } from 'app/services/language.service';
import { ImportVocabularyModalService } from 'app/components/vocabulary/import-vocabulary-modal.component';
import { ignoreModalClose } from 'yti-common-ui/utils/modal';
import { AuthorizationManager } from 'app/services/authorization-manager.sevice';
import { vocabularyIdPrefix } from 'app/utils/id-prefix';
import { ConfirmCancelEditGuard } from '../common/edit.guard';

@Component({
  selector: 'app-vocabulary',
  styleUrls: ['./vocabulary.component.scss'],
  providers: [EditableService],
  template: `
    <div *ngIf="vocabulary">

      <div class="header row">
        <div class="col-12">
          <h2><span class="mr-4">{{vocabulary!.label | translateValue}}</span></h2>

          <app-filter-language [(ngModel)]="filterLanguage"
                               [languages]="filterLanguages"
                               class="float-right mt-2"></app-filter-language>
        </div>
      </div>

      <div>
        
        <form #form="ngForm" [formGroup]="formNode.control">

          <div class="top-actions">

            <button type="button"
                    id="vocabulary_close_button"
                    *ngIf="!isEditing()"
                    class="btn btn-link float-right"
                    (click)="open = false">
              <i class="fa fa-times"></i>
              <span translate>Close</span>
            </button>

            <app-editable-buttons [form]="form"
                                  [canRemove]="true"
                                  [vocabulary]="vocabulary"
                                  [idPrefix]="idPrefix"></app-editable-buttons>

            <div class="float-right" *ngIf="canImport()">
              <label id="vocabulary_import_label" class="btn btn-secondary-action"
                     (click)="selectFile()" translate>Import concepts</label>
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
export class VocabularyComponent implements EditingComponent, OnInit, OnDestroy {

  @ViewChild('fileInput') fileInput: ElementRef;
  idPrefix: string = vocabularyIdPrefix;

  open = false;

  constructor(private editableService: EditableService,
              private conceptViewModel: ConceptViewModelService,
              deleteConfirmationModal: DeleteConfirmationModalService,
              private languageService: LanguageService,
              private importVocabularyModal: ImportVocabularyModalService,
              private authorizationManager: AuthorizationManager,
              private editGuard: ConfirmCancelEditGuard) {

    editableService.onSave = () => conceptViewModel.saveVocabulary();
    editableService.onCanceled = () => conceptViewModel.resetVocabulary();
    editableService.onRemove = () =>
      deleteConfirmationModal.open(requireDefined(this.vocabulary))
        .then(() => conceptViewModel.removeVocabulary());
  }

  ngOnInit(): void {
    console.log('VocabularyComponent INIT');
    this.editGuard.activeTabbedComponent = this;
  }

  ngOnDestroy(): void {
    console.log('VocabularyComponent DESTRUCT');
    this.editGuard.activeTabbedComponent = undefined;
  }

  get formNode() {
    return this.conceptViewModel.vocabularyForm;
  }

  get vocabulary() {
    return this.conceptViewModel.vocabulary;
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

  get namespace() {
    return this.conceptViewModel.prefixAndNamespace ? this.conceptViewModel.prefixAndNamespace.namespace : null;
  }

  canImport() {
    if (!this.conceptViewModel.vocabulary) {
      return false;
    }

    return !this.isEditing() && this.authorizationManager.canEdit(this.conceptViewModel.vocabulary);
  }

  isEditing(): boolean {
    return this.editableService.editing;
  }

  cancelEditing(): void {
    this.editableService.cancel();
  }

  selectFile() {
    this.importVocabularyModal.open(requireDefined(this.vocabulary))
      .then(() => this.conceptViewModel.refreshConcepts(), ignoreModalClose)
  }
}
