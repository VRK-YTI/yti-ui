import { Injectable } from '@angular/core';
import { LocationService } from './location.service';
import { TermedService } from './termed.service';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { Node, Property } from '../entities/node';
import { comparingLocalizable } from '../utils/comparator';
import { LanguageService } from './language.service';
import { MetaModelService } from './meta-model.service';
import { Localization } from '../entities/localization';
import { TranslateService } from 'ng2-translate';

@Injectable()
export class ConceptViewModelService {

  persistentVocabulary: Node<'TerminologicalVocabulary'>;
  vocabulary: Node<'TerminologicalVocabulary'>;
  vocabulary$ = new ReplaySubject<Node<'TerminologicalVocabulary'>>();

  persistentConcept: Node<'Concept'>|null;
  concept$ = new BehaviorSubject<Node<'Concept'>|null>(null);

  graphId: string;
  conceptId: string|null;

  topConcepts$ = new BehaviorSubject<Node<'Concept'>[]>([]);
  allConcepts$ = new BehaviorSubject<Node<'Concept'>[]>([]);

  languages = ['fi', 'en', 'sv'];

  loadingVocabulary = true;
  loadingConcepts = true;
  loadingConcept = true;

  constructor(private termedService: TermedService,
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
      const sortedConcepts = concepts.sort(comparingLocalizable<Node<'Concept'>>(this.languageService, concept => concept.label));
      this.allConcepts$.next(sortedConcepts);
      this.topConcepts$.next(sortedConcepts.filter(concept => concept.references['broader'].empty));
      this.loadingConcepts = false;
    });
  }

  initializeConcept(conceptId: string|null) {

    const init = (concept: Node<'Concept'>|null) => {
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
          this.metaModelService.createEmptyNode(this.graphId, conceptId, 'Concept', this.languages).subscribe(concept => {

            function findTermForLanguage(terms: Node<'Term'>[], language: string): Node<'Term'>|undefined {
              return terms.find(term => {
                const label: Property = term.properties['prefLabel'];
                const localizations = label.value as Localization[];
                return localizations[0].lang === language;
              });
            }

            function setTermValue(value: string, language: string) {
              const terms: Node<'Term'>[] = concept.references['prefLabelXl'].values;
              const matchingTerm: Node<'Term'> = findTermForLanguage(terms, language) || terms[0];
              const label: Property = matchingTerm.properties['prefLabel'];
              const localizations = label.value as Localization[];
              localizations[0].value = value;
            }

            concept.references['inScheme'].values.push(vocabulary.clone());

            this.translateService.get('New concept').subscribe(newConceptLabel => {
              setTermValue(newConceptLabel, this.languageService.language);
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

  resetConcept() {
    if (!this.concept) {
      throw new Error('Cannot reset when there is no concept');
    }

    if (this.persistentConcept) {
      this.concept$.next(this.persistentConcept.clone());
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

  getNarrowerConcepts(concept: Node<'Concept'>) {
    return this.termedService.getNarrowerConcepts(concept.graphId, concept.id, this.languages);
  }
}
