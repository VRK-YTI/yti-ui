import { MessagingResourceType } from '../services/messaging-api-schema';
import { Localizable } from 'yti-common-ui/types/localization';
import { Localizer } from '../services/language.service';

export class MessagingResource {

  uri: string;
  application: string;
  type: string;
  prefLabel: Localizable;

  constructor(data: MessagingResourceType) {
    this.uri = data.uri;
    this.application = data.application;
    this.type = data.type;
    this.prefLabel = data.prefLabel || {};
  }

  serialize(): MessagingResourceType {
    return {
      uri: this.uri,
      application: this.application,
      type: this.type,
      prefLabel: { ...this.prefLabel }
    };
  }

  getDisplayName(localizer: Localizer, useUILanguage: boolean = false): string {
    const displayName = localizer.translate(this.prefLabel, useUILanguage);
    return displayName ? displayName : this.uri;
  }

  clone(): MessagingResource {
    return new MessagingResource(this.serialize());
  }
}
