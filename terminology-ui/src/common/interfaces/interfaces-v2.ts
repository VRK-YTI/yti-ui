import { Group } from 'yti-common-ui/interfaces/group.interface';
import { Organization } from 'yti-common-ui/interfaces/organization.interface';
import { Status } from 'yti-common-ui/interfaces/status.interface';

export interface Terminology {
  uri: string;
  label: LocalizedValue;
  description: LocalizedValue;
  prefix: string;
  type: TerminologyType;
  status: Status;
  languages: string[];
  contact: string;
  groups: Group[];
  organizations: Organization[];
  created: string;
  modified: string;
  creator: { id: string; name: string };
  modifier: { id: string; name: string };
  origin: string;
}
/* build fails for empty interfaces

export interface TerminologyInfo {}

export interface Concept {}

export interface ConceptInfo {}

export interface Term {}

export interface ConceptCollection {}

export interface ConceptCollectionInfo {}

export interface ConceptReferenceInfo {}
*/

export interface SearchRequest {
  query: string;
  sortLang: string;
  status: Status[];
  pageSize: number;
  pageFrom: number;
}

export interface TerminologySearchRequest extends SearchRequest {
  searchconcepts: boolean;
  groups: string[];
  organizations: string[];
  languages: string[];
}

export interface ConceptSearchRequest extends SearchRequest {
  namespace: string;
}

export interface ResponseObject {
  uri: string;
  id: string;
  label: LocalizedValue;
  status: Status;
}

export interface TerminogyResponseObject extends ResponseObject {
  prefix: string;
  description: LocalizedValue;
  type: TerminologyType;
  organizations: string[];
  groups: string[];
  matchingConcepts: ConceptResponseObject[];
}

export interface ConceptResponseObject extends ResponseObject {
  definition: LocalizedValue;
  identifier: string;
}

export interface SearchResponse<T extends ResponseObject> {
  totalHitCount: number;
  pageSize: number;
  pageFrom: number;
  responseObjects: T[];
}

export interface LocalizedValue {
  [key: string]: string;
}

export enum TerminologyType {
  TERMINOLOGICAL_VOCABULARY = 'TERMINOLOGICAL_VOCABULARY',
  OTHER_VOCABULARY = 'OTHER_VOCABULARY',
}
