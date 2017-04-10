import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from './location.service';
import { TermedService } from './termed.service';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { CollectionNode, ConceptNode, VocabularyNode } from '../entities/node';
import { comparingLocalizable } from '../utils/comparator';
import { LanguageService } from './language.service';
import { MetaModelService } from './meta-model.service';

@Injectable()
export class ConceptViewModelService {

  vocabularyInEdit: VocabularyNode;
  vocabulary: VocabularyNode;
  vocabulary$ = new ReplaySubject<VocabularyNode>();

  conceptInEdit: ConceptNode|null;
  concept$ = new BehaviorSubject<ConceptNode|null>(null);

  collectionInEdit: CollectionNode|null;
  collection$ = new BehaviorSubject(<CollectionNode|null>(null));

  selection$: Observable<ConceptNode|CollectionNode|null> = Observable.merge(this.concept$, this.collection$);

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
  }

  get concept() {
    return this.concept$.getValue();
  }

  get collection() {
    return this.collection$.getValue();
  }

  get selection() {
    return this.concept || this.collection;
  }

  initializeVocabulary(graphId: string) {

    this.graphId = graphId;
    this.loadingVocabulary = true;
    this.loadingConcepts = true;

    this.termedService.getVocabulary(graphId, this.languages).subscribe(vocabulary => {
      this.locationService.atVocabulary(vocabulary);
      this.vocabularyInEdit = vocabulary.clone();
      this.vocabulary = vocabulary;
      this.vocabulary$.next(vocabulary);
      this.loadingVocabulary = false;
    });

    this.termedService.getConceptList(graphId, this.languages).subscribe(concepts => {
      const sortedConcepts = concepts.sort(comparingLocalizable<ConceptNode>(this.languageService, concept => concept.label));
      this.allConcepts$.next(sortedConcepts);
      this.topConcepts$.next(sortedConcepts.filter(concept => concept.broaderConcepts.empty));
      this.loadingConcepts = false;
    });

    this.termedService.getCollectionList(graphId, this.languages).subscribe(collections => {
      const sortedCollections = collections.sort(comparingLocalizable<CollectionNode>(this.languageService, collection => collection.label));
      this.allCollections$.next(sortedCollections);
      this.loadingCollections = false;
    });
  }

  initializeConcept(conceptId: string|null) {

    const init = (concept: ConceptNode|null) => {

      if (this.collection) {
        this.initializeCollection(null);
      }

      this.vocabulary$.subscribe(vocabulary => {
        if (concept) {
          this.locationService.atConcept(vocabulary, concept);
        } else {
          this.locationService.atVocabulary(vocabulary);
        }
        this.conceptInEdit = concept ? concept.clone() : null;
        this.concept$.next(concept);
        this.loadingConcept = false;
      });
    };

    this.loadingConcept = true;
    this.conceptId = conceptId;

    if (!conceptId) {
      init(null);
    } else {
      this.vocabulary$.subscribe(vocabulary => {
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

      this.vocabulary$.subscribe(vocabulary => {
        if (collection) {
          this.locationService.atCollection(vocabulary, collection);
        } else {
          this.locationService.atVocabulary(vocabulary);
        }
        this.collectionInEdit = collection ? collection.clone() : null;
        this.collection$.next(collection);
        this.loadingCollection = false;
      });
    };

    this.loadingCollection = true;
    this.collectionId = collectionId;

    if (!collectionId) {
      init(null);
    } else {
      this.vocabulary$.subscribe(vocabulary => {
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
          this.concept$.next(persistentConcept.clone());
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
          this.collection$.next(persistentCollection.clone());
          resolve();
        });
    });
  }

  removeCollection(): Promise<any> {
    if (!this.collection) {
      throw new Error('Cannot remove when there is no collection');
    }

    // TODO Error handling
    return this.termedService.removeNode(this.collection).toPromise()
      .then(() => this.router.navigate(['/concepts', this.graphId]));
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
