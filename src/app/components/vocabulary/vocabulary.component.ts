import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EditableService, EditingComponent } from 'app/services/editable.service';
import { ConceptViewModelService } from 'app/services/concept.view.service';
import { requireDefined } from 'yti-common-ui/utils/object';
import { DeleteConfirmationModalService } from 'app/components/common/delete-confirmation-modal.component';
import { LanguageService } from 'app/services/language.service';
import { vocabularyIdPrefix } from 'app/utils/id-prefix';
import { ConfirmCancelEditGuard } from '../common/edit.guard';

@Component({
  selector: 'app-vocabulary',
  styleUrls: ['./vocabulary.component.scss'],
  providers: [EditableService],
  template: `
    <div *ngIf="vocabulary">
      <div>
        <form #form="ngForm" [formGroup]="formNode.control">

          <div class="top-actions">
            <app-editable-buttons [form]="form"
                                  [canRemove]="true"
                                  [vocabulary]="vocabulary"
                                  [idPrefix]="idPrefix"></app-editable-buttons>
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

  constructor(private editableService: EditableService,
              private conceptViewModel: ConceptViewModelService,
              deleteConfirmationModal: DeleteConfirmationModalService,
              private languageService: LanguageService,
              private editGuard: ConfirmCancelEditGuard) {

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

  get filterLanguage() {
    return this.languageService.filterLanguage;
  }

  get namespace() {
    return this.conceptViewModel.prefixAndNamespace ? this.conceptViewModel.prefixAndNamespace.namespace : null;
  }

  ngOnInit(): void {
    this.editGuard.activeTabbedComponent = this;
  }

  ngOnDestroy(): void {
    this.editGuard.activeTabbedComponent = undefined;
  }

  isEditing(): boolean {
    return this.editableService.editing;
  }

  cancelEditing(): void {
    this.editableService.cancel();
  }
}
