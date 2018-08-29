import { AfterViewInit, Component, ElementRef, Injectable, Input, OnInit, Renderer, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConceptNode, VocabularyNode } from 'app/entities/node';
import { BehaviorSubject, combineLatest, concat, Observable } from 'rxjs';
import { debounceTime, map, skip, take } from 'rxjs/operators';
import { TermedService } from 'app/services/termed.service';
import { EditableService } from 'app/services/editable.service';
import { ElasticSearchService, IndexedConcept } from 'app/services/elasticsearch.service';
import { FormNode } from 'app/services/form-state';
import { defaultLanguages } from 'app/utils/language';
import { firstMatching } from 'yti-common-ui/utils/array';
import { LanguageService } from 'app/services/language.service';
import { ModalService } from 'app/services/modal.service';
import { MetaModelService } from 'app/services/meta-model.service';

type Mode = 'include'|'exclude';

export interface Restrict {
  graphId: string;
  conceptId: string;
  reason: string;
}

@Injectable()
export class SearchConceptModalService {

  constructor(private modalService: ModalService) {
  }

  openForVocabulary(vocabulary: VocabularyNode, initialSearch: string, restricts: Restrict[]): Promise<ConceptNode> {
    const modalRef = this.modalService.open(SearchConceptModalComponent, { size: 'lg' });
    const instance = modalRef.componentInstance as SearchConceptModalComponent;
    instance.graphId = vocabulary.graphId;
    instance.vocabulary = vocabulary;
    instance.filterLanguages = vocabulary.languages;
    instance.mode = 'include';
    instance.initialSearch = initialSearch;
    instance.restricts = restricts;
    return modalRef.result;
  }

  openOtherThanVocabulary(vocabulary: VocabularyNode, initialSearch = '', restricts: Restrict[]): Promise<ConceptNode> {
    const modalRef = this.modalService.open(SearchConceptModalComponent, { size: 'lg' });
    const instance = modalRef.componentInstance as SearchConceptModalComponent;
    instance.graphId = vocabulary.graphId;
    instance.vocabulary = vocabulary;
    instance.filterLanguages = vocabulary.languages;
    instance.mode = 'exclude';
    instance.initialSearch = initialSearch;
    instance.restricts = restricts;
    return modalRef.result;
  }
}

@Component({
  selector: 'app-search-concept-modal',
  styleUrls: ['./search-concept-modal.component.scss'],
  providers: [EditableService],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">
        <a><i class="fa fa-times" id="search_concept_cancel_link" (click)="cancel()"></i></a>
        <span translate>Choose concept</span>
      </h4>
    </div>
    <div class="modal-body full-height">

      <div class="row mb-2">
        <div class="col-12">

          <div class="input-group input-group-lg input-group-search float-left">
            <input #searchInput
                   id="search_concept_search_input"
                   type="text"
                   class="form-control"
                   placeholder="{{'Search concept' | translate}}"
                   [(ngModel)]="search"/>
          </div>

          <app-filter-language [(ngModel)]="filterLanguage"
                               [ngModelOptions]="{standalone: true}"
                               [languages]="filterLanguages"
                               id="search_concept_filter_language"
                               class="float-right"></app-filter-language>
        </div>
      </div>

      <div class="row mb-2">
        <div class="col-12">

          <app-vocabulary-filter-dropdown [filterSubject]="onlyVocabulary$"
                                          id="search_concept_vocabulary_filter_dropdown"
                                          [vocabularies]="vocabularies"
                                          class="float-left"></app-vocabulary-filter-dropdown>

          <app-status-filter-dropdown *ngIf="hasStatus()"
                                      id="search_concept_status_filter_dropdown"
                                      [filterSubject]="onlyStatus$"
                                      class="float-left ml-2"></app-status-filter-dropdown>

        </div>
      </div>

      <div class="row full-height">
        <div class="col-md-6">
          <div class="content-box">
            <div class="search-results" 
                 id="search_concept_search_results"
                 infinite-scroll
                 [infiniteScrollDistance]="3"
                 [scrollWindow]="false"
                 (scrolled)="loadConcepts()">

              <div *ngFor="let concept of searchResults$ | async; trackBy: conceptIdentity; let last = last"
                   class="search-result"
                   [id]="concept.idIdentifier +'_search_result_concept'"
                   [class.active]="concept === selectedItem"
                   (click)="select(concept)">
                <div class="content" [class.last]="last">
                  <span class="title" [innerHTML]="concept.label | translateValue"></span>
                  <span class="body" [innerHTML]="concept.definitionWithoutSemantics | translateValue"></span>
                  <div class="origin">
                    <span class="float-left">{{concept.vocabulary.label | translateValue}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <form>
            <app-concept-form *ngIf="selection && !loadingSelection"
                              [concept]="selection"
                              [form]="formNode"
                              [filterLanguage]="filterLanguage"
                              [vocabulary]="vocabulary"></app-concept-form>
          </form>

          <app-ajax-loading-indicator *ngIf="loadingSelection"></app-ajax-loading-indicator>
        </div>
      </div>
    </div>

    <div class="modal-footer">

      <button type="button"
              id="search_concept_confirm_button"
              class="btn btn-action confirm"
              (click)="confirm()"
              [disabled]="cannotSelect()">{{'Select concept' | translate}}
      </button>

      <button type="button"
              id="search_concept_cancel_button"
              class="btn btn-link cancel"
              (click)="cancel()">{{'Cancel' | translate}}
      </button>

      <div class="alert alert-danger modal-alert" role="alert" *ngIf="restrictionReasonForSelection">
        <span class="fa fa-exclamation-circle" aria-hidden="true"></span>
        <span>{{restrictionReasonForSelection | translate}}</span>
      </div>

    </div>
  `
})
export class SearchConceptModalComponent implements OnInit, AfterViewInit {

  @ViewChild('searchInput') searchInput: ElementRef;

  @Input() mode: Mode;
  @Input() graphId: string;
  @Input() initialSearch: string;
  @Input() restricts: Restrict[];
  @Input() vocabulary: VocabularyNode;
  @Input() filterLanguages: string[];

  searchResults$ = new BehaviorSubject<IndexedConcept[]>([]);

  selectedItem: IndexedConcept|null = null;
  selection: ConceptNode|null = null;
  formNode: FormNode|null;

  search$ = new BehaviorSubject('');
  onlyStatus$ = new BehaviorSubject<string|null>(null);
  onlyVocabulary$ = new BehaviorSubject<VocabularyNode|null>(null);

  loading = false;

  vocabularies: Observable<VocabularyNode[]>;

  loaded = 0;
  canLoadMore = true;

  constructor(public modal: NgbActiveModal,
              private termedService: TermedService,
              private elasticSearchService: ElasticSearchService,
              private renderer: Renderer,
              private languageService: LanguageService,
              private metaModelService: MetaModelService) {
  }

  ngOnInit() {

    this.search = this.initialSearch;

    const initialSearch = this.search$.pipe(take(1));
    const debouncedSearch = this.search$.pipe(skip(1), debounceTime(500));
    const search = concat(initialSearch, debouncedSearch);

    this.vocabularies = this.termedService.getVocabularyList()
      .pipe(map(vocabularies => vocabularies.filter(vocabulary => vocabulary.graphId !== this.graphId)));

    combineLatest(search, this.onlyStatus$, this.onlyVocabulary$)
      .subscribe(() => this.loadConcepts(true));
  }

  get restrictionReasonForSelection(): string|null {

    const selection = this.selection;

    if (!selection) {
      return null;
    }

    const restriction = firstMatching(this.restricts, restrict => restrict.graphId === selection.graphId && restrict.conceptId === selection.id);
    return restriction ? restriction.reason : null;
  }

  hasStatus(): boolean {
    // TODO check from meta model if concept has status or not for this vocabulary
    return true;
  }

  cannotSelect() {
    return !this.selection || this.restrictionReasonForSelection !== null;
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

  select(indexedConcept: IndexedConcept) {

    this.selectedItem = indexedConcept;
    const graphId = indexedConcept.vocabulary.id;

    combineLatest(this.termedService.getConcept(graphId, indexedConcept.id), this.metaModelService.getMeta(graphId))
      .subscribe(([concept, metaModel]) => {
        this.selection = concept;
        this.formNode = this.selection ? new FormNode(this.selection, () => defaultLanguages, metaModel) : null;
      });
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

  get onlyVocabulary() {
    return this.onlyVocabulary$.getValue();
  }

  cancel() {
    this.modal.dismiss('cancel');
  }

  confirm() {
    this.modal.close(this.selection);
  }

  get filterLanguage() {
    return this.languageService.filterLanguage;
  }

  set filterLanguage(lang: string) {
    this.languageService.filterLanguage = lang;
  }
}
