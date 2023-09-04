export interface Subscription {
  application?: string;
  action: string;
  type: string;
  uri: string;
}

export interface Subscriptions {
  id: string;
  resources: Resource[];
  subscriptionType: 'DAILY' | 'DISABLED';
}

export interface Resource {
  application: string;
  prefLabel?: {
    [value: string]: string;
  };
  type: string;
  uri: string;
}
