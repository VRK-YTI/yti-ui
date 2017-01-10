import { Localization } from './localization';

export interface Graph {
  code: string;
  id: string;
  permissions: any[];
  properties: {
    prefLabel: Localization[]
  }
  roles: any[];
}
