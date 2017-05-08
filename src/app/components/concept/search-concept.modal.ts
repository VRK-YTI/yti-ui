import { Component, Input, Injectable, OnInit, ElementRef, ViewChild, Renderer, AfterViewInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConceptNode } from '../../entities/node';
import { BehaviorSubject, Observable } from 'rxjs';
import { statuses } from '../../entities/constants';
import { TermedService } from '../../services/termed.service';
import { EditableService } from '../../services/editable.service';
import { ElasticSearchService, IndexedConcept } from '../../services/elasticsearch.service';
import { defaultLanguages } from '../../utils/language';

@Injectable()
export class SearchConceptModalService {

  constructor(private modalService: NgbModal) {
  }

  open(graphId: string): Promise<any> {
    const modalRef = this.modalService.open(SearchConceptModal, { size: 'lg' });
    const instance = modalRef.componentInstance as SearchConceptModal;
    instance.graphId = graphId;
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
            <input #searchInput type="text" class="form-control" placeholder="{{'Search concept...' | translate}}"
                   [(ngModel)]="search"/>
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
        <div class="col-md-4"
             infinite-scroll
             [infiniteScrollDistance]="3"
             [scrollWindow]="false"
             (scrolled)="loadConcepts()">
          <div class="search-results">
            <div class="search-result" [class.selected]="concept === selectedItem"
                 *ngFor="let concept of searchResults$ | async; trackBy: conceptIdentity" (click)="select(concept)">
              <h6 [innerHTML]="concept.label | translateValue"></h6>
              <p [innerHTML]="concept.definition | translateValue | stripMarkdown"></p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <form>
            <concept-form *ngIf="selection && !loadingSelection" [concept]="selection"></concept-form>
          </form>
          <ajax-loading-indicator *ngIf="loadingSelection"></ajax-loading-indicator>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary cancel" (click)="cancel()" translate>Cancel</button>
      <button type="button" class="btn btn-default confirm" (click)="confirm()" [disabled]="!selection" translate>Select
        concept
      </button>
    </div>
  `
})
export class SearchConceptModal implements OnInit, AfterViewInit {

  @ViewChild('searchInput') searchInput: ElementRef;

  @Input() graphId: string;

  searchResults$ = new BehaviorSubject<IndexedConcept[]>([]);

  selectedItem: IndexedConcept|null = null;
  selection: ConceptNode|null = null;

  search$ = new BehaviorSubject('');

  onlyStatus$ = new BehaviorSubject<string|null>(null);

  loading = false;

  statuses = statuses;

  loaded = 0;
  canLoadMore = true;

  constructor(public modal: NgbActiveModal,
              private termedService: TermedService,
              private elasticSearchService: ElasticSearchService,
              private renderer: Renderer) {
  }

  ngOnInit() {

    const initialSearch = this.search$.take(1);
    const debouncedSearch = this.search$.skip(1).debounceTime(500);
    const search = initialSearch.concat(debouncedSearch);

    Observable.combineLatest(search, this.onlyStatus$)
      .subscribe(() => this.loadConcepts(true));
  }

  loadConcepts(reset = false) {

    const batchSize = 100;

    if (reset) {
      this.loaded = 0;
      this.canLoadMore = true;
    }

    if (this.canLoadMore) {

      this.loading = true;

      this.elasticSearchService.getConceptsForVocabulary(this.graphId, this.search, false, this.onlyStatus, this.loaded, batchSize)
        .subscribe(concepts => {

          if (concepts.length < batchSize) {
            this.canLoadMore = false;
          }

          this.loaded += concepts.length;

          this.searchResults$.next(reset ? concepts : [...this.searchResults, ...concepts]);
          this.loading = false;
        });
    }
  }

  get searchResults() {
    return this.searchResults$.getValue();
  }

  conceptIdentity(index: number, item: IndexedConcept) {
    return item.id + item.modified.toISOString();
  }

  select(concept: IndexedConcept) {

    this.selectedItem = concept;

    this.termedService.getConcept(concept.vocabulary.id, concept.id, defaultLanguages).subscribe(concept => {
      this.selection = concept;
    })
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
    this.modal.dismiss('cancel');
  }

  confirm() {
    this.modal.close(this.selection);
  }
}
