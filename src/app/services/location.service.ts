import { Injectable } from '@angular/core';
import { Localizable } from '../entities/localization';
import { Subject } from 'rxjs';
import { ConceptItem, ConceptSchemeItem } from './termed.service';

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

  atConceptScheme(conceptScheme: ConceptSchemeItem): void {
    this.changeLocation([{
      label: conceptScheme.label,
      route: ['concepts', conceptScheme.graphId]
    }]);
  }

  atConcept(conceptScheme: ConceptSchemeItem, concept: ConceptItem): void {
    this.changeLocation([
      {
        label: conceptScheme.label,
        route: ['concepts', conceptScheme.graphId]
      },
      {
        label: concept.label,
        route: ['concepts', conceptScheme.graphId, 'concept', concept.id]
      }
    ]);
  }

  atFrontPage(): void {
    this.changeLocation([]);
  }
}
