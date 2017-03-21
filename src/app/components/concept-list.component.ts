import { Component, AfterViewInit, OnInit, ElementRef, ViewChild, Renderer } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Node } from '../entities/node';
import {
  filterAndSortSearchResults, labelComparator, scoreComparator, ContentExtractor,
  TextAnalysis
} from '../utils/text-analyzer';
import { isDefined } from '../utils/object';
import { LanguageService } from '../services/language.service';
import { ConceptViewModelService } from '../services/concept.view.service';
import { Router } from '@angular/router';
import { statuses } from '../entities/constants';
import { comparingDate, reversed } from '../utils/comparator';

@Component({
  selector: 'concept-list',
  styleUrls: ['./concept-list.component.scss'],
  template: `
    <div class="row">
      <div class="col-lg-12">
                
        <div class="input-group input-group-lg input-group-search">
          <input #searchInput
                 [(ngModel)]="search"
                 type="text" 
                 class="form-control" 
                 [placeholder]="'Search concept...' | translate" />
        </div>
        
        <div class="filters">
          <div class="form-check pull-left">
            <label class="form-check-label">
              <input class="form-check-input" type="checkbox" [(ngModel)]="sortByTime" /> {{'Order by modified date' | translate}}
            </label>
          </div>
          
          <select class="form-control pull-right" style="width: auto" [(ngModel)]="onlyStatus">
            <option [ngValue]="null" translate>All statuses</option>
            <option *ngFor="let status of statuses" [ngValue]="status">{{status | translate}}</option>        
          </select>
        </div>
        
      </div>
    </div>
  
    <div class="row">
      <div class="col-lg-12 search-results">
        <ul>
          <li *ngFor="let concept of searchResults | async" (click)="navigate(concept)" [class.selection]="isSelected(concept)">
            <span [innerHTML]="concept.label | translateSearchValue: debouncedSearch | highlight: debouncedSearch"></span>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class ConceptListComponent implements OnInit, AfterViewInit {

  @ViewChild('searchInput') searchInput: ElementRef;

  searchResults: Observable<Node<'Concept'>[]>;
  search$ = new BehaviorSubject('');
  sortByTime$ = new BehaviorSubject<boolean>(false);
  onlyStatus$ = new BehaviorSubject<string|null>(null);
  debouncedSearch = this.search;

  statuses = statuses;

  constructor(private languageService: LanguageService,
              private conceptViewModel: ConceptViewModelService,
              private renderer: Renderer,
              private router: Router) {
  }

  ngOnInit() {

    const initialSearch = this.search$.take(1);
    const debouncedSearch = this.search$.skip(1).debounceTime(500);
    const search = initialSearch.concat(debouncedSearch);

    const update = (concepts: Node<'Concept'>[], search: string, sortByTime: boolean, onlyStatus: string|null) => {

      this.debouncedSearch = search;
      const scoreFilter = (item: TextAnalysis<Node<'Concept'>>) => !search || isDefined(item.matchScore) || item.score < 2;
      const statusFilter = (item: TextAnalysis<Node<'Concept'>>) => !onlyStatus || item.item.status === onlyStatus;
      const labelExtractor: ContentExtractor<Node<'Concept'>> = concept => concept.label;
      const scoreAndLabelComparator = scoreComparator().andThen(labelComparator(this.languageService));
      const dateComparator = reversed(comparingDate<TextAnalysis<Node<'Concept'>>>(item => item.item.lastModifiedDate));
      const comparator = sortByTime ? dateComparator.andThen(scoreAndLabelComparator) : scoreAndLabelComparator;

      return filterAndSortSearchResults(concepts, search, [labelExtractor], [scoreFilter, statusFilter], comparator);
    };

    this.searchResults = Observable.combineLatest([this.conceptViewModel.allConcepts$, search, this.sortByTime$, this.onlyStatus$], update);
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

  get sortByTime() {
    return this.sortByTime$.getValue();
  }

  set sortByTime(value: boolean) {
    this.sortByTime$.next(value);
  }

  get onlyStatus() {
    return this.onlyStatus$.getValue();
  }

  set onlyStatus(value: string|null) {
    this.onlyStatus$.next(value);
  }

  navigate(concept: Node<'Concept'>) {
    this.router.navigate(['/concepts', concept.graphId, 'concept', concept.id]);
  }

  isSelected(concept: Node<'Concept'>) {
    return this.conceptViewModel.conceptId === concept.id;
  }
}
