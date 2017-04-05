import { Component, AfterViewInit, OnInit, ElementRef, ViewChild, Renderer } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionNode } from '../entities/node';
import {
  filterAndSortSearchResults, labelComparator, scoreComparator, ContentExtractor,
  TextAnalysis
} from '../utils/text-analyzer';
import { isDefined } from '../utils/object';
import { LanguageService } from '../services/language.service';
import { ConceptViewModelService } from '../services/concept.view.service';
import { Router } from '@angular/router';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'collection-list',
  styleUrls: ['./collection-list.component.scss'],
  template: `
    <div class="row">
      <div class="col-lg-12">

        <div class="actions">

          <button class="button btn-default btn-add-new" (click)="addCollection()">
            <i class="fa fa-plus"></i>
            <span translate>Add collection</span>
          </button>

          <div class="input-group input-group-lg input-group-search">
            <input #searchInput
                   [(ngModel)]="search"
                   type="text"
                   class="form-control"
                   [placeholder]="'Search collection...' | translate" />
          </div>
          
        </div>

      </div>
    </div>

    <div class="row">
      <div class="col-lg-12 search-results">
        <ul>
          <li *ngFor="let collection of searchResults | async" (click)="navigate(collection)" [class.selection]="isSelected(collection)">
            <span [innerHTML]="collection.label | translateSearchValue: debouncedSearch | highlight: debouncedSearch"></span>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class CollectionListComponent implements OnInit, AfterViewInit {

  @ViewChild('searchInput') searchInput: ElementRef;

  searchResults: Observable<CollectionNode[]>;
  search$ = new BehaviorSubject('');
  debouncedSearch = this.search;

  constructor(private languageService: LanguageService,
              private conceptViewModel: ConceptViewModelService,
              private renderer: Renderer,
              private router: Router) {
  }

  ngOnInit() {

    const initialSearch = this.search$.take(1);
    const debouncedSearch = this.search$.skip(1).debounceTime(500);
    const search = initialSearch.concat(debouncedSearch);

    const update = (collections: CollectionNode[], search: string) => {

      this.debouncedSearch = search;
      const scoreFilter = (item: TextAnalysis<CollectionNode>) => !search || isDefined(item.matchScore) || item.score < 2;
      const labelExtractor: ContentExtractor<CollectionNode> = collection => collection.label;
      const scoreAndLabelComparator = scoreComparator().andThen(labelComparator(this.languageService));

      return filterAndSortSearchResults(collections, search, [labelExtractor], [scoreFilter], scoreAndLabelComparator);
    };

    this.searchResults = Observable.combineLatest([this.conceptViewModel.allCollections$, search], update);
  }

  ngAfterViewInit() {
    this.renderer.invokeElementMethod(this.searchInput.nativeElement, 'focus');
  }

  get search() {
    return this.search$.getValue();
  }

  set search(value: string) {
    this.search$.next(value);
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
