import { Localizable } from 'yti-common-ui/types/localization';

export interface MessagingUserType {
  id: string;
  subscriptionType: string;
  resources?: MessagingResourceType[];
}

export interface MessagingResourceType {
  uri: string;
  application: string;
  type: string;
  prefLabel: Localizable;
}
