import { Component, Input, Injectable, OnInit, ElementRef, ViewChild, Renderer, AfterViewInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConceptNode, VocabularyNode } from '../../entities/node';
import { BehaviorSubject, Observable } from 'rxjs';
import { statuses } from '../../entities/constants';
import { TermedService } from '../../services/termed.service';
import { EditableService } from '../../services/editable.service';
import { ElasticSearchService, IndexedConcept } from '../../services/elasticsearch.service';
import { FormNode } from '../../services/form-state';
import { defaultLanguages } from '../../utils/language';

type Mode = 'include'|'exclude';

@Injectable()
export class SearchConceptModalService {

  constructor(private modalService: NgbModal) {
  }

  openForGraph(graphId: string, initialSearch = ''): Promise<ConceptNode> {
    const modalRef = this.modalService.open(SearchConceptModal, { size: 'lg' });
    const instance = modalRef.componentInstance as SearchConceptModal;
    instance.graphId = graphId;
    instance.mode = 'include';
    instance.initialSearch = initialSearch;
    return modalRef.result;
  }

  openOtherThanGraph(graphId: string, initialSearch = ''): Promise<ConceptNode> {
    const modalRef = this.modalService.open(SearchConceptModal, { size: 'lg' });
    const instance = modalRef.componentInstance as SearchConceptModal;
    instance.graphId = graphId;
    instance.mode = 'exclude';
    instance.initialSearch = initialSearch;
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
              <label for="statusFilter" translate>Status</label>
              <select id="statusFilter" class="form-control" [(ngModel)]="onlyStatus">
                <option [ngValue]="null" translate>All statuses</option>
                <option *ngFor="let status of statuses" [ngValue]="status">{{status | translate}}</option>
              </select>
            </div>

            <div class="form-group" *ngIf="mode === 'exclude'">
              <label for="vocabularyFilter" translate>Vocabulary</label>
              <select id="vocabularyFilter" class="form-control" [(ngModel)]="onlyVocabulary">
                <option [ngValue]="null" translate>All vocabularies</option>
                <option *ngFor="let vocabulary of vocabularies | async" [ngValue]="vocabulary">{{vocabulary.label | translateValue}}</option>
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

              <div class="origin">
                <span class="pull-left">{{concept.vocabulary.label | translateValue}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <form>
            <concept-form *ngIf="selection && !loadingSelection" [concept]="selection" [form]="formNode"></concept-form>
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

  @Input() mode: Mode;
  @Input() graphId: string;
  @Input() initialSearch: string;

  searchResults$ = new BehaviorSubject<IndexedConcept[]>([]);

  selectedItem: IndexedConcept|null = null;
  selection: ConceptNode|null = null;
  formNode: FormNode|null;

  search$ = new BehaviorSubject('');
  onlyStatus$ = new BehaviorSubject<string|null>(null);
  onlyVocabulary$ = new BehaviorSubject<VocabularyNode|null>(null);

  loading = false;

  statuses = statuses;
  vocabularies: Observable<VocabularyNode[]>;

  loaded = 0;
  canLoadMore = true;

  constructor(public modal: NgbActiveModal,
              private termedService: TermedService,
              private elasticSearchService: ElasticSearchService,
              private renderer: Renderer) {
  }

  ngOnInit() {

    this.search = this.initialSearch;

    const initialSearch = this.search$.take(1);
    const debouncedSearch = this.search$.skip(1).debounceTime(500);
    const search = initialSearch.concat(debouncedSearch);

    this.vocabularies = this.termedService.getVocabularyList()
      .map(vocabularies => vocabularies.filter(vocabulary => vocabulary.graphId !== this.graphId));

    Observable.combineLatest(search, this.onlyStatus$, this.onlyVocabulary$)
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

      const appendResults = (concepts: IndexedConcept[]) => {
        if (concepts.length < batchSize) {
          this.canLoadMore = false;
        }

        this.loaded += concepts.length;

        this.searchResults$.next(reset ? concepts : [...this.searchResults, ...concepts]);
        this.loading = false;
      };

      if (this.onlyVocabulary) {
        this.elasticSearchService.getAllConceptsForVocabulary(this.onlyVocabulary.graphId, this.search, false, this.onlyStatus, this.loaded, batchSize).subscribe(appendResults);
      } else {
        if (this.mode === 'include') {
          this.elasticSearchService.getAllConceptsForVocabulary(this.graphId, this.search, false, this.onlyStatus, this.loaded, batchSize).subscribe(appendResults);
        } else {
          this.elasticSearchService.getAllConceptsNotInVocabulary(this.graphId, this.search, false, this.onlyStatus, this.loaded, batchSize).subscribe(appendResults);
        }
      }
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

    this.termedService.getConcept(concept.vocabulary.id, concept.id).subscribe(concept => {
      this.selection = concept;
      this.formNode = this.selection ? new FormNode(this.selection, defaultLanguages) : null;
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

  get onlyVocabulary() {
    return this.onlyVocabulary$.getValue();
  }

  set onlyVocabulary(vocabulary: VocabularyNode|null) {
    this.onlyVocabulary$.next(vocabulary);
  }

  cancel() {
    this.modal.dismiss('cancel');
  }

  confirm() {
    this.modal.close(this.selection);
  }
}
