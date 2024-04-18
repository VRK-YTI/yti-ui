import { ResourceType } from './resource-type.interface';
import { Type } from './type.interface';
import { UriData } from './uri.interface';

export interface ResourceReferencesResult {
  [key: string]: ResourceReference[];
}

interface ResourceReference {
  resourceURI: UriData;
  property: string;
  target: string;
  type: ResourceType;
}
