import { Injectable } from '@angular/core';
import { ConceptScheme } from '../entities/conceptScheme';
import { asLocalizable, Localizable } from '../entities/localization';
import { Subject } from 'rxjs';
import { ConceptItem } from './termed.service';

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

  atConceptScheme(conceptScheme: ConceptScheme): void {
    this.changeLocation([{
      label: asLocalizable(conceptScheme.properties.prefLabel),
      route: ['concepts', conceptScheme.type.graph.id]
    }]);
  }

  atConcept(conceptScheme: ConceptScheme, concept: ConceptItem): void {
    this.changeLocation([
      {
        label: asLocalizable(conceptScheme.properties.prefLabel),
        route: ['concepts', conceptScheme.type.graph.id]
      },
      {
        label: concept.label,
        route: ['concepts', conceptScheme.type.graph.id, 'concept', concept.id]
      }
    ]);
  }

  atFrontPage(): void {
    this.changeLocation([]);
  }
}
