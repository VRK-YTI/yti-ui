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

  topConcepts$ = new BehaviorSubject<ConceptNode[]>([]);
  allConcepts$ = new BehaviorSubject<ConceptNode[]>([]);
  allCollections$ = new BehaviorSubject(<CollectionNode[]>([]));

  languages = ['fi', 'en', 'sv'];

  loadingVocabulary = true;
  loadingConcepts = true;
  loadingConcept = true;
  loadingCollections = true;
  loadingCollection = true;

  constructor(private router: Router,
              private termedService: TermedService,
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
    this.termedService.getConceptList(graphId, this.languages).subscribe(concepts => {
      const sortedConcepts = concepts.sort(comparingLocalizable<ConceptNode>(this.languageService, concept => concept.label));
      this.allConcepts$.next(sortedConcepts);
      this.topConcepts$.next(sortedConcepts.filter(concept => concept.broaderConcepts.empty));
      this.loadingConcepts = false;
    });
  }

  initializeCollectionList(graphId: string) {
    this.termedService.getCollectionList(graphId, this.languages).subscribe(collections => {
      const sortedCollections = collections.sort(comparingLocalizable<CollectionNode>(this.languageService, collection => collection.label));
      this.allCollections$.next(sortedCollections);
      this.loadingCollections = false;
    });
  }

  initializeVocabulary(graphId: string) {

    this.graphId = graphId;
    this.loadingVocabulary = true;
    this.loadingConcepts = true;

    this.termedService.getVocabulary(graphId, this.languages).subscribe(vocabulary => {
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
        this.termedService.getConcept(vocabulary.graphId, conceptId, this.languages).subscribe(init, () => {
          this.metaModelService.createEmptyConcept(this.vocabulary, conceptId).subscribe(init);
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
        this.termedService.getCollection(vocabulary.graphId, collectionId, this.languages).subscribe(init, () => {
          this.metaModelService.createEmptyCollection(this.vocabulary, collectionId).subscribe(init);
        });
      });
    }
  }

  saveConcept(): Promise<any> {
    if (!this.conceptInEdit) {
      throw new Error('Cannot save when there is no concept');
    }

    const concept = this.conceptInEdit;

    // TODO Error handling
    return new Promise(resolve => {
      this.termedService.updateNode(concept)
        .flatMap(() => this.termedService.getConcept(this.graphId, concept.id, this.languages))
        .subscribe(persistentConcept => {
          this.conceptInEdit = persistentConcept;
          this.conceptAction$.next(createEditAction(persistentConcept.clone()));
          resolve();
        });
    });
  }

  removeConcept(): Promise<any> {
    if (!this.concept) {
      throw new Error('Cannot remove when there is no concept');
    }

    const concept = this.concept;

    // TODO Error handling
    return new Promise(resolve => {
      this.termedService.removeNode(concept).subscribe(() => {
        this.conceptAction$.next(createRemoveAction(concept));
        this.router.navigate(['/concepts', this.graphId]);
        resolve();
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

    const collection = this.collectionInEdit;

    // TODO Error handling
    return new Promise(resolve => {
      this.termedService.updateNode(collection)
        .flatMap(() => this.termedService.getCollection(this.graphId, collection.id, this.languages))
        .subscribe(persistentCollection => {
          this.collectionInEdit = persistentCollection;
          this.collectionAction$.next(createEditAction(persistentCollection.clone()));
          resolve();
        });
    });
  }

  removeCollection(): Promise<any> {
    if (!this.collection) {
      throw new Error('Cannot remove when there is no collection');
    }

    const collection = this.collection;

    // TODO Error handling
    return new Promise(resolve => {
      this.termedService.removeNode(collection).subscribe(() => {
        this.collectionAction$.next(createRemoveAction(collection));
        this.router.navigate(['/concepts', this.graphId])
        resolve();
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

    // TODO Error handling
    return new Promise(resolve => {
      this.termedService.updateNode(this.vocabularyInEdit)
        .flatMap(() => this.termedService.getVocabulary(this.graphId, this.languages))
        .subscribe(persistentVocabulary => {
          this.vocabularyInEdit = persistentVocabulary;
          this.vocabulary = persistentVocabulary.clone();
          resolve();
        });
    });
  }

  resetVocabulary() {
    this.vocabularyInEdit = this.vocabulary.clone();
  }

  getNarrowerConcepts(concept: ConceptNode) {
    return this.termedService.getNarrowerConcepts(concept.graphId, concept.id, this.languages);
  }
}
