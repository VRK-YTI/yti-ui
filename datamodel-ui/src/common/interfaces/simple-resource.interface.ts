import { ConceptType } from './concept-interface';
import { UriData } from './uri.interface';

export interface SimpleResource {
  identifier: string;
  label: { [key: string]: string };
  note?: { [key: string]: string };
  curie: string;
  concept: ConceptType;
  modelId: string;
  uri: string;
  deactivated?: boolean;
  fromShNode?: boolean;
  version?: string;
  versionIri?: string;
  range?: UriData;
}
