import { Component } from "@angular/core";
import {
  ElasticSearchService, IndexedConcept,
} from "../../services/elasticsearch.service";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const MIN_SEARCH_STRING_LENGTH = 3;

@Component({
  selector: "autocomplete",
  styleUrls: ['./autocomplete.component.scss'],
  template: `
    <div class="input-group input-group-lg input-group-search">
      <input [(ngModel)]="search"
             type="text"
             class="form-control"
             (blur)="clearSearch()"
             [placeholder]="'Search concept...' | translate"/>
    </div>

    <div class="sb-message" *ngIf="searching"><span>searching...</span></div>
    <div class="sb-message" *ngIf="noResults"><span>nothing was found</span></div>
    
    <div class="sb-searchresults">
      <ul class="sb-results-dropdown-menu">
        <li *ngFor="let result of results">
          <span [routerLink]="['/concepts', result.vocabulary.id, 'concept', result.id]"
                [ngbPopover]="popContent" placement="right" triggers="mouseenter:mouseleave">
            
            <div [innerHTML]="result.label | translateValue"></div>
            <em class="font-small">{{result.vocabulary.label | translateValue}}</em>
          </span>
          
          <template #popContent>
            <div markdown [value]="result.definition | translateValue"></div>
          </template>
        </li>
      </ul>
    </div>
  `
})
export class AutoComplete {

  results: IndexedConcept[];
  search$ = new BehaviorSubject('');
  searching = false;

  constructor(elasticSearchService: ElasticSearchService) {

    this.search$
      .map(search => search.trim())
      .filter(search => search.length >= MIN_SEARCH_STRING_LENGTH)
      .subscribe(() => this.searching = true);

    this.search$
      .map(search => search.trim())
      .debounceTime(500)
      .subscribe(search => {
        if (search.length >= MIN_SEARCH_STRING_LENGTH) {
          this.searching = true;

          elasticSearchService.frontPageSearch(search, 15).subscribe(searchResult => {
            this.results = searchResult;
            this.searching = false;
          });
        } else {
          this.results = [];
          this.searching = false;
        }
      });
  }

  get search() {
    return this.search$.value;
  }

  set search(value: string) {
    this.search$.next(value);
  }

  get noResults() {
    return this.search.length >= MIN_SEARCH_STRING_LENGTH && !this.searching && this.results.length === 0;
  }

  clearSearch() {
    // delay so that click has time to invoke
    setTimeout(() => this.search = '', 100);
  }
}
