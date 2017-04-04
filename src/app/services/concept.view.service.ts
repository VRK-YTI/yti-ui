import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from './location.service';
import { TermedService } from './termed.service';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { ConceptNode, VocabularyNode } from '../entities/node';
import { comparingLocalizable } from '../utils/comparator';
import { LanguageService } from './language.service';
import { MetaModelService } from './meta-model.service';
import { TranslateService } from 'ng2-translate';
import { requireDefined } from '../utils/object';

@Injectable()
export class ConceptViewModelService {

  persistentVocabulary: VocabularyNode;
  vocabulary: VocabularyNode;
  vocabulary$ = new ReplaySubject<VocabularyNode>();

  persistentConcept: ConceptNode|null;
  concept$ = new BehaviorSubject<ConceptNode|null>(null);

  graphId: string;
  conceptId: string|null;

  topConcepts$ = new BehaviorSubject<ConceptNode[]>([]);
  allConcepts$ = new BehaviorSubject<ConceptNode[]>([]);

  languages = ['fi', 'en', 'sv'];

  loadingVocabulary = true;
  loadingConcepts = true;
  loadingConcept = true;

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

  initializeVocabulary(graphId: string) {

    this.graphId = graphId;
    this.loadingVocabulary = true;
    this.loadingConcepts = true;

    this.termedService.getVocabulary(graphId, this.languages).subscribe(vocabulary => {
      this.locationService.atVocabulary(vocabulary);
      this.persistentVocabulary = vocabulary.clone();
      this.loadingVocabulary = false;
      this.vocabulary = vocabulary;
      this.vocabulary$.next(vocabulary);
    });

    this.termedService.getConceptList(graphId, this.languages).subscribe(concepts => {
      const sortedConcepts = concepts.sort(comparingLocalizable<ConceptNode>(this.languageService, concept => concept.label));
      this.allConcepts$.next(sortedConcepts);
      this.topConcepts$.next(sortedConcepts.filter(concept => concept.broaderConcepts.length === 0));
      this.loadingConcepts = false;
    });
  }

  initializeConcept(conceptId: string|null) {

    const init = (concept: ConceptNode|null) => {
      this.vocabulary$.subscribe(vocabulary => {
        if (concept) {
          this.locationService.atConcept(vocabulary, concept);
        } else {
          this.locationService.atVocabulary(vocabulary);
        }
        this.persistentConcept = concept ? concept.clone() : null;
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

  saveConcept(): Promise<any> {
    if (!this.concept) {
      throw new Error('Cannot save when there is no concept');
    }

    const conceptId = this.concept.id;

    // TODO Error handling
    return this.termedService.updateNode(this.concept).toPromise()
      .then(() => this.termedService.getConcept(this.graphId, conceptId, this.languages).toPromise())
      .then(persistentConcept => {
        this.persistentConcept = persistentConcept;
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
      this.concept$.next(requireDefined(this.persistentConcept).clone());
    }
  }

  saveVocabulary(): Promise<any> {

    // TODO Error handling
    return this.termedService.updateNode(this.vocabulary).toPromise()
      .then(() => this.termedService.getVocabulary(this.graphId, this.languages).toPromise())
      .then(persistentVocabulary => {
        this.persistentVocabulary = persistentVocabulary;
        this.vocabulary = persistentVocabulary.clone();
      });
  }

  resetVocabulary() {
    this.vocabulary = this.persistentVocabulary.clone();
  }

  getNarrowerConcepts(concept: ConceptNode) {
    return this.termedService.getNarrowerConcepts(concept.graphId, concept.id, this.languages);
  }
}
