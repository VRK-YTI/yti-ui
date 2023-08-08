import { ConceptType } from './concept-interface';
import { ResourceType } from './resource-type.interface';
import { Status } from './status.interface';

export interface ResourceFormType {
  allowedValues?: string[];
  classType?: string;
  codeList?: {
    id: string;
    label: { [key: string]: string };
  }[];
  concept?: ConceptType;
  dataType?: {
    id: string;
    label: string;
  };
  defaultValue?: string;
  domain?: {
    id: string;
    label: string;
  };
  editorialNote?: string;
  equivalentResource?: {
    label: string;
    uri: string;
  }[];
  hasValue?: string;
  identifier: string;
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
  path?: {
    id: string;
    label: string;
    uri: string;
  };
  pattern?: string;
  range?: {
    id: string;
    label: string;
  };
  status: Status;
  subResourceOf?: {
    label: string;
    uri: string;
  }[];
  type: ResourceType;
}

export const initialAssociation: ResourceFormType = {
  label: {},
  editorialNote: '',
  concept: undefined,
  status: 'DRAFT',
  equivalentResource: [],
  subResourceOf: [],
  identifier: '',
  note: {},
  type: ResourceType.ASSOCIATION,
  domain: undefined,
  range: undefined,
};

export const initialAppAssociation: ResourceFormType = {
  label: {},
  identifier: '',
  note: {},
  status: 'DRAFT',
  type: ResourceType.ASSOCIATION,
};

export const initialAttribute: ResourceFormType = {
  label: {},
  editorialNote: '',
  concept: undefined,
  status: 'DRAFT',
  equivalentResource: [],
  subResourceOf: [],
  identifier: '',
  note: {},
  type: ResourceType.ATTRIBUTE,
  domain: undefined,
  range: { id: 'rdfs:Literal', label: 'rdfs:Literal' },
};

export const initialAppAttribute: ResourceFormType = {
  label: {},
  identifier: '',
  note: {},
  status: 'DRAFT',
  type: ResourceType.ATTRIBUTE,
  dataType: { id: 'rdfs:Literal', label: 'rdfs:Literal' },
};
