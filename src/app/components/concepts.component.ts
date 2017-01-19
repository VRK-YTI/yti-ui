import { Component, OnInit, AfterViewInit, Renderer, ViewChild, ElementRef } from '@angular/core';
import { TermedService, ConceptListItem } from '../services/termed.service';
import { ActivatedRoute } from '@angular/router';
import { LocationService } from '../services/location.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { LanguageService } from '../services/language.service';

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
                     (keydown)="onSearch($event.target.value)"
                     type="text" 
                     class="form-control" 
                     [placeholder]="'search...' | translate" />
            </div>
          </div>
          <div class="col-md-8">
            
            <ul *ngIf="!loading">
              <li *ngFor="let concept of searchResults | async">
                <a [routerLink]="['concept', concept.id]">
                  {{concept.label | translateValue}}
                </a>
              </li>
            </ul>
            
            <div *ngIf="loading">
              <ajax-loading-indicator></ajax-loading-indicator>
            </div>
            
          </div>
      </div>
      
    </div>
  `
})
export class ConceptsComponent implements OnInit, AfterViewInit {

  loading = true;
  searchResults: Observable<ConceptListItem[]>;
  search$ = new BehaviorSubject('');

  @ViewChild('searchInput') searchInput: ElementRef;

  constructor(private route: ActivatedRoute,
              private renderer: Renderer,
              private termedService: TermedService,
              private locationService: LocationService,
              private languageService: LanguageService) {
  }

  onSearch(value: string) {
    this.search$.next(value);
  }

  ngOnInit() {

    const concepts = this.route.params.switchMap(params => this.termedService.getConceptListItems(params['graphId']));

    this.searchResults = Observable.combineLatest([concepts, this.search$], (concepts: ConceptListItem[], search: string) => {

      // TODO: use levenshtein for matching and sorting
      return concepts.filter(concept => {
        if (!search) {
          return true;
        } else {
          const localized = this.languageService.translate(concept.label);
          return localized.toLowerCase().indexOf(search.toLowerCase()) !== -1;
        }
      });
    });

    this.route.params.switchMap(params => this.termedService.getConceptScheme(params['graphId']))
      .subscribe(scheme => this.locationService.atConceptScheme(scheme));

    concepts.subscribe(() => this.loading = false);
  }

  ngAfterViewInit() {
    this.renderer.invokeElementMethod(this.searchInput.nativeElement, 'focus');
  }
}
