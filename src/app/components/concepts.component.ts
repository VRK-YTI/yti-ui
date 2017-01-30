import { Component, OnInit, AfterViewInit, Renderer, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { TermedService } from '../services/termed.service';
import { LanguageService } from '../services/language.service';
import { Node } from '../entities/node';
import {
  filterAndSortSearchResults, TextAnalysis, scoreComparator, labelComparator,
  ContentExtractor
} from '../utils/text-analyzer';
import { isDefined } from '../utils/object';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'concepts',
  styleUrls: ['./concepts.component.scss'],
  template: `
    <div class="container-fluid">

      <div class="row">
      
        <div class="col-md-4">
          <div class="row">
            <div class="col-md-12">
              <div class="input-group input-group-lg">
                <input #searchInput
                       [(ngModel)]="search"
                       type="text" 
                       class="form-control" 
                       [placeholder]="'search...' | translate" />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12">
              <ul *ngIf="!loading" class="search-results">
                <li *ngFor="let concept of searchResults | async">
                  <a [routerLink]="['/concepts', concept.graphId, 'concept', concept.id]" [innerHTML]="concept.label | translateSearchValue: search | highlight: search"></a>
                </li>
              </ul>
              
              <ajax-loading-indicator *ngIf="loading"></ajax-loading-indicator>
            </div>
          </div>
          
        </div>
        
        <div class="col-md-8 selection">
          <router-outlet></router-outlet>
        </div>
      </div>
      
    </div>
  `
})
export class ConceptsComponent implements OnInit, AfterViewInit {

  loading = true;
  conceptScheme: Node<'ConceptScheme'>;
  conceptScheme$: Observable<Node<'ConceptScheme'>>;
  searchResults: Observable<Node<'Concept'>[]>;
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

    const graphId$ = this.route.params.map(params => params['graphId'] as string);

    const concepts$ = graphId$.switchMap(graphId => this.termedService.getConceptList(graphId))
      .publishReplay()
      .refCount();

    this.conceptScheme$ = graphId$.switchMap(graphId => this.termedService.getConceptScheme(graphId))
      .publishReplay()
      .refCount();

    Observable.zip(concepts$, this.conceptScheme$).subscribe(zipped => {
      const conceptScheme = zipped[1];
      this.locationService.atConceptScheme(conceptScheme);
      this.conceptScheme = conceptScheme;
      this.loading = false;
    });

    this.searchResults = Observable.combineLatest([concepts$, this.search$.debounceTime(500)], (concepts: Node<'Concept'>[], search: string) => {

      const scoreFilter = (item: TextAnalysis<Node<'Concept'>>) => !search || isDefined(item.matchScore) || item.score < 2;
      const labelExtractor: ContentExtractor<Node<'Concept'>> = concept => concept.label;
      const comparator = scoreComparator().andThen(labelComparator(this.languageService));

      return filterAndSortSearchResults(concepts, search, [labelExtractor], [scoreFilter], comparator);
    });
  }

  ngAfterViewInit() {
    this.renderer.invokeElementMethod(this.searchInput.nativeElement, 'focus');
  }
}
