import { MessagingUserType } from '../services/messaging-api-schema';
import { MessagingResource } from './messaging-resource';
import { Localizable } from 'yti-common-ui/types/localization';

export class MessagingUser {

  id: string;
  subscriptionType: string;
  resources: MessagingResource[];

  prefLabel: Localizable;

  constructor(data: MessagingUserType) {
    this.id = data.id;
    this.subscriptionType = data.subscriptionType;
    this.resources = (data.resources || []).map(resource => new MessagingResource(resource));
  }


  serialize(): MessagingUserType {
    return {
      id: this.id,
      subscriptionType: this.subscriptionType,
      resources: this.resources.map(resource => resource.serialize())
    };
  }

  clone(): MessagingUser {
    return new MessagingUser(this.serialize());
  }
}
