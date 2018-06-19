import { Component, AfterViewInit, ElementRef, ViewChild, Renderer } from '@angular/core';
import { CollectionNode } from 'app/entities/node';
import { CollectionListModel, ConceptViewModelService } from 'app/services/concept.view.service';
import { Router } from '@angular/router';
import { v4 as uuid } from 'uuid';
import { AuthorizationManager } from 'app/services/authorization-manager.sevice';

@Component({
  selector: 'app-collection-list',
  styleUrls: ['./collection-list.component.scss'],
  template: `
    <div class="row">
      <div class="col-lg-12">

        <div class="selectable-actions">

          <button class="btn btn-action mb-3" id="collection_list_add_collection_button" (click)="addCollection()" *ngIf="canAddCollection()">
            <span translate>Add new collection</span>
          </button>

          <div class="input-group input-group-lg input-group-search">
            <input #searchInput
                   id="collection_list_search_input"
                   [(ngModel)]="search"
                   type="text"
                   class="form-control"
                   [placeholder]="'Search collection' | translate" />
          </div>

        </div>

      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="selectable-collections">
          <ul [ngClass]="{'has-button': canAddCollection()}">
            <li *ngFor="let collection of searchResults | async; trackBy: collectionIdentity"
                [id]="collection.idIdentifier + '_collection_list_listitem'"
                (click)="navigate(collection)"
                [class.selection]="isSelected(collection)">
              <span [innerHTML]="collection.label | translateSearchValue: debouncedSearch | highlight: debouncedSearch"></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class CollectionListComponent implements AfterViewInit {

  @ViewChild('searchInput') searchInput: ElementRef;

  model: CollectionListModel;

  constructor(private conceptViewModel: ConceptViewModelService,
              private authorizationManager: AuthorizationManager,
              private renderer: Renderer,
              private router: Router) {

    this.model = conceptViewModel.collectionList;
  }

  ngAfterViewInit() {
    this.renderer.invokeElementMethod(this.searchInput.nativeElement, 'focus');
  }

  collectionIdentity(index: number, item: CollectionNode) {
    return item.id + item.lastModifiedDate.toISOString();
  }

  canAddCollection() {

    if (!this.conceptViewModel.vocabulary) {
      return false;
    }

    return this.authorizationManager.canAddCollection(this.conceptViewModel.vocabulary);
  }

  get search() {
    return this.model.search$.getValue();
  }

  set search(value: string) {
    this.model.search$.next(value);
  }

  get searchResults() {
    return this.model.searchResults;
  }

  get debouncedSearch() {
    return this.model.debouncedSearch;
  }

  navigate(collection: CollectionNode) {
    this.router.navigate(['/concepts', collection.graphId, 'collection', collection.id]);
  }

  addCollection() {
    this.router.navigate(['/concepts', this.conceptViewModel.graphId, 'collection', uuid()]);
  }

  isSelected(collection: CollectionNode) {
    return this.conceptViewModel.collectionId === collection.id;
  }
}
