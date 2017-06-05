import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TermedService } from '../../services/termed.service';
import { LocationService } from '../../services/location.service';
import { VocabularyNode } from '../../entities/node';
import { Localizable } from '../../entities/localization';
import { groupBy, allMatching } from '../../utils/array';
import { isDefined, requireDefined } from '../../utils/object';
import { UserService } from '../../services/user.service';
import { defaultLanguages } from '../../utils/language';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ElasticSearchService, IndexedConcept } from '../../services/elasticsearch.service';

const MIN_SEARCH_STRING_LENGTH = 3;

@Component({
  selector: 'vocabularies',
  styleUrls: ['./vocabularies.component.scss'],
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

      <div class="row add-vocabulary">
        <div class="col-md-12">
          <button class="button btn-default pull-right" *ngIf="canAddVocabulary()" (click)="addVocabulary()">
            <i class="fa fa-plus"></i>
            <span translate>Add vocabulary</span>
          </button>
        </div>
      </div>
      
      <div class="row vocabularies" *ngIf="vocabularies">

        <div class="col-md-4">
          <div class="filters">

            <div *ngFor="let filter of filters; let hideSeparator = last">

              <div class="filter">
                <span class="title">{{filter.title | translate}}</span>
                <div class="item" [class.selected]="item.selected" (click)="item.toggle()"
                     *ngFor="let item of filter.items">
                  <span class="name">{{item.name | translateValue}}</span>
                  <span class="count">({{item.count}})</span>
                </div>
              </div>

              <div [hidden]="hideSeparator" class="separator"></div>
            </div>

          </div>
        </div>

        <div class="col-md-8">

          <div class="row">
            <div class="col-md-12">
              <div class="amount">
                <strong>{{filterResults.length}}</strong>
                <span *ngIf="filterResults.length === 1" translate>vocabulary</span>
                <span *ngIf="filterResults.length !== 1" translate>vocabularies</span>
              </div>
            </div>
          </div>

          <div class="search-result" *ngFor="let vocabulary of filterResults" (click)="navigate(vocabulary)">
            <div class="content">
              <span class="title">{{vocabulary.label | translateValue}}</span>
              <p>{{vocabulary.description | translateValue}}</p>
            </div>
            <div class="origin">
              <span class="publisher" *ngIf="vocabulary.hasPublisher()">{{vocabulary.publisher.label | translateValue}}</span>
              <span class="group" *ngIf="vocabulary.hasGroup()">{{vocabulary.group.label | translateValue}}</span>
              <span class="type">{{vocabulary.typeLabel | translateValue}}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  `
})
export class VocabulariesComponent {

  vocabularies: VocabularyNode[];
  filterResults: VocabularyNode[];

  filters: Filter[];

  results: IndexedConcept[];
  search$ = new BehaviorSubject('');
  searching = false;

  constructor(termedService: TermedService,
              locationService: LocationService,
              elasticSearchService: ElasticSearchService,
              private userService: UserService,
              private router: Router) {

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

    termedService.getVocabularyList(defaultLanguages).subscribe(vocabularies => {
      this.vocabularies = vocabularies;

      const recalculateResults = () => {
        this.filterResults = vocabularies.filter(node => allMatching(this.filters, filter => filter.matches(node)));
      };

      this.filters = [
        new Filter('Vocabulary type', vocabularies, (node) => node.meta.type, (node) => node.meta.label, recalculateResults),
        new Filter('Group', vocabularies, (node) => node.hasGroup() ? node.group.id : null, (node) => node.group.label, recalculateResults),
        new Filter('Organization', vocabularies, (node) => node.hasPublisher() ? node.publisher.id : null, (node) => node.publisher.label, recalculateResults)
      ];

      recalculateResults();
    });

    locationService.atFrontPage();
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

  navigate(vocabulary: VocabularyNode) {
    this.router.navigate(['/concepts', vocabulary.graphId]);
  }

  canAddVocabulary() {
    return this.userService.isLoggedIn();
  }

  addVocabulary() {
    this.router.navigate(['/newVocabulary']);
  }
}

type Extractor<T> = (node: VocabularyNode) => T;

class Filter {

  items: Item[];
  selected = new Set<any>();

  constructor(public title: string,
              nodes: VocabularyNode[],
              private idExtractor: Extractor<any>,
              nameExtractor: Extractor<Localizable>,
              onChange: () => void) {

    const nodesWithId = nodes.filter(node => isDefined(idExtractor(node)));

    this.items = Array.from(groupBy(nodesWithId, idExtractor).entries())
        .map(([id, nodes]) => new Item(this, id, nameExtractor(requireDefined(nodes[0])), nodes.length, onChange));
  }

  matches(node: VocabularyNode) {
    return this.selected.size === 0 || this.selected.has(this.idExtractor(node));
  }
}

class Item {

  constructor(private filter: Filter,
              private id: any,
              public name: Localizable,
              public count: number,
              private onChange: () => void) {
  }

  get selected() {
    return this.filter.selected.has(this.id);
  }

  deselect() {
    this.filter.selected.delete(this.id);
    this.onChange();
  }

  select() {
    this.filter.selected.add(this.id);
    this.onChange();
  }

  toggle() {
    if (this.selected) {
      this.deselect();
    } else {
      this.select();
    }
  }
}
