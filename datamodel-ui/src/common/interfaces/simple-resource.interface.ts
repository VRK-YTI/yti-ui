import { ConceptType } from './concept-interface';

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
}
