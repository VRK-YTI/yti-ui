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

  concept: Node<'Concept'>;
  persistentConcept: Node<'Concept'>;
  concept$ = new ReplaySubject<Node<'Concept'>>();

  topConcepts$ = new BehaviorSubject<Node<'Concept'>[]>([]);
  allConcepts$ = new BehaviorSubject<Node<'Concept'>[]>([]);

  constructor(private termedService: TermedService,
              private locationService: LocationService,
              private languageService: LanguageService) {
  }

  initializeConceptScheme(graphId: string) {

    this.termedService.getConceptScheme(graphId).subscribe(conceptScheme => {
      this.locationService.atConceptScheme(conceptScheme);
      this.conceptScheme$.next(conceptScheme);
      this.conceptScheme = conceptScheme;
      this.persistentConceptScheme = conceptScheme.clone();
    });

    this.termedService.getTopConceptList(graphId).subscribe(concepts => {
      this.topConcepts$.next(concepts.sort(comparingLocalizable<Node<'Concept'>>(this.languageService, concept => concept.label)));
    });

    this.termedService.getConceptList(graphId).subscribe(concepts => {
      this.allConcepts$.next(concepts.sort(comparingLocalizable<Node<'Concept'>>(this.languageService, concept => concept.label)));
    });
  }

  initializeConcept(conceptId: string) {

    this.conceptScheme$.subscribe(conceptScheme => {
      this.termedService.getConcept(conceptScheme.graphId, conceptId).subscribe(concept => {
        this.locationService.atConcept(conceptScheme, concept);
        this.concept$.next(concept);
        this.concept = concept;
        this.persistentConcept = concept.clone();
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
}
