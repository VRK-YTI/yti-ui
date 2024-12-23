import { Group } from 'yti-common-ui/interfaces/group.interface';
import { Organization } from 'yti-common-ui/interfaces/organization.interface';
import { Status } from 'yti-common-ui/interfaces/status.interface';

export interface Terminology {
  label: LocalizedValue;
  description: LocalizedValue;
  status: Status;
  organizations: string[];
  groups: string[];
  contact: string;
  prefix: string;
  graphType: TerminologyType;
  languages: string[];
}

export interface TerminologyInfo {
  uri: string;
  label: LocalizedValue;
  description: LocalizedValue;
  prefix: string;
  graphType: TerminologyType;
  status: Status;
  languages: string[];
  contact: string;
  groups: Group[];
  organizations: Organization[];
  created: string;
  modified: string;
  creator: UserMeta;
  modifier: UserMeta;
  origin?: string;
}

export interface Concept {
  identifier?: string;
  definition: LocalizedValue;
  notes: LocalizedListItem[];
  examples: LocalizedListItem[];
  subjectArea: string;
  status: Status;
  sources: string[];
  links: {
    name: LocalizedValue;
    uri: string;
    description: LocalizedValue;
  }[];
  changeNote: string;
  historyNote: string;
  conceptClass: string;
  editorialNotes: string[];
  recommendedTerms: Term[];
  synonyms: Term[];
  notRecommendedTerms: Term[];
  searchTerms: Term[];
  broader: string[];
  narrower: string[];
  isPartOf: string[];
  hasPart: string[];
  related: string[];
  broadMatch: string[];
  narrowMatch: string[];
  exactMatch: string[];
  closeMatch: string[];
  relatedMatch: string[];
}

export interface ConceptInfo {
  identifier: string;
  uri: string;
  label?: LocalizedValue;
  created: string;
  modified: string;
  creator: UserMeta;
  modifier: UserMeta;
  definition: LocalizedValue;
  notes: LocalizedListItem[];
  examples: LocalizedListItem[];
  subjectArea: string;
  status: Status;
  sources: string[];
  links: {
    name: LocalizedValue;
    uri: string;
    description: LocalizedValue;
  }[];
  changeNote: string;
  historyNote: string;
  conceptClass: string;
  editorialNotes: string[];
  recommendedTerms: Term[];
  synonyms: Term[];
  notRecommendedTerms: Term[];
  searchTerms: Term[];
  broader: ConceptReferenceInfo[];
  narrower: ConceptReferenceInfo[];
  isPartOf: ConceptReferenceInfo[];
  hasPart: ConceptReferenceInfo[];
  related: ConceptReferenceInfo[];
  broadMatch: ConceptReferenceInfo[];
  narrowMatch: ConceptReferenceInfo[];
  exactMatch: ConceptReferenceInfo[];
  closeMatch: ConceptReferenceInfo[];
  relatedMatch: ConceptReferenceInfo[];
  memberOf: ConceptReferenceInfo[];
}

export interface Term {
  language: string;
  label?: string;
  homographNumber?: number;
  status?: Status;
  termInfo?: string;
  scope?: string;
  historyNote?: string;
  changeNote?: string;
  termStyle?: string;
  termFamily?: string;
  termConjugation?: string;
  termEquivalency?: string;
  wordClass?: string;
  sources?: string[];
  editorialNotes?: string[];
}

export interface ConceptReferenceInfo {
  identifier: string;
  referenceURI: string;
  prefix: string;
  label: LocalizedValue;
  terminologyLabel: LocalizedValue;
}

export interface ConceptCollectionInfo {
  uri: string;
  identifier: string;
  label: LocalizedValue;
  description: LocalizedValue;
  members: ConceptReferenceInfo[];
  created: string;
  modified: string;
  creator: UserMeta;
  modifier: UserMeta;
}

export interface ConceptCollection {
  identifier: string;
  label: LocalizedValue;
  description: LocalizedValue;
  members: string[];
}

export interface SearchRequest {
  query?: string;
  sortLang?: string;
  status?: Status[] | string[];
  pageSize?: number;
  pageFrom?: number;
}

export interface TerminologySearchRequest extends SearchRequest {
  searchConcepts: boolean;
  groups: string[];
  organizations: string[];
  languages: string[];
}

export interface ConceptSearchRequest extends SearchRequest {
  namespace?: string;
  excludeNamespace?: string;
  extendTerminologies?: boolean;
}

export interface ResponseObject {
  uri: string;
  id: string;
  label: LocalizedValue;
  status: Status;
  created: string;
  modified: string;
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
  terminology: {
    prefix: string;
    label: LocalizedValue;
  };
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

export interface LocalizedListItem {
  language: string;
  value: string;
}

export interface UserMeta {
  id: string;
  name?: string;
}

export enum TerminologyType {
  TERMINOLOGICAL_VOCABULARY = 'TERMINOLOGICAL_VOCABULARY',
  OTHER_VOCABULARY = 'OTHER_VOCABULARY',
}
