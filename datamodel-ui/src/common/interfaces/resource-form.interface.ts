import { ConceptType } from './concept-interface';
import { ResourceType } from './resource-type.interface';
import { Status } from './status.interface';
import { UriData } from './uri.interface';

export interface ResourceFormType {
  allowedValues?: {
    id: string;
    label: string;
  }[];
  classType?: UriData;
  codeLists?: {
    id: string;
    prefLabel: { [key: string]: string };
    status: Status;
  }[];
  concept?: ConceptType;
  dataType?: UriData;
  defaultValue?: string;
  domain?: UriData;
  editorialNote?: string;
  equivalentResource?: UriData[];
  hasValue?: string;
  identifier: string;
  uri: string;
  label: { [key: string]: string };
  languageIn?: string[];
  maxCount?: number;
  maxExclusive?: number;
  maxInclusive?: number;
  maxLength?: number;
  minCount?: number;
  minExclusive?: number;
  minInclusive?: number;
  minLength?: number;
  note?: { [key: string]: string };
  path?: UriData;
  pattern?: string;
  range?: UriData;
  status: Status;
  subResourceOf?: UriData[];
  type: ResourceType;
  functionalProperty?: boolean;
  transitiveProperty?: boolean;
  reflexiveProperty?: boolean;
}

export const initialAssociation: ResourceFormType = {
  label: {},
  editorialNote: '',
  concept: undefined,
  status: 'DRAFT',
  equivalentResource: [],
  subResourceOf: [],
  identifier: '',
  uri: '',
  note: {},
  type: ResourceType.ASSOCIATION,
  domain: undefined,
  range: undefined,
};

export const initialAppAssociation: ResourceFormType = {
  label: {},
  identifier: '',
  uri: '',
  note: {},
  status: 'DRAFT',
  type: ResourceType.ASSOCIATION,
};

export const DEFAULT_DATA_TYPE = {
  uri: 'http://www.w3.org/2000/01/rdf-schema#Literal',
  curie: 'rdfs:Literal',
  label: { en: 'rdfs:Literal' },
};

export const initialAttribute: ResourceFormType = {
  label: {},
  editorialNote: '',
  concept: undefined,
  status: 'DRAFT',
  equivalentResource: [],
  subResourceOf: [],
  identifier: '',
  uri: '',
  note: {},
  type: ResourceType.ATTRIBUTE,
  domain: undefined,
  range: DEFAULT_DATA_TYPE,
};

export const initialAppAttribute: ResourceFormType = {
  label: {},
  identifier: '',
  uri: '',
  note: {},
  status: 'DRAFT',
  type: ResourceType.ATTRIBUTE,
  dataType: DEFAULT_DATA_TYPE,
};
