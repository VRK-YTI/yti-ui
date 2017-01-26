import { Component, OnInit, AfterViewInit, Renderer, ViewChild, ElementRef } from '@angular/core';
import { TermedService, ConceptListItem } from '../services/termed.service';
import { ActivatedRoute } from '@angular/router';
import { LocationService } from '../services/location.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { LanguageService } from '../services/language.service';
import {
  filterAndSortSearchResults, TextAnalysis, scoreComparator, labelComparator,
  ContentExtractor
} from '../utils/text-analyzer';
import { isDefined } from '../utils/object';

@Component({
  selector: 'concepts',
  styleUrls: ['./concepts.component.scss'],
  template: `
    <div class="container">

      <div class="row">
        <div class="col-md-12">
          <div class="page-header">
            <h1 translate>Concepts</h1>
          </div>
        </div>
      </div>
      <div class="row">
      
        <div class="col-md-4">
          <div class="input-group input-group-lg">
            <input #searchInput
                   [(ngModel)]="search"
                   type="text" 
                   class="form-control" 
                   [placeholder]="'search...' | translate" />
          </div>
        </div>
        
        <div class="col-md-8">
          
          <ul *ngIf="!loading">
            <li *ngFor="let concept of searchResults | async">
              <a [routerLink]="['concept', concept.id]" [innerHTML]="concept.label | translateSearchValue: search | highlight: search"></a>
            </li>
          </ul>
          
          <ajax-loading-indicator *ngIf="loading"></ajax-loading-indicator>
          
        </div>
      </div>
      
    </div>
  `
})
export class ConceptsComponent implements OnInit, AfterViewInit {

  loading = true;
  searchResults: Observable<ConceptListItem[]>;
  search$ = new BehaviorSubject('');
  _search = '';

  @ViewChild('searchInput') searchInput: ElementRef;

  constructor(private route: ActivatedRoute,
              private renderer: Renderer,
              private termedService: TermedService,
              private locationService: LocationService,
              private languageService: LanguageService) {
  }

  get search() {
    return this._search;
  }

  set search(value: string) {
    this._search = value;
    this.search$.next(value);
  }

  ngOnInit() {

    const concepts = this.route.params.switchMap(params => this.termedService.getConceptListItems(params['graphId']));

    this.searchResults = Observable.combineLatest([concepts, this.search$.debounceTime(500)], (concepts: ConceptListItem[], search: string) => {

      const scoreFilter = (item: TextAnalysis<ConceptListItem>) => !search || isDefined(item.matchScore) || item.score < 2;
      const labelExtractor: ContentExtractor<ConceptListItem> = concept => concept.label;
      const comparator = scoreComparator().andThen(labelComparator(this.languageService));

      return filterAndSortSearchResults(concepts, search, [labelExtractor], [scoreFilter], comparator);
    });

    this.route.params.switchMap(params => this.termedService.getConceptSchemeItem(params['graphId']))
      .subscribe(scheme => this.locationService.atConceptScheme(scheme));

    concepts.subscribe(() => this.loading = false);
  }

  ngAfterViewInit() {
    this.renderer.invokeElementMethod(this.searchInput.nativeElement, 'focus');
  }
}
