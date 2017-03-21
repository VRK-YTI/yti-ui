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
  _search = '';
  debouncedSearch = this._search;

  constructor(private languageService: LanguageService,
              private conceptViewModel: ConceptViewModelService,
              private renderer: Renderer,
              private router: Router) {
  }

  ngOnInit() {

    const initialSearch = this.search$.take(1);
    const debouncedSearch = this.search$.skip(1).debounceTime(500);
    const search = initialSearch.concat(debouncedSearch);

    this.searchResults = Observable.combineLatest([this.conceptViewModel.allConcepts$, search], (concepts: Node<'Concept'>[], search: string) => {

      this.debouncedSearch = search;
      const scoreFilter = (item: TextAnalysis<Node<'Concept'>>) => !search || isDefined(item.matchScore) || item.score < 2;
      const labelExtractor: ContentExtractor<Node<'Concept'>> = concept => concept.label;
      const comparator = scoreComparator().andThen(labelComparator(this.languageService));

      return filterAndSortSearchResults(concepts, search, [labelExtractor], [scoreFilter], comparator);
    });
  }

  ngAfterViewInit() {
    this.renderer.invokeElementMethod(this.searchInput.nativeElement, 'focus');
  }

  get search() {
    return this._search;
  }

  set search(value: string) {
    this._search = value;
    this.search$.next(value);
  }

  navigate(concept: Node<'Concept'>) {
    this.router.navigate(['/concepts', concept.graphId, 'concept', concept.id]);
  }

  isSelected(concept: Node<'Concept'>) {
    return this.conceptViewModel.conceptId === concept.id;
  }
}
