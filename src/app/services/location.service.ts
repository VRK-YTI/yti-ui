import { Injectable } from '@angular/core';
import { Location } from 'yti-common-ui/types/location';
import { Subject } from 'rxjs';
import { CollectionNode, ConceptNode, VocabularyNode } from 'app/entities/node';

const frontPage = { localizationKey: 'Front page', route: [''] };

@Injectable()
export class LocationService {

  location = new Subject<Location[]>();

  private changeLocation(location: Location[]): void {
    location.unshift(frontPage);
    this.location.next(location);
  }

  atVocabulary(vocabulary: VocabularyNode): void {
    this.changeLocation([{
      label: vocabulary.label,
      route: ['concepts', vocabulary.graphId]
    }]);
  }

  atConcept(vocabulary: VocabularyNode, concept: ConceptNode): void {
    this.changeLocation([
      {
        label: vocabulary.label,
        route: ['concepts', vocabulary.graphId]
      },
      {
        label: concept.label,
        route: ['concepts', vocabulary.graphId, 'concept', concept.id]
      }
    ]);
  }

  atCollection(vocabulary: VocabularyNode, collection: CollectionNode): void {
    this.changeLocation([
      {
        label: vocabulary.label,
        route: ['concepts', vocabulary.graphId]
      },
      {
        label: collection.label,
        route: ['concepts', vocabulary.graphId, 'concept', collection.id]
      }
    ]);
  }

  atFrontPage(): void {
    this.changeLocation([]);
  }

  atUserDetails(): void {
    this.changeLocation([{
      localizationKey: 'User details',
      route: ['userDetails']
    }]);
  }

  atNewVocabulary() {
    this.changeLocation([{
      localizationKey: 'New vocabulary',
      route: ['newVocabulary']
    }]);
  }
  
  atInformationAboutService(): void {
    this.changeLocation([{
      localizationKey: 'Information about the web service',
      route: ['information']
    }]);
  }
}
