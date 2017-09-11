import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditableService, EditingComponent } from '../../services/editable.service';
import { ConceptViewModelService } from '../../services/concept.view.service';
import { Subscription } from 'rxjs';
import { DeleteConfirmationModalService } from '../common/delete-confirmation-modal.component';
import { requireDefined } from '../../utils/object';

@Component({
  selector: 'app-collection',
  styleUrls: ['./collection.component.scss'],
  providers: [EditableService],
  template: `
    <div class="component" *ngIf="collection">

      <div class="component-header">
        <h3>{{collection.label | translateValue}}</h3>
      </div>
      <div class="form-group col-md-2">
        <label translate>Filter language</label>
        <filter-language [(ngModel)]="filterLanguage" [languages]="filterLanguages"></filter-language>
      </div>
      <form #form="ngForm" [formGroup]="formNode.control" class="component-content">

        <div class="row">
          <div class="col-md-12">
            <app-editable-buttons [form]="form" [canRemove]="true"></app-editable-buttons>
          </div>
        </div>

        <div class="row">

          <ng-container *ngFor="let field of fields" [ngSwitch]="field.value.fieldType">

            <app-property *ngSwitchCase="'property'"
                          class="col-md-12"
                          [property]="field.value"
                          [id]="field.name"
                          [filterLanguage]="filterLanguage"></app-property>

            <app-reference *ngSwitchCase="'reference'"
                           class="col-md-12"
                           [reference]="field.value"
                           [id]="field.name"
                           [unsaved]="unsaved"></app-reference>

          </ng-container>

        </div>

        <app-meta-information [hidden]="!collection.persistent" [node]="collection"></app-meta-information>

      </form>

    </div>

    <app-ajax-loading-indicator *ngIf="!collection"></app-ajax-loading-indicator>
  `
})
export class CollectionComponent implements EditingComponent, OnDestroy {

  private subscriptionToClean: Subscription[] = [];

  constructor(private route: ActivatedRoute,
              private conceptViewModel: ConceptViewModelService,
              deleteConfirmationModal: DeleteConfirmationModalService,
              private editableService: EditableService) {

    route.params.subscribe(params => conceptViewModel.initializeCollection(params['collectionId']));
    editableService.onSave = () => this.conceptViewModel.saveCollection();
    editableService.onCanceled = () => this.conceptViewModel.resetCollection();
    editableService.onRemove = () =>
      deleteConfirmationModal.open(requireDefined(this.collection))
        .then(() => this.conceptViewModel.removeCollection());

    this.subscriptionToClean.push(this.conceptViewModel.collectionSelect$.subscribe(collection => {
      if (!collection.persistent && !editableService.editing) {
        editableService.edit();
      } else if (collection.persistent && editableService.editing) {
        editableService.cancel();
      }
    }));
  }

  get showEmpty() {
    return this.editableService.editing;
  }

  get fields() {
    return this.formNode.fields.filter(f => this.showEmpty || !f.value.valueEmpty);
  }

  get formNode() {
    return this.conceptViewModel.collectionForm!;
  }

  get unsaved() {
    const collection = this.conceptViewModel.collection;
    return collection && !collection.persistent;
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptionToClean) {
      subscription.unsubscribe();
    }
  }

  get collection() {
    return this.conceptViewModel.collection!;
  }

  isEditing(): boolean {
    return this.editableService.editing;
  }

  cancelEditing(): void {
    this.editableService.cancel();
  }

  get filterLanguage() {
    return this.conceptViewModel.filterLanguage;
  }

  set filterLanguage(lang: string) {
    this.conceptViewModel.filterLanguage = lang;
  }

  get filterLanguages() {
    return this.conceptViewModel.languages;
  }

}
