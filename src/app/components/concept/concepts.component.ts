import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ConceptViewModelService } from '../../services/concept.view.service';
import { SessionService } from '../../services/session.service';
import { ConceptNetworkComponent } from '../visualization/concept-network.component';
import { EditingComponent } from '../../services/editable.service';
import { VocabularyComponent } from '../vocabulary/vocabulary.component';

@Component({
  selector: 'app-concepts',
  styleUrls: ['./concepts.component.scss'],
  providers: [ConceptViewModelService],
  template: `
    <div class="container-fluid">

      <div class="row" [hidden]="viewModel.loadingVocabulary">
        <div class="col-12">
          <app-vocabulary #vocabularyComponent></app-vocabulary>
        </div>
      </div>

      <div class="bottom">
      
        <div class="panel-left">
          <div appFloat>
            <ngb-tabset>
              <ngb-tab>
                <ng-template ngbTabTitle>
                  <i class="fa fa-sort-alpha-asc"></i>
                  <p>{{'Alphabetic' | translate}}</p>
                </ng-template>
                <ng-template ngbTabContent>
                  <app-concept-list></app-concept-list>
                </ng-template>
              </ngb-tab>
              <ngb-tab>
                <ng-template ngbTabTitle>
                  <i class="fa fa-sitemap"></i>
                  <p>{{'Hierarchical' | translate}}</p>
                </ng-template>
                <ng-template ngbTabContent>
                  <app-concept-hierarchy></app-concept-hierarchy>
                </ng-template>
              </ngb-tab>
              <ngb-tab>
                <ng-template ngbTabTitle>
                  <i class="fa fa-clone"></i>
                  <p>{{'Collection' | translate}}</p>
                </ng-template>
                <ng-template ngbTabContent>
                  <app-collection-list></app-collection-list>
                </ng-template>
              </ngb-tab>
            </ngb-tabset>
          </div>
        </div>

        <div class="panel-right">
          
          <div class="selection-container" [style.width]="selectionWidth" [hidden]="!showSelection">
            <router-outlet></router-outlet>
          </div>

          <div class="visualization-container" [style.width]="visualizationWidth" [hidden]="!showVisualization">
            <div appFloat [setWidth]="false">
              <app-divider *ngIf="showDivider"></app-divider>
              <app-concept-network #network [class.without-divider]="!showDivider"></app-concept-network>
            </div>
          </div>
          
        </div>

      </div>
    
    </div>
  `
})
export class ConceptsComponent implements EditingComponent, OnInit {

  @ViewChild('network') conceptNetwork: ConceptNetworkComponent;
  @ViewChild('vocabularyComponent') vocabularyComponent: VocabularyComponent;

  constructor(private route: ActivatedRoute,
              public viewModel: ConceptViewModelService,
              private sessionService: SessionService,
              private domSanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.viewModel.initializeVocabulary(params['graphId']);
    });
  }

  get showDivider() {
    return this.showSelection;
  }

  get showSelection() {
    return this.viewModel.selection;
  }

  get showVisualization() {
    return !this.conceptNetwork.isEmpty();
  }

  get selectionWidth() {
    return this.sessionService.selectionWidth + 'px';
  }

  get visualizationWidth() {
    return this.domSanitizer.bypassSecurityTrustStyle(
      this.showSelection ? `calc(100% - ${this.sessionService.selectionWidth}px)` : '100%'
    );
  }

  isEditing(): boolean {
    return this.vocabularyComponent.isEditing();
  }

  cancelEditing() {
    this.vocabularyComponent.cancelEditing();
  }
}

