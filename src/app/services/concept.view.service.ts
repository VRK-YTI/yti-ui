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
  Action, createEditAction, createNoSelection, createRemoveAction, createSelectAction, isSelect,
  SelectAction
} from './action';

function onlySelect<T>(action: Observable<Action<T>>): Observable<T> {
  const selectAction: Observable<SelectAction<T>> = action.filter(isSelect);
  return selectAction.map(action => action.item);
}

@Injectable()
export class ConceptViewModelService {

  vocabularyInEdit: VocabularyNode;
  vocabulary: VocabularyNode;
  vocabulary$ = new BehaviorSubject<Action<VocabularyNode>>(createNoSelection());
  vocabularySelect$ = onlySelect(this.vocabulary$);

  conceptInEdit: ConceptNode|null;
  concept$ = new BehaviorSubject<Action<ConceptNode>>(createNoSelection());
  conceptSelect$ = onlySelect(this.concept$);

  collectionInEdit: CollectionNode|null;
  collection$ = new BehaviorSubject<Action<CollectionNode>>(createNoSelection());
  collectionSelect$ = onlySelect(this.collection$);

  selection$: Observable<ConceptNode|CollectionNode> = Observable.merge(this.conceptSelect$, this.collectionSelect$);

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

    this.concept$.subscribe(action => {
      switch (action.type) {
        case 'edit':
        case 'remove':
          this.initializeConceptList(this.graphId);
      }
    });

    this.collection$.subscribe(action => {
      switch (action.type) {
        case 'edit':
        case 'remove':
          this.initializeCollectionList(this.graphId);
      }
    });
  }

  get concept(): ConceptNode|null {

    const action = this.concept$.getValue();

    if (action.type === 'noselect' || action.type === 'remove') {
      return null;
    }

    return action.item;
  }

  get collection(): CollectionNode|null {

    const action = this.collection$.getValue();

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
        this.concept$.next(concept ? createSelectAction(concept) : createNoSelection());
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
        this.collection$.next(collection ? createSelectAction(collection) : createNoSelection());
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
          this.concept$.next(createEditAction(persistentConcept.clone()));
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
        this.concept$.next(createRemoveAction(concept));
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
          this.collection$.next(createEditAction(persistentCollection.clone()));
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
        this.collection$.next(createRemoveAction(collection));
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
