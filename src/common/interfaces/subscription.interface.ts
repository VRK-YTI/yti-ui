export interface Subscription {
  application?: string;
  action: string;
  type: string;
  uri: string;
}

export interface Subscriptions {
  id: string;
  resources: {
    application: 'string';
    prefLabel: {
      [value: string]: string;
    };
    type: 'string';
    uri: 'string';
  }[];
  subscriptionType: 'DAILY' | 'DISABLED';
}
