import { Localization } from 'yti-common-ui/types/localization';

export interface Graph {

  code: string;
  id: string;
  uri: string;
  permissions: {};
  properties: {
    prefLabel: Localization[],
    type?: [{lang: '', value: 'Metamodel'}]
  }
  roles: any[];
}
