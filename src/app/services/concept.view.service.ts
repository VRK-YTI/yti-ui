import { Injectable } from '@angular/core';
import { LocationService } from './location.service';
import { TermedService } from './termed.service';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { Node } from '../entities/node';
import { comparingLocalizable } from '../utils/comparator';
import { LanguageService } from './language.service';

@Injectable()
export class ConceptViewModelService {

  conceptScheme: Node<'TerminologicalVocabulary'>;
  persistentConceptScheme: Node<'TerminologicalVocabulary'>;
  conceptScheme$ = new ReplaySubject<Node<'TerminologicalVocabulary'>>();

  conceptId: string;
  concept: Node<'Concept'>;
  persistentConcept: Node<'Concept'>;
  concept$ = new ReplaySubject<Node<'Concept'>>();

  topConcepts$ = new BehaviorSubject<Node<'Concept'>[]>([]);
  allConcepts$ = new BehaviorSubject<Node<'Concept'>[]>([]);

  languages = ['fi', 'en', 'sv'];

  loadingConceptScheme = true;
  loadingConcepts = true;
  loadingConcept = true;

  constructor(private termedService: TermedService,
              private locationService: LocationService,
              private languageService: LanguageService) {
  }

  initializeConceptScheme(graphId: string) {

    this.loadingConceptScheme = true;
    this.loadingConcepts = true;

    this.termedService.getConceptScheme(graphId, this.languages).subscribe(conceptScheme => {
      this.locationService.atConceptScheme(conceptScheme);
      this.conceptScheme$.next(conceptScheme);
      this.conceptScheme = conceptScheme;
      this.persistentConceptScheme = conceptScheme.clone();
      this.loadingConceptScheme = false;
    });

    this.termedService.getConceptList(graphId, this.languages).subscribe(concepts => {
      const sortedConcepts = concepts.sort(comparingLocalizable<Node<'Concept'>>(this.languageService, concept => concept.label));
      this.allConcepts$.next(sortedConcepts);
      this.topConcepts$.next(sortedConcepts.filter(concept => concept.references['broader'].empty));
      this.loadingConcepts = false;
    });
  }

  initializeConcept(conceptId: string) {

    this.loadingConcept = true;
    this.conceptId = conceptId;

    this.conceptScheme$.subscribe(conceptScheme => {
      this.termedService.getConcept(conceptScheme.graphId, conceptId, this.languages).subscribe(concept => {
        this.locationService.atConcept(conceptScheme, concept);
        this.concept$.next(concept);
        this.concept = concept;
        this.persistentConcept = concept.clone();
        this.loadingConcept = false;
      });
    });
  }

  saveConcept() {
    this.termedService.updateNode(this.concept);
    this.persistentConcept = this.concept.clone();
  }

  resetConcept() {
    this.concept = this.persistentConcept.clone();
  }

  saveConceptScheme() {
    this.termedService.updateNode(this.conceptScheme);
    this.persistentConceptScheme = this.conceptScheme.clone();
  }

  resetConceptScheme() {
    this.conceptScheme = this.persistentConceptScheme.clone();
  }

  getNarrowerConcepts(concept: Node<'Concept'>) {
    return this.termedService.getNarrowerConcepts(concept.graphId, concept.id, this.languages);
  }
}
