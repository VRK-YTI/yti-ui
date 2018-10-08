import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditableService, EditingComponent } from 'app/services/editable.service';
import { ConceptViewModelService } from 'app/services/concept.view.service';
import { Subscription } from 'rxjs';
import { DeleteConfirmationModalService } from 'app/components/common/delete-confirmation-modal.component';
import { requireDefined } from 'yti-common-ui/utils/object';
import { LanguageService } from 'app/services/language.service';
import { conceptIdPrefix } from 'app/utils/id-prefix';
import { ReferenceLabels, RemoveLinkConfirmationModalService } from './remove-link-confirmation-modal.component';
import { ConceptLinkNode, ConceptNode } from '../../entities/node';
import { Localizable } from 'yti-common-ui/types/localization';

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

          <app-status *ngIf="concept.hasStatus()"
                      [status]="concept.status"
                      class="float-left"></app-status>

          <app-editable-buttons [form]="form"
                                [canRemove]="true"
                                [vocabulary]="vocabulary"
                                [idPrefix]="idPrefix"></app-editable-buttons>

        </div>

        <app-concept-form [form]="formNode" [concept]="concept" [multiColumn]="true" [filterLanguage]="filterLanguage"
                          [vocabulary]="vocabulary"></app-concept-form>
      </form>

    </div>

    <app-ajax-loading-indicator *ngIf="!concept"></app-ajax-loading-indicator>
  `
})
export class ConceptComponent implements EditingComponent, OnDestroy {

  idPrefix: string = conceptIdPrefix;
  private subscriptionToClean: Subscription[] = [];

  constructor(private route: ActivatedRoute,
              private conceptViewModel: ConceptViewModelService,
              private deleteConfirmationModal: DeleteConfirmationModalService,
              private removeLinkConfirmationModal: RemoveLinkConfirmationModalService,
              private editableService: EditableService,
              private languageService: LanguageService) {

    this.route.params.subscribe(params => {
      this.conceptViewModel.initializeConcept(params['conceptId']);
    });

    editableService.onSave = () => this.conceptViewModel.saveConcept(this.confirmLinkRemoval.bind(this));
    editableService.onCanceled = () => this.conceptViewModel.resetConcept();
    editableService.onRemove = () =>
      deleteConfirmationModal.open(requireDefined(this.concept))
        .then(() => this.conceptViewModel.removeConcept());

    this.subscriptionToClean.push(this.conceptViewModel.resourceSelect$.subscribe(concept => {
      if (!concept.persistent && !editableService.editing) {
        editableService.edit();
      } else if (concept.persistent && editableService.editing) {
        editableService.cancel();
      }
    }));
  }

  get formNode() {
    return this.conceptViewModel.resourceForm!;
  }

  get concept() {
    return this.conceptViewModel.concept!;
  }

  get filterLanguage() {
    return this.languageService.filterLanguage;
  }

  get vocabulary() {
    return this.conceptViewModel.vocabulary;
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptionToClean) {
      subscription.unsubscribe();
    }
  }

  isEditing(): boolean {
    return this.editableService.editing;
  }

  cancelEditing(): void {
    this.editableService.cancel();
  }

  confirmLinkRemoval(proposed: ConceptNode, previous: ConceptNode): Promise<any> {
    const proposedIds: { [id: string]: boolean } = {};
    proposed.getAllReferences()
      .filter(ref => ref.concept || ref.conceptLink)
      .map(ref => ref.values)
      .forEach(valArr => valArr.forEach(node => proposedIds[node.id] = true));

    const missingRefs: ReferenceLabels[] = [];
    previous.getAllReferences().filter(ref => ref.concept || ref.conceptLink).forEach(ref => {
      ref.values.forEach(node => {
        if (node.id && !proposedIds[node.id]) {
          const referenceLabel = ref.meta.label;
          let containerLabel: { titleLabel: Localizable, label: Localizable } | undefined;
          let targetLabel: Localizable;
          if (node instanceof ConceptNode) {
            targetLabel = node.label;
          } else if (node instanceof ConceptLinkNode) {
            targetLabel = node.label;
            containerLabel = { titleLabel: node.vocabularyMetaLabel, label: node.vocabularyLabel };
          } else {
            if (node.label) {
              targetLabel = node.label;
            } else {
              throw new Error('Invalid node type found under reference type "' + this.languageService.translate(referenceLabel) + '"');
            }
          }
          missingRefs.push({
            referenceLabel: referenceLabel,
            containerLabel: containerLabel,
            targetLabel: targetLabel
          });
        }
      });
    });

    if (missingRefs.length) {
      return this.removeLinkConfirmationModal.open(missingRefs).catch(reason => Promise.reject('cancel'));
    }
    return Promise.resolve();
  }
}
