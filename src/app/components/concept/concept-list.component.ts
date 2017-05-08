import { Component, AfterViewInit, ElementRef, ViewChild, Renderer } from '@angular/core';
import { Router } from '@angular/router';
import { ConceptListModel, ConceptViewModelService } from '../../services/concept.view.service';
import { statuses } from '../../entities/constants';
import { v4 as uuid } from 'uuid';
import { UserService } from '../../services/user.service';
import { IndexedConcept } from '../../services/elasticsearch.service';

@Component({
  selector: 'concept-list',
  styleUrls: ['./concept-list.component.scss'],
  template: `
    <div class="row">
      <div class="col-lg-12">

        <div class="actions">

          <button class="button btn-default btn-add-new" *ngIf="canAddConcept()" (click)="addConcept()">
            <i class="fa fa-plus"></i>
            <span translate>Add concept</span>
          </button>

          <div class="input-group input-group-lg input-group-search">
            <input #searchInput
                   [(ngModel)]="model.search"
                   type="text"
                   class="form-control"
                   [placeholder]="'Search concept...' | translate"/>
            <ajax-loading-indicator-small *ngIf="model.loading"></ajax-loading-indicator-small>
          </div>

          <div class="button btn-default btn-lg btn-filters"
               [ngbPopover]="filters" triggers="manual" placement="right" #p="ngbPopover" (click)="p.toggle()">
            <i class="fa fa-tasks"></i>
          </div>

          <template #filters>
            <div class="filters">

              <span class="title" translate>Filter results</span>

              <div class="form-group">
                <label for="status" translate>Status</label>
                <select id="status" class="form-control" style="width: auto" [(ngModel)]="model.onlyStatus">
                  <option [ngValue]="null" translate>All statuses</option>
                  <option *ngFor="let status of statuses" [ngValue]="status">{{status | translate}}</option>
                </select>
              </div>

              <div class="form-check">
                <label class="form-check-label">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="model.sortByTime"/>
                  {{'Order by modified date' | translate}}
                </label>
              </div>

            </div>
          </template>

        </div>

      </div>
    </div>

    <div class="row">
      <div class="col-lg-12 search-results">
        <ul [ngClass]="{'has-button': canAddConcept()}"
            infinite-scroll
            [infiniteScrollDistance]="2.5"
            [scrollWindow]="false"
            (scrolled)="onScrollDown()">
          <li *ngFor="let concept of model.searchResults; trackBy: conceptIdentity" (click)="navigate(concept)"
              [class.selection]="isSelected(concept)">
            <span [innerHTML]="concept.label | translateValue"></span>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class ConceptListComponent implements AfterViewInit {

  @ViewChild('searchInput') searchInput: ElementRef;

  statuses = statuses;
  model: ConceptListModel;

  constructor(private userService: UserService,
              private conceptViewModel: ConceptViewModelService,
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
    return this.userService.isLoggedIn();
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
