import { Component } from '@angular/core';
import { LocationService } from '../services/location.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ElasticSearchService, IndexedConcept } from '../services/elasticsearch.service';
import { Router } from '@angular/router';
import { TermedService } from '../services/termed.service';
import { defaultLanguages } from '../utils/language';
import { Observable } from 'rxjs/Observable';
import { VocabularyNode } from '../entities/node';
import { statuses } from '../entities/constants';

@Component({
  selector: 'frontpage',
  styleUrls: ['./frontpage.component.scss'],
  template: `
    <div class="container-fluid">

      <div class="page-header row">
        <div class="col-md-12 mx-auto">

          <div class="row">
            <div class="col-md-12">
              <span class="welcome" translate>Welcome to vocabulary and concept workbench</span>
              <p translate>Frontpage information</p>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12">

              <div class="input-group input-group-lg input-group-search">
                <input [(ngModel)]="search"
                       type="text"
                       class="form-control"
                       [placeholder]="'Search concept...' | translate"/>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="search-results-container row" *ngIf="debouncedSearch$ | async">
        
        <div class="col-md-3 offset-2">
          <div class="search-panel">
            <span class="title" translate>Filter results</span>

            <div class="form-group">
              <label for="statusFilter" translate>Status</label>
              <select id="statusFilter" class="form-control" [(ngModel)]="onlyStatus">
                <option [ngValue]="null" translate>All statuses</option>
                <option *ngFor="let status of statuses" [ngValue]="status">{{status | translate}}</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="vocabularyFilter" translate>Vocabulary</label>
              <select id="vocabularyFilter " class="form-control" [(ngModel)]="onlyVocabulary">
                <option [ngValue]="null" translate>All vocabularies</option>
                <option *ngFor="let vocabulary of vocabularies" [ngValue]="vocabulary">{{vocabulary.label | translateValue}}</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="col-md-5">

          <div class="search-results"
               infinite-scroll
               [infiniteScrollDistance]="3"
               [scrollWindow]="false"
               (scrolled)="loadConcepts()">
            
            <div class="search-result"
                 *ngFor="let concept of searchResults; trackBy: conceptIdentity" (click)="navigate(concept)">
              <h6 [innerHTML]="concept.label | translateValue"></h6>
              <p [innerHTML]="concept.definition | translateValue | stripMarkdown"></p>

              <div class="origin">
                <span class="pull-left">{{concept.vocabulary.label | translateValue}}</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      <vocabularies *ngIf="vocabularies" [vocabularies]="vocabularies"></vocabularies>

    </div>
  `
})
export class FrontpageComponent {

  searchResults$ = new BehaviorSubject<IndexedConcept[]>([]);

  search$ = new BehaviorSubject('');
  debouncedSearch$ = this.search$.debounceTime(500);
  onlyStatus$ = new BehaviorSubject<string|null>(null);
  onlyVocabulary$ = new BehaviorSubject<VocabularyNode|null>(null);

  loading = false;

  loaded = 0;
  canLoadMore = true;

  vocabularies: VocabularyNode[] = [];

  statuses = statuses;

  constructor(locationService: LocationService,
              termedService: TermedService,
              private router: Router,
              private elasticSearchService: ElasticSearchService) {

    termedService.getVocabularyList(defaultLanguages)
      .subscribe(vocabularies => this.vocabularies = vocabularies);

    Observable.combineLatest(this.debouncedSearch$, this.onlyStatus$, this.onlyVocabulary$)
      .subscribe(() => this.loadConcepts(true));

    locationService.atFrontPage();
  }

  loadConcepts(reset = false) {

    const search = this.search;
    const batchSize = 100;

    if (reset) {
      this.loaded = 0;
      this.canLoadMore = true;
    }

    if (search) {
      if (this.canLoadMore) {

        this.loading = true;

        const appendResults = (concepts: IndexedConcept[]) => {

          if (concepts.length < batchSize) {
            this.canLoadMore = false;
          }

          this.loaded += concepts.length;

          this.searchResults$.next(reset ? concepts : [...this.searchResults, ...concepts]);
          this.loading = false;
        };

        const onlyGraphId = this.onlyVocabulary ? this.onlyVocabulary.graphId : null;
        this.elasticSearchService.frontpageSearch(this.search, onlyGraphId, this.onlyStatus, this.loaded, batchSize).subscribe(appendResults);
      }
    } else {
      this.searchResults$.next([]);
    }
  }

  get onlyStatus() {
    return this.onlyStatus$.getValue();
  }

  set onlyStatus(value: string|null) {
    this.onlyStatus$.next(value);
  }

  get onlyVocabulary() {
    return this.onlyVocabulary$.getValue();
  }

  set onlyVocabulary(vocabulary: VocabularyNode|null) {
    this.onlyVocabulary$.next(vocabulary);
  }

  navigate(concept: IndexedConcept) {
    this.router.navigate(['/concepts', concept.vocabulary.id, 'concept', concept.id]);
  }

  conceptIdentity(index: number, item: IndexedConcept) {
    return item.id + item.modified.toISOString();
  }

  get search() {
    return this.search$.value;
  }

  set search(value: string) {
    this.search$.next(value);
  }

  get searchResults() {
    return this.searchResults$.getValue();
  }
}
