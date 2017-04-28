import { Localization } from './localization';

export interface Graph {

  code: string;
  id: string;
  permissions: {};
  properties: {
    prefLabel: Localization[],
    type?: [{lang: '', value: 'Metamodel'}]
  }
  roles: any[];
}
