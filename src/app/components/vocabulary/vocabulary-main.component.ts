import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConceptViewModelService } from '../../services/concept.view.service';
import { ActivatedRoute } from '@angular/router';
import { VocabularyComponent } from './vocabulary.component';
import { EditingComponent } from '../../services/editable.service';

@Component({
  selector: 'app-vocabulary-main',
  styleUrls: ['./vocabulary-main.component.scss'],
  providers: [ConceptViewModelService],
  template: `
    <div class="content-box">
      <ngb-tabset>
        <ngb-tab [title]="'Concepts' | translate">
          <ng-template ngbTabContent>
            <app-concepts></app-concepts>
          </ng-template>
        </ngb-tab>
        <ngb-tab [title]="'Terminology details' | translate">
          <ng-template ngbTabContent>
            <div class="row" [hidden]="viewModel.loadingVocabulary">
              <div class="col-12">
                <app-vocabulary #vocabularyComponent></app-vocabulary>
              </div>
            </div>
          </ng-template>
        </ngb-tab>
      </ngb-tabset>
    </div>
  `
})
export class VocabularyMainComponent implements OnInit, OnDestroy, EditingComponent {
  @ViewChild('vocabularyComponent') vocabularyComponent: VocabularyComponent;

  constructor(private route: ActivatedRoute, public viewModel: ConceptViewModelService) {
    this.route.params.subscribe(params => {
      this.viewModel.initializeVocabulary(params['graphId']);
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  // TODO: Move down to right component.
  isEditing(): boolean {
    if (this.vocabularyComponent) {
      return this.vocabularyComponent.isEditing();
    }
    return false;
  }

  // TODO: Move down to right component.
  cancelEditing() {
    if (this.vocabularyComponent) {
      this.vocabularyComponent.cancelEditing();
    }
  }
}
