import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ConceptViewModelService } from '../../services/concept.view.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgbTabChangeEvent, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ConceptsComponent } from '../concept/concepts.component';
import { VocabularyComponent } from './vocabulary.component';
import { ConfirmationModalService } from 'yti-common-ui/components/confirmation-modal.component';
import { ignoreModalClose } from 'yti-common-ui/utils/modal';
import { ConfirmCancelEditGuard } from '../common/edit.guard';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vocabulary-main',
  styleUrls: ['./vocabulary-main.component.scss'],
  providers: [ConceptViewModelService],
  template: `
    <div class="content-box">
      <ngb-tabset #tabs (tabChange)="onTabChange($event)">
        <ngb-tab id="conceptsTab" [title]="'Concepts' | translate">
          <ng-template ngbTabContent>
            <app-concepts #conceptsComponent></app-concepts>
          </ng-template>
        </ngb-tab>
        <ngb-tab id="terminologyTab" [title]="'Terminology details' | translate">
          <ng-template ngbTabContent>
            <app-vocabulary #terminologyComponent></app-vocabulary>
          </ng-template>
        </ngb-tab>
      </ngb-tabset>
    </div>
  `
})
export class VocabularyMainComponent implements OnInit, OnDestroy {
  @ViewChild('tabs') tabs: NgbTabset;
  @ViewChild('conceptsComponent') conceptsComponent: ConceptsComponent;
  @ViewChild('terminologyComponent') terminologyComponent: VocabularyComponent;
  private graphId: string;
  private routeParamSubscription: Subscription;

  constructor(private route: ActivatedRoute, private location: Location, public viewModel: ConceptViewModelService, private confirmationModalService: ConfirmationModalService) {
    console.log('VocabularyMainComponent CONSTRUCT');
    this.routeParamSubscription = this.route.params.subscribe(params => {
      this.graphId = params['graphId'];
      this.viewModel.initializeVocabulary(this.graphId);
    });
  }

  ngOnInit(): void {
    console.log('VocabularyMainComponent INIT (' + this.terminologyComponent + ')');
  }

  ngOnDestroy(): void {
    console.log('VocabularyMainComponent DESTRUCT');
    this.routeParamSubscription.unsubscribe();
  }

  onTabChange(event: NgbTabChangeEvent) {
    console.log('Tab Change BEGIN');

    if ((this.terminologyComponent && this.terminologyComponent.isEditing()) ||
      (this.conceptsComponent && this.conceptsComponent.isEditing())) {
      event.preventDefault();
      this.confirmationModalService.openEditInProgress().then(() => {
        (this.conceptsComponent || this.terminologyComponent).cancelEditing();
        this.tabs.select(event.nextId);
      }, ignoreModalClose);
    }

    console.log('Tab Change END');
  }
}
