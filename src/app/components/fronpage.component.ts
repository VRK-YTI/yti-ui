import { Component } from '@angular/core';
import { LocationService } from '../services/location.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ElasticSearchService, IndexedConcept } from '../services/elasticsearch.service';

const MIN_SEARCH_STRING_LENGTH = 3;

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
                       (blur)="clearSearch()"
                       [placeholder]="'Search concept...' | translate"/>
              </div>

              <div class="sb-message" *ngIf="conceptSearchInProgress"><span>searching...</span></div>
              <div class="sb-message" *ngIf="noResults"><span>nothing was found</span></div>

              <div class="sb-searchresults">
                <ul class="sb-results-dropdown-menu">
                  <li *ngFor="let result of conceptSearchResults">
                    <span [routerLink]="['/concepts', result.vocabulary.id, 'concept', result.id]"
                          [ngbPopover]="popContent" placement="right" triggers="mouseenter:mouseleave">
                      
                      <div [innerHTML]="result.label | translateValue"></div>
                      <em class="font-small">{{result.vocabulary.label | translateValue}}</em>
                    </span>

                    <ng-template #popContent>
                      <div markdown [value]="result.definition | translateValue"></div>
                    </ng-template>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>

      <vocabularies></vocabularies>

    </div>
  `
})
export class FrontpageComponent {

  conceptSearchResults: IndexedConcept[];
  conceptSearch$ = new BehaviorSubject('');
  conceptSearchInProgress = false;

  constructor(locationService: LocationService,
              elasticSearchService: ElasticSearchService) {

    this.conceptSearch$
      .map(search => search.trim())
      .filter(search => search.length >= MIN_SEARCH_STRING_LENGTH)
      .subscribe(() => this.conceptSearchInProgress = true);

    this.conceptSearch$
      .map(search => search.trim())
      .debounceTime(500)
      .subscribe(search => {
        if (search.length >= MIN_SEARCH_STRING_LENGTH) {
          this.conceptSearchInProgress = true;

          elasticSearchService.frontPageSearch(search, 15).subscribe(searchResult => {
            this.conceptSearchResults = searchResult;
            this.conceptSearchInProgress = false;
          });
        } else {
          this.conceptSearchResults = [];
          this.conceptSearchInProgress = false;
        }
      });

    locationService.atFrontPage();
  }

  get search() {
    return this.conceptSearch$.value;
  }

  set search(value: string) {
    this.conceptSearch$.next(value);
  }

  get noResults() {
    return this.search.length >= MIN_SEARCH_STRING_LENGTH && !this.conceptSearchInProgress && this.conceptSearchResults.length === 0;
  }

  clearSearch() {
    // delay so that click has time to invoke
    setTimeout(() => this.search = '', 100);
  }
}
