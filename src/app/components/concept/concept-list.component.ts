import { Component, AfterViewInit, ElementRef, ViewChild, Renderer } from '@angular/core';
import { Router } from '@angular/router';
import { ConceptListModel, ConceptViewModelService } from 'app/services/concept.view.service';
import { statuses } from 'app/entities/constants';
import { v4 as uuid } from 'uuid';
import { IndexedConcept } from 'app/services/elasticsearch.service';
import { AuthorizationManager } from 'app/services/authorization-manager.sevice';

@Component({
  selector: 'app-concept-list',
  styleUrls: ['./concept-list.component.scss'],
  template: `
    <div class="row">
      <div class="col-lg-12">

        <div class="selectable-actions">

          <button class="btn btn-action mb-3" *ngIf="canAddConcept()" (click)="addConcept()">
            <span translate>Add new concept</span>
          </button>

          <div class="input-group input-group-lg input-group-search">
            <input #searchInput
                   [(ngModel)]="model.search"
                   type="text"
                   class="form-control"
                   [placeholder]="'Search concept' | translate"/>
            <app-ajax-loading-indicator-small *ngIf="model.loading"></app-ajax-loading-indicator-small>
          </div>

          <div class="btn btn-lg btn-filters"
               [ngbPopover]="filters"
               [triggers]="'manual'"
               [placement]="'right'"
               #p="ngbPopover"
               [popoverTitle]="'Filter results' | translate"
               (click)="p.toggle()">
            
            <div class="tooltip-overlay" 
                 ngbTooltip="{{'Filter results' | translate}}"
                 #filterTooltip="ngbTooltip"
                 (click)="filterTooltip.close()"></div>
            
            <i class="fa fa-ellipsis-v"></i>
          </div>

          <ng-template #filters>
            
            <app-popover-close [popover]="p"></app-popover-close>
            
            <div class="filters">
              <div class="form-group">
                <label translate>Status</label>
                <app-status-filter-dropdown [filterSubject]="model.onlyStatus$"></app-status-filter-dropdown>
              </div>
                
              <div class="form-check">
                <label class="form-check-label">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="model.sortByTime"/>
                  {{'Order by modified date' | translate}}
                </label>
              </div>
            </div>
          </ng-template>

        </div>

      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="selectable-concepts">
          <ul [ngClass]="{'has-button': canAddConcept()}"
              infinite-scroll
              [infiniteScrollDistance]="2.5"
              [scrollWindow]="false"
              (scrolled)="onScrollDown()">
            <li *ngFor="let concept of model.searchResults; trackBy: conceptIdentity"
                (click)="navigate(concept)"
                [class.selection]="isSelected(concept)">
              <span [innerHTML]="concept.label | translateValue"></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class ConceptListComponent implements AfterViewInit {

  @ViewChild('searchInput') searchInput: ElementRef;

  statuses = statuses;
  model: ConceptListModel;

  constructor(private conceptViewModel: ConceptViewModelService,
              private authorizationManager: AuthorizationManager,
              private renderer: Renderer,
              private router: Router) {

    this.model = conceptViewModel.conceptList;
  }

  conceptIdentity(index: number, item: IndexedConcept) {
    return item.id + item.modified.toISOString();
  }

  onScrollDown() {
    this.model.loadConcepts();
  }

  ngAfterViewInit() {
    this.renderer.invokeElementMethod(this.searchInput.nativeElement, 'focus');
  }

  canAddConcept() {

    if (!this.conceptViewModel.vocabulary) {
      return false;
    }

    return this.authorizationManager.canAddConcept(this.conceptViewModel.vocabulary);

  }

  navigate(concept: IndexedConcept) {
    this.router.navigate(['/concepts', concept.vocabulary.id, 'concept', concept.id]);
  }

  addConcept() {
    this.router.navigate(['/concepts', this.conceptViewModel.graphId, 'concept', uuid()]);
  }

  isSelected(concept: IndexedConcept) {
    return this.conceptViewModel.conceptId === concept.id;
  }
}
