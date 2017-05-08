import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from './location.service';
import { TermedService } from './termed.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { CollectionNode, ConceptNode, VocabularyNode } from '../entities/node';
import { comparingLocalizable } from '../utils/comparator';
import { LanguageService } from './language.service';
import { MetaModelService } from './meta-model.service';
import {
  Action, createEditAction, createNoSelection, createRemoveAction, createSelectAction, EditAction, isEdit, isRemove,
  isSelect,
  RemoveAction,
  SelectAction
} from './action';
import { ElasticSearchService, IndexedConcept } from './elasticsearch.service';
import {
  ContentExtractor, filterAndSortSearchResults, labelComparator, scoreComparator,
  TextAnalysis
} from '../utils/text-analyzer';
import { isDefined } from '../utils/object';
import { defaultLanguages } from '../utils/language';

function onlySelect<T>(action: Observable<Action<T>>): Observable<T> {
  const selectAction: Observable<SelectAction<T>> = action.filter(isSelect);
  return selectAction.map(action => action.item);
}

function onlyEdit<T>(action: Observable<Action<T>>): Observable<T> {
  const editAction: Observable<EditAction<T>> = action.filter(isEdit);
  return editAction.map(action => action.item);
}

function onlyRemove<T>(action: Observable<Action<T>>): Observable<T> {
  const removeAction: Observable<RemoveAction<T>> = action.filter(isRemove);
  return removeAction.map(action => action.item);
}

export class ConceptListModel {

  search$ = new BehaviorSubject('');
  sortByTime$ = new BehaviorSubject<boolean>(false);
  onlyStatus$ = new BehaviorSubject<string|null>(null);
  searchResults = new BehaviorSubject<IndexedConcept[]>([]);
  loading = false;

  private graphId: string;

  constructor(elasticSearchService: ElasticSearchService) {

    const initialSearch = this.search$.take(1);
    const debouncedSearch = this.search$.skip(1).debounceTime(500);
    const search = initialSearch.concat(debouncedSearch);

    Observable.combineLatest(search, this.sortByTime$, this.onlyStatus$)
      .debounceTime(10)
      .subscribe(([search, sort, status]) => {

        this.loading = true;

        elasticSearchService.getConceptsForVocabulary(this.graphId, search, sort, status)
          .subscribe(concepts => {
            this.searchResults.next(concepts);
            this.loading = false;
          });
      });
  }

  initializeGraph(graphId: string) {
    this.graphId = graphId;
  }
}

export class ConceptHierarchyModel {

  topConcepts$ = new BehaviorSubject<IndexedConcept[]>([]);
  nodes = new Map<string, { expanded: boolean, narrowerConcepts: Observable<IndexedConcept[]> } >();
  loading = false;

  constructor(private elasticSearchService: ElasticSearchService) {
  }

  initializeGraph(graphId: string) {

    this.loading = true;

    this.elasticSearchService.getTopConceptsForVocabulary(graphId)
      .subscribe(topConcepts => {
        this.topConcepts$.next(topConcepts);
        this.loading = false;
      });
  }

  getNarrowerConcepts(concept: IndexedConcept): Observable<IndexedConcept[]> {
    return this.nodes.get(concept.id)!.narrowerConcepts;
  }

  collapse(concept: IndexedConcept) {
    this.nodes.get(concept.id)!.expanded = false;
  }

  expand(concept: IndexedConcept) {

    if (!this.nodes.has(concept.id)) {
      const subject = new BehaviorSubject<IndexedConcept[]>([]);
      this.nodes.set(concept.id, { expanded: true, narrowerConcepts: subject });

      this.elasticSearchService.getNarrowerConcepts(concept.vocabulary.id, concept.id)
        .subscribe(concepts => subject.next(concepts));
    }
  }

  isExpanded(concept: IndexedConcept) {
    const node = this.nodes.get(concept.id);
    return !!node && node.expanded;
  }
}

export class CollectionListModel {

  search$ = new BehaviorSubject('');
  debouncedSearch = this.search$.getValue();
  searchResults: Observable<CollectionNode[]>;
  allCollections$ = new BehaviorSubject<CollectionNode[]>([]);
  loading = false;

  constructor(private termedService: TermedService, private languageService: LanguageService) {

    const initialSearch = this.search$.take(1);
    const debouncedSearch = this.search$.skip(1).debounceTime(500);
    const search = initialSearch.concat(debouncedSearch);

    this.searchResults = Observable.combineLatest([this.allCollections$, search], (collections: CollectionNode[], search: string) => {

      this.debouncedSearch = search;
      const scoreFilter = (item: TextAnalysis<CollectionNode>) => !search || isDefined(item.matchScore) || item.score < 2;
      const labelExtractor: ContentExtractor<CollectionNode> = collection => collection.label;
      const scoreAndLabelComparator = scoreComparator().andThen(labelComparator(languageService));

      return filterAndSortSearchResults(collections, search, [labelExtractor], [scoreFilter], scoreAndLabelComparator);
    });
  }

  initializeGraph(graphId: string) {

    this.loading = true;

    this.termedService.getCollectionList(graphId, defaultLanguages).subscribe(collections => {
      const sortedCollections = collections.sort(comparingLocalizable<CollectionNode>(this.languageService, collection => collection.label));
      this.allCollections$.next(sortedCollections);
      this.loading = false;
    });
  }
}

@Injectable()
export class ConceptViewModelService {

  vocabularyInEdit: VocabularyNode;
  vocabulary: VocabularyNode;
  vocabulary$ = new BehaviorSubject<Action<VocabularyNode>>(createNoSelection());
  vocabularySelect$ = onlySelect(this.vocabulary$);
  vocabularyEdit$ = onlyEdit(this.vocabulary$);
  vocabularyRemove$ = onlyRemove(this.vocabulary$);

  conceptInEdit: ConceptNode|null;
  conceptAction$ = new BehaviorSubject<Action<ConceptNode>>(createNoSelection());
  conceptSelect$ = onlySelect(this.conceptAction$);
  conceptEdit$ = onlyEdit(this.conceptAction$);
  conceptRemove$ = onlyRemove(this.conceptAction$);

  collectionInEdit: CollectionNode|null;
  collectionAction$ = new BehaviorSubject<Action<CollectionNode>>(createNoSelection());
  collectionSelect$ = onlySelect(this.collectionAction$);
  collectionEdit$ = onlyEdit(this.collectionAction$);
  collectionRemove$ = onlyRemove(this.collectionAction$);

  action$ = Observable.merge(this.conceptAction$, this.collectionAction$);

  graphId: string;
  conceptId: string|null;
  collectionId: string|null;

  conceptList = new ConceptListModel(this.elasticSearchService);
  conceptHierarchy = new ConceptHierarchyModel(this.elasticSearchService);
  collectionList = new CollectionListModel(this.termedService, this.languageService);

  loadingVocabulary = true;
  loadingConcept = true;
  loadingCollection = true;

  constructor(private router: Router,
              private termedService: TermedService,
              private elasticSearchService: ElasticSearchService,
              private metaModelService: MetaModelService,
              private locationService: LocationService,
              private languageService: LanguageService) {

    this.action$.subscribe(action => {
      switch (action.type) {
        case 'edit':
        case 'remove':
          if (action.item.type === 'Concept') {
            this.initializeConceptList(this.graphId);
          } else {
            this.initializeCollectionList(this.graphId);
          }
      }
    });
  }

  get concept(): ConceptNode|null {

    const action = this.conceptAction$.getValue();

    if (action.type === 'noselect' || action.type === 'remove') {
      return null;
    }

    return action.item;
  }

  get collection(): CollectionNode|null {

    const action = this.collectionAction$.getValue();

    if (action.type === 'noselect' || action.type === 'remove') {
      return null;
    }

    return action.item;
  }

  get selection() {
    return this.concept || this.collection;
  }

  initializeConceptList(graphId: string) {
    this.conceptList.search$.next('');
    this.conceptList.sortByTime$.next(false);
    this.conceptList.onlyStatus$.next(null);
    this.conceptList.initializeGraph(graphId);
    this.conceptHierarchy.initializeGraph(graphId);
  }

  initializeCollectionList(graphId: string) {
    this.collectionList.initializeGraph(graphId);
  }

  initializeVocabulary(graphId: string) {

    this.graphId = graphId;
    this.loadingVocabulary = true;

    this.termedService.getVocabulary(graphId, defaultLanguages).subscribe(vocabulary => {
      this.locationService.atVocabulary(vocabulary);
      this.vocabularyInEdit = vocabulary.clone();
      this.vocabulary = vocabulary;
      this.vocabulary$.next(createSelectAction(vocabulary));
      this.loadingVocabulary = false;
    });

    this.initializeConceptList(graphId);
    this.initializeCollectionList(graphId);
  }

  initializeConcept(conceptId: string|null) {

    const init = (concept: ConceptNode|null) => {

      if (this.collection) {
        this.initializeCollection(null);
      }

      this.vocabularySelect$.subscribe(vocabulary => {
        if (concept) {
          this.locationService.atConcept(vocabulary, concept);
        } else {
          this.locationService.atVocabulary(vocabulary);
        }
        this.conceptInEdit = concept ? concept.clone() : null;
        this.conceptAction$.next(concept ? createSelectAction(concept) : createNoSelection());
        this.loadingConcept = false;
      });
    };

    this.loadingConcept = true;
    this.conceptId = conceptId;

    if (!conceptId) {
      init(null);
    } else {
      this.vocabularySelect$.subscribe(vocabulary => {
        this.termedService.findConcept(vocabulary.graphId, conceptId, defaultLanguages).subscribe(concept => {
          if (concept) {
            init(concept);
          } else {
            this.metaModelService.createEmptyConcept(this.vocabulary, conceptId).subscribe(init);
          }
        });
      });
    }
  }

  initializeCollection(collectionId: string|null) {

    const init = (collection: CollectionNode|null) => {

      if (this.concept) {
        this.initializeConcept(null);
      }

      this.vocabularySelect$.subscribe(vocabulary => {
        if (collection) {
          this.locationService.atCollection(vocabulary, collection);
        } else {
          this.locationService.atVocabulary(vocabulary);
        }
        this.collectionInEdit = collection ? collection.clone() : null;
        this.collectionAction$.next(collection ? createSelectAction(collection) : createNoSelection());
        this.loadingCollection = false;
      });
    };

    this.loadingCollection = true;
    this.collectionId = collectionId;

    if (!collectionId) {
      init(null);
    } else {
      this.vocabularySelect$.subscribe(vocabulary => {
        this.termedService.findCollection(vocabulary.graphId, collectionId, defaultLanguages).subscribe(collection => {
          if (collection) {
            init(collection);
          } else {
            this.metaModelService.createEmptyCollection(this.vocabulary, collectionId).subscribe(init);
          }
        });
      });
    }
  }

  saveConcept(): Promise<any> {
    if (!this.conceptInEdit) {
      throw new Error('Cannot save when there is no concept');
    }

    const that = this;
    const concept = this.conceptInEdit;

    return new Promise((resolve, reject) => {
      this.termedService.updateNode(concept)
        .flatMap(() => this.termedService.getConcept(this.graphId, concept.id, defaultLanguages))
        .subscribe({
          next(persistentConcept: ConceptNode) {
            that.conceptInEdit = persistentConcept;
            that.conceptAction$.next(createEditAction(persistentConcept.clone()));
            resolve();
          },
          error(err: any) {
            reject(err);
          }
        });
    });
  }

  removeConcept(): Promise<any> {
    if (!this.concept) {
      throw new Error('Cannot remove when there is no concept');
    }

    const that = this;
    const concept = this.concept;

    return new Promise((resolve, reject) => {
      this.termedService.removeNode(concept).subscribe({
        next() {
          that.conceptAction$.next(createRemoveAction(concept));
          that.router.navigate(['/concepts', that.graphId]);
          resolve();
        },
        error(err: any) {
          reject(err);
        }
      });
    });
  }

  resetConcept() {
    if (!this.concept) {
      throw new Error('Cannot reset when there is no concept');
    }

    if (!this.concept.persistent) {
      this.router.navigate(['/concepts', this.graphId]);
    } else {
      this.conceptInEdit = this.concept.clone();
    }
  }

  saveCollection(): Promise<any> {
    if (!this.collectionInEdit) {
      throw new Error('Cannot save when there is no collection');
    }

    const that = this;
    const collection = this.collectionInEdit;

    return new Promise((resolve, reject) => {
      this.termedService.updateNode(collection)
        .flatMap(() => this.termedService.getCollection(this.graphId, collection.id, defaultLanguages))
        .subscribe({
          next(persistentCollection: CollectionNode) {
            that.collectionInEdit = persistentCollection;
            that.collectionAction$.next(createEditAction(persistentCollection.clone()));
            resolve();
          },
          error(err: any) {
            reject(err);
          }
        });
    });
  }

  removeCollection(): Promise<any> {
    if (!this.collection) {
      throw new Error('Cannot remove when there is no collection');
    }

    const that = this;
    const collection = this.collection;

    return new Promise((resolve, reject) => {
      this.termedService.removeNode(collection).subscribe({
        next() {
          that.collectionAction$.next(createRemoveAction(collection));
          that.router.navigate(['/concepts', that.graphId]);
          resolve();
        },
        error(err: any) {
          reject(err);
        }
      });
    });
  }

  resetCollection() {
    if (!this.collection) {
      throw new Error('Cannot reset when there is no collection');
    }

    if (!this.collection.persistent) {
      this.router.navigate(['/concepts', this.graphId]);
    } else {
      this.collectionInEdit = this.collection.clone();
    }
  }

  saveVocabulary(): Promise<any> {

    const that = this;

    return new Promise((resolve, reject) => {
      this.termedService.updateNode(this.vocabularyInEdit)
        .flatMap(() => this.termedService.getVocabulary(this.graphId, defaultLanguages))
        .subscribe({
          next(persistentVocabulary: VocabularyNode) {
            that.vocabularyInEdit = persistentVocabulary;
            that.vocabulary = persistentVocabulary.clone();
            resolve();
          },
          error(err: any) {
            reject(err);
          }
        });
    });
  }

  removeVocabulary() {

    if (!this.vocabulary) {
      throw new Error('Cannot remove when there is no vocabulary');
    }

    const that = this;
    const vocabulary = this.vocabulary;

    return new Promise((resolve, reject) => {
      this.termedService.removeVocabulary(vocabulary).subscribe({
        next() {
          that.router.navigate(['/']);
          resolve();
        },
        error(err: any) {
          reject(err);
        }
      });
    });
  }

  resetVocabulary() {
    this.vocabularyInEdit = this.vocabulary.clone();
  }
}
