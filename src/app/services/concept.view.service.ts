import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from './location.service';
import { TermedService } from './termed.service';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { CollectionNode, ConceptNode, VocabularyNode } from '../entities/node';
import { comparingLocalizable } from '../utils/comparator';
import { LanguageService } from './language.service';
import { MetaModelService } from './meta-model.service';
import { TranslateService } from 'ng2-translate';

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
              private languageService: LanguageService,
              private translateService: TranslateService) {
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
      this.topConcepts$.next(sortedConcepts.filter(concept => concept.broaderConcepts.length === 0));
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
          this.metaModelService.createEmptyNode(this.graphId, conceptId, 'Concept', this.languages).subscribe((concept: ConceptNode) => {

            concept.vocabulary = vocabulary.clone();

            this.translateService.get('New concept').subscribe(newConceptLabel => {
              const matchingTerm = concept.findTermForLanguage(this.languageService.language) || concept.terms[0];
              matchingTerm.value = newConceptLabel;
              init(concept);
            });
          });
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
          this.metaModelService.createEmptyNode(this.graphId, collectionId, 'Collection', this.languages).subscribe((collection: CollectionNode) => {
            this.translateService.get('New collection').subscribe(newCollectionLabel => {

              const matchingLocalization = collection.findLocalizationForLanguage(this.languageService.language) || collection.anyLocalization();
              matchingLocalization.value = newCollectionLabel;
              init(collection);
            });
          });
        });
      });
    }
  }

  saveConcept(): Promise<any> {
    if (!this.conceptInEdit) {
      throw new Error('Cannot save when there is no concept');
    }

    const conceptId = this.conceptInEdit.id;

    // TODO Error handling
    return this.termedService.updateNode(this.conceptInEdit).toPromise()
      .then(() => this.termedService.getConcept(this.graphId, conceptId, this.languages).toPromise())
      .then(persistentConcept => {
        this.conceptInEdit = persistentConcept;
        this.concept$.next(persistentConcept.clone());
      });
  }

  removeConcept(): Promise<any> {
    if (!this.concept) {
      throw new Error('Cannot remove when there is no concept');
    }

    // TODO Error handling
    return this.termedService.removeNode(this.concept).toPromise()
      .then(() => this.router.navigate(['/concepts', this.graphId]));
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

    const collectionId = this.collectionInEdit.id;

    // TODO Error handling
    return this.termedService.updateNode(this.collectionInEdit).toPromise()
      .then(() => this.termedService.getCollection(this.graphId, collectionId, this.languages).toPromise())
      .then(persistentCollection => {
        this.collectionInEdit = persistentCollection;
        this.collection$.next(persistentCollection.clone());
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
    return this.termedService.updateNode(this.vocabularyInEdit).toPromise()
      .then(() => this.termedService.getVocabulary(this.graphId, this.languages).toPromise())
      .then(persistentVocabulary => {
        this.vocabularyInEdit = persistentVocabulary;
        this.vocabulary = persistentVocabulary.clone();
      });
  }

  resetVocabulary() {
    this.vocabularyInEdit = this.vocabulary.clone();
  }

  getNarrowerConcepts(concept: ConceptNode) {
    return this.termedService.getNarrowerConcepts(concept.graphId, concept.id, this.languages);
  }
}
