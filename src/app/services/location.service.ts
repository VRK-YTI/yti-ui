import { Injectable, OnDestroy } from '@angular/core';
import { Location } from 'yti-common-ui/types/location';
import { Subject, Subscription } from 'rxjs';
import { CollectionNode, ConceptNode, VocabularyNode } from 'app/entities/node';
import { TranslateService } from '@ngx-translate/core';
import { ConfigurationService } from './configuration.service';
import { Title } from '@angular/platform-browser';

const frontPage = { localizationKey: 'Front page', route: [''] };

@Injectable()
export class LocationService implements OnDestroy {

  location = new Subject<Location[]>();
  showFooter = new Subject<boolean>();
  private titleTranslationSubscription: Subscription;

  constructor(private translateService: TranslateService, private configurationService: ConfigurationService, private titleService: Title) {
    this.titleTranslationSubscription = this.translateService.stream('Controlled Vocabularies').subscribe(value => {
      this.titleService.setTitle(this.configurationService.getEnvironmentIdentifier('prefix') + value);
    })
  }

  ngOnDestroy() {
    this.titleTranslationSubscription.unsubscribe();
  }

  atVocabulary(vocabulary: VocabularyNode): void {
    this.changeLocation([{
      label: vocabulary.label,
      route: ['concepts', vocabulary.graphId]
    }], false);
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
    ], false);
  }

  atCollection(vocabulary: VocabularyNode, collection: CollectionNode): void {
    this.changeLocation([
      {
        label: vocabulary.label,
        route: ['concepts', vocabulary.graphId]
      },
      {
        label: collection.label,
        route: ['concepts', vocabulary.graphId, 'collection', collection.id]
      }
    ], false);
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
      localizationKey: 'Information about the service',
      route: ['information']
    }]);
  }

  private changeLocation(location: Location[], showFooter: boolean = true): void {
    location.unshift(frontPage);
    this.location.next(location);
    this.showFooter.next(showFooter);
  }
}
