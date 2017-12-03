import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditableService, EditingComponent } from '../../services/editable.service';
import { ConceptViewModelService } from '../../services/concept.view.service';
import { Subscription } from 'rxjs';
import { DeleteConfirmationModalService } from '../common/delete-confirmation-modal.component';
import { requireDefined } from '../../utils/object';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-concept',
  styleUrls: ['./concept.component.scss'],
  providers: [EditableService],
  template: `
    <div class="component" *ngIf="concept">

      <div class="component-header">
        <h3>{{concept.label | translateValue}}</h3>
      </div>
      <form #form="ngForm" [formGroup]="formNode.control" class="component-content">

        <div class="top-actions">
          
          <app-status [status]="concept.status" class="pull-left"></app-status>
          
          <app-editable-buttons [form]="form" 
                                [canRemove]="true" 
                                [vocabulary]="vocabulary"></app-editable-buttons>

        </div>

        <app-concept-form [form]="formNode" [concept]="concept" [multiColumn]="true" [filterLanguage]="filterLanguage" [vocabulary]="vocabulary"></app-concept-form>
      </form>

    </div>

    <app-ajax-loading-indicator *ngIf="!concept"></app-ajax-loading-indicator>
  `
})
export class ConceptComponent implements EditingComponent, OnDestroy {

  private subscriptionToClean: Subscription[] = [];

  constructor(private route: ActivatedRoute,
              private conceptViewModel: ConceptViewModelService,
              deleteConfirmationModal: DeleteConfirmationModalService,
              private editableService: EditableService,
              private languageService: LanguageService) {

    route.params.subscribe(params => conceptViewModel.initializeConcept(params['conceptId']));
    editableService.onSave = () => this.conceptViewModel.saveConcept();
    editableService.onCanceled = () => this.conceptViewModel.resetConcept();
    editableService.onRemove = () =>
      deleteConfirmationModal.open(requireDefined(this.concept))
        .then(() => this.conceptViewModel.removeConcept());

    this.subscriptionToClean.push(this.conceptViewModel.conceptSelect$.subscribe(concept => {
      if (!concept.persistent && !editableService.editing) {
        editableService.edit();
      } else if (concept.persistent && editableService.editing) {
        editableService.cancel();
      }
    }));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptionToClean) {
      subscription.unsubscribe();
    }
  }

  get formNode() {
    return this.conceptViewModel.conceptForm!;
  }

  get concept() {
    return this.conceptViewModel.concept!;
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

  get vocabulary() {
    return this.conceptViewModel.vocabulary;
  }
}
