import { Component, Input, Injectable, OnInit, ElementRef, ViewChild, Renderer, AfterViewInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConceptNode } from '../../entities/node';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  ContentExtractor, filterAndSortSearchResults, labelComparator, scoreComparator,
  TextAnalysis
} from '../../utils/text-analyzer';
import { isDefined } from '../../utils/object';
import { LanguageService } from '../../services/language.service';
import { statuses } from '../../entities/constants';
import { TermedService } from '../../services/termed.service';
import { EditableService } from '../../services/editable.service';

@Injectable()
export class SearchConceptModalService {

  constructor(private modalService: NgbModal) {
  }

  open(conceptsProvider: () => ConceptNode[]): Promise<any> {
    const modalRef = this.modalService.open(SearchConceptModal, { size: 'lg' });
    const instance = modalRef.componentInstance as SearchConceptModal;
    instance.concepts = conceptsProvider();
    return modalRef.result;
  }
}

@Component({
  selector: 'search-concept-modal',
  styleUrls: ['./search-concept.modal.scss'],
  providers: [EditableService],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">
        <a><i class="fa fa-times" (click)="cancel()"></i></a>
        <span translate>Choose concept</span>
      </h4>
    </div>
    <div class="modal-body full-height">
      <div class="row">
        <div class="col-md-4">
          
          <div class="input-group input-group-lg input-group-search">
            <input #searchInput type="text" class="form-control" placeholder="{{'Search concept...' | translate}}" [(ngModel)]="search" />
          </div>

          <div class="search-panel">
            <span class="title" translate>Filter results</span>
            
            <div class="form-group">
              <label for="status" translate>Status</label>
              <select id="status " class="form-control" [(ngModel)]="onlyStatus">
                <option [ngValue]="null" translate>All statuses</option>
                <option *ngFor="let status of statuses" [ngValue]="status">{{status | translate}}</option>
              </select>
            </div>
          </div>
          
        </div>
        <div class="col-md-4">
          <div class="search-results">
            <div class="search-result" [class.selected]="concept === selectedItem" *ngFor="let concept of searchResults | async" (click)="select(concept)">
              <h6 [innerHTML]="concept.label | translateSearchValue: debouncedSearch | highlight: debouncedSearch"></h6>
              <p [innerHTML]="concept.definition | translateSearchValue: debouncedSearch | stripMarkdown | highlight: debouncedSearch"></p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <form>
            <concept-form *ngIf="selection && !loadingSelection" [concept]="selection" [conceptsProvider]="conceptsProvider"></concept-form>
          </form>
          <ajax-loading-indicator *ngIf="loadingSelection"></ajax-loading-indicator>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary cancel" (click)="cancel()" translate>Cancel</button>
      <button type="button" class="btn btn-default confirm" (click)="confirm()" [disabled]="!selection" translate>Select concept</button>
    </div>
  `
})
export class SearchConceptModal implements OnInit, AfterViewInit {

  @ViewChild('searchInput') searchInput: ElementRef;

  @Input() concepts: ConceptNode[];

  searchResults: Observable<ConceptNode[]>;

  selectedItem: ConceptNode|null = null;
  selection: ConceptNode|null = null;

  search$ = new BehaviorSubject('');
  debouncedSearch = this.search;

  onlyStatus$ = new BehaviorSubject<string|null>(null);

  statuses = statuses;

  constructor(public modal: NgbActiveModal,
              private languageService: LanguageService,
              private termedService: TermedService,
              private renderer: Renderer) {
  }

  ngOnInit() {
    const initialSearch = this.search$.take(1);
    const debouncedSearch = this.search$.skip(1).debounceTime(500);
    const search = initialSearch.concat(debouncedSearch);

    const update = (search: string, onlyStatus: string|null) => {

      this.debouncedSearch = search;
      const scoreFilter = (item: TextAnalysis<ConceptNode>) => !search || isDefined(item.matchScore) || item.score < 2;
      const statusFilter = (item: TextAnalysis<ConceptNode>) => !onlyStatus || item.item.status === onlyStatus;
      const labelExtractor: ContentExtractor<ConceptNode> = concept => concept.label;
      const definitionExtractor: ContentExtractor<ConceptNode> = concept => concept.definition;
      const comparator = scoreComparator().andThen(labelComparator(this.languageService));

      return filterAndSortSearchResults(this.concepts, search, [labelExtractor, definitionExtractor], [scoreFilter, statusFilter], comparator);
    };

    this.searchResults = Observable.combineLatest([search, this.onlyStatus$], update);
  }

  select(concept: ConceptNode) {

    this.selectedItem = concept;

    this.termedService.getConcept(concept.graphId, concept.id, concept.languages).subscribe(concept => {
      this.selection = concept;
    })
  }

  get conceptsProvider() {
    return () => this.concepts;
  }

  get loadingSelection() {
    return this.selectedItem && (!this.selection || this.selectedItem.id !== this.selection.id);
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

  get onlyStatus() {
    return this.onlyStatus$.getValue();
  }

  set onlyStatus(value: string|null) {
    this.onlyStatus$.next(value);
  }

  cancel() {
    this.modal.dismiss();
  }

  confirm() {
    this.modal.close(this.selection);
  }
}
