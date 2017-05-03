import { Component, OnInit } from "@angular/core";
import {
  ElasticSearchService, IndexedConcept,
  SearchResponseHit
} from "../../services/elasticsearch.service";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Localizable } from '../../entities/localization';

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

  results: AutocompleteItem[];
  search$ = new BehaviorSubject('');
  searching = false;

  constructor(es: ElasticSearchService) {

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

          es.frontPageSearch(search, 15).subscribe(searchResult => {
            this.results = searchResult.hits.hits.map(hit => new AutocompleteItem(hit));
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


class AutocompleteItem {

  id: string;
  label: Localizable;
  definition: Localizable;
  vocabulary: {
    id: string, // actually graphId
    label: Localizable
  };

  constructor(hit: SearchResponseHit<IndexedConcept>) {
    this.id = hit._source.id;
    this.label = hit._source.label;
    this.definition = hit._source.definition;
    this.vocabulary = hit._source.vocabulary;

    function setPropertyPath(obj: any, path: string, value: any) {

      const split = path.split('.');
      let objectAtPath = obj;

      for (let i = 0; i < split.length - 1; i++) {
        objectAtPath = objectAtPath[split[i]];
      }

      const lastProperty = split[split.length - 1];

      if (lastProperty !== 'exact') {
        objectAtPath[lastProperty] = value;
      }
    }

    // replace localizable values with highlights if found
    for (const [propertyPath, highlighted] of Object.entries(hit.highlight)) {
      setPropertyPath(this, propertyPath, highlighted);
    }
  }
}
