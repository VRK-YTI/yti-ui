import { Injectable } from '@angular/core';
import { Localizable } from '../entities/localization';
import { Subject } from 'rxjs';
import { Node } from '../entities/node';

export interface Location {
  localizationKey?: string;
  label?: Localizable;
  route?: string[];
}

const frontPage = { localizationKey: 'Front page', route: [''] };

@Injectable()
export class LocationService {

  location = new Subject<Location[]>();

  private changeLocation(location: Location[]): void {
    location.unshift(frontPage);
    this.location.next(location);
  }

  atConceptScheme(conceptScheme: Node<'TerminologicalVocabulary'>): void {
    this.changeLocation([{
      label: conceptScheme.label,
      route: ['concepts', conceptScheme.graphId]
    }]);
  }

  atRootConcept(conceptScheme: Node<'TerminologicalVocabulary'>, rootConcept: Node<'Concept'>): void {
    this.changeLocation([
      {
        label: conceptScheme.label,
        route: ['concepts', conceptScheme.graphId]
      },
      {
        label: rootConcept.label,
        route: ['concepts', conceptScheme.graphId, 'rootConcept', rootConcept.id]
      }
    ]);
  }

  atConcept(conceptScheme: Node<'TerminologicalVocabulary'>, rootConcept: Node<'Concept'>, concept: Node<'Concept'>): void {
    this.changeLocation([
      {
        label: conceptScheme.label,
        route: ['concepts', conceptScheme.graphId]
      },
      {
        label: rootConcept.label,
        route: ['concepts', conceptScheme.graphId, 'rootConcept', rootConcept.id]
      },
      {
        label: concept.label,
        route: ['concepts', conceptScheme.graphId, 'rootConcept', rootConcept.id, 'concept', concept.id]
      }
    ]);
  }

  atFrontPage(): void {
    this.changeLocation([]);
  }
}
