import { Component, AfterViewInit, ElementRef, ViewChild, Renderer, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConceptListModel, ConceptViewModelService } from 'app/services/concept.view.service';
import { selectableStatuses } from 'yti-common-ui/entities/status';
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

          <button class="btn btn-action mb-3" id="concept_list_add_concept_button" *ngIf="canAddConcept()" (click)="addConcept()">
            <span translate>Add new concept</span>
          </button>

          <div class="input-group input-group-lg input-group-search">
            <input #searchInput
                   id="concept_list_search_concept_input"
                   [(ngModel)]="model.search"
                   type="text"
                   class="form-control"
                   [placeholder]="'Search concept' | translate"/>
            <app-ajax-loading-indicator-small *ngIf="model.loading"></app-ajax-loading-indicator-small>
          </div>

          <div class="btn btn-lg btn-filters"
               id="concept_list_filter_results"
               [ngbPopover]="filters"
               [triggers]="'manual'"
               [placement]="'right'"
               #p="ngbPopover"
               [popoverTitle]="'Filter results' | translate"
               (click)="p.toggle()">
            
            <div class="tooltip-overlay" 
                 id="concept_list_filter_results_tooltip_overlay"
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
                <app-status-filter-dropdown *ngIf="hasStatus()" id="concept_list_filter_dropdown"
                                            [filterSubject]="model.onlyStatus$"></app-status-filter-dropdown>
              </div>
                
              <div class="form-check">
                <label class="form-check-label">
                  <input class="form-check-input" id="concept_list_sort_by_time_checkbox" type="checkbox" [(ngModel)]="model.sortByTime"/>
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
              id="concept_list_selectable_concepts_list"
              [infiniteScrollDistance]="2.5"
              [scrollWindow]="false"
              (scrolled)="onScrollDown()">
            <li *ngFor="let concept of model.searchResults; trackBy: conceptIdentity"
                (click)="navigate(concept)"
                [id]="concept.idIdentifier + '_concept_list_listitem'"
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

  statuses = selectableStatuses;
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
    return this.conceptViewModel.resourceId === concept.id;
  }

  hasStatus(): boolean {
    // TODO check from meta model if concept has status or not for this vocabulary
    return true;
  }
}
