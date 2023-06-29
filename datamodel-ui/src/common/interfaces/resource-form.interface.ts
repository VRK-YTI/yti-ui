import { ConceptType } from './concept-interface';
import { ResourceType } from './resource-type.interface';
import { Status } from './status.interface';

export interface ResourceFormType {
  allowedValues?: string[];
  classType?: string;
  concept?: ConceptType;
  dataType?: string;
  defaultValue?: string;
  domain?: {
    id: string;
    label: string;
  };
  editorialNote?: string;
  equivalentResource?: {
    label: { [key: string]: string };
    identifier: string;
  }[];
  hasValue?: string;
  identifier: string;
  label: { [key: string]: string };
  maxCount?: number;
  maxLength?: number;
  minCount?: number;
  minLength?: number;
  note: { [key: string]: string };
  path?: string;
  range?: {
    id: string;
    label: string;
  };
  status: Status;
  subResourceOf?: string[];
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
