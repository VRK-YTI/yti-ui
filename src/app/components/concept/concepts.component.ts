import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ConceptViewModelService } from 'app/services/concept.view.service';
import { SessionService } from 'app/services/session.service';
import { ConceptNetworkComponent } from 'app/components/visualization/concept-network.component';
import { CollectionComponent } from 'app/components/collection/collection.component';
import { EditingComponent } from '../../services/editable.service';
import { ConceptComponent } from './concept.component';

@Component({
  selector: 'app-concepts',
  styleUrls: ['./concepts.component.scss'],
  template: `
    <div class="row">
      <div class="col-12">

        <div class="panel-left" appFloat>
          <div>
            <ngb-tabset [justify]="'justified'" [activeId]="initialTabId">
              <ngb-tab id="concepts_alphabetic_tab">
                <ng-template ngbTabTitle>
                  <p>{{'Alphabetic' | translate}}</p>
                </ng-template>
                <ng-template ngbTabContent>
                  <app-concept-list></app-concept-list>
                </ng-template>
              </ngb-tab>
              <ngb-tab id="concepts_hierarchical_tab">
                <ng-template ngbTabTitle>
                  <p>{{'Hierarchical' | translate}}</p>
                </ng-template>
                <ng-template ngbTabContent>
                  <app-concept-hierarchy></app-concept-hierarchy>
                </ng-template>
              </ngb-tab>
              <ngb-tab id="concepts_collection_tab">
                <ng-template ngbTabTitle>
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
            <router-outlet (activate)="onOutletActivate($event)"></router-outlet>
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
export class ConceptsComponent implements OnInit, OnDestroy {

  @ViewChild('network') conceptNetwork: ConceptNetworkComponent;
  initialTabId?: string;
  private childComponent?: EditingComponent;

  constructor(private route: ActivatedRoute,
              public viewModel: ConceptViewModelService,
              private sessionService: SessionService,
              private domSanitizer: DomSanitizer) {

    console.log('ConceptsComponent CONSTRUCT');

    if (route.children.length > 0) {
      const childComponent: any = this.route.children[0].component;
      if (childComponent === CollectionComponent) {
        this.initialTabId = 'concepts_collection_tab';
      }
    }
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

  ngOnInit(): void {
    console.log('ConceptsComponent INIT');
  }

  ngOnDestroy(): void {
    console.log('ConceptsComponent DESTRUCT');
  }

  onOutletActivate($event: any) {
    if ($event instanceof ConceptComponent) {
      this.childComponent = $event;
    } else if ($event instanceof CollectionComponent) {
      this.childComponent = $event;
    } else {
      this.childComponent = undefined;
    }
  }

  isEditing(): boolean {
    if (this.childComponent) {
      return this.childComponent.isEditing();
    }
    return false;
  }

  cancelEditing() {
    if (this.childComponent) {
      this.childComponent.cancelEditing();
    }
  }
}
