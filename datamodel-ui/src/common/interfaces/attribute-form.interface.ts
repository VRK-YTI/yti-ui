import { ConceptType } from './concept-interface';
import { ResourceType } from './resource-type.interface';
import { Status } from './status.interface';

export interface AttributeFormType {
  label: { [key: string]: string };
  editorialNote?: string;
  concept?: ConceptType;
  status: Status;
  equivalentResource: {
    label: { [key: string]: string };
    identifier: string;
  }[];
  subResourceOf: string[];
  identifier: string;
  note: { [key: string]: string };
  type: ResourceType;
  domain?: {
    id: string;
    label: string;
  };
  range?: {
    id: string;
    label: string;
  };
}

export const initialAttribute: AttributeFormType = {
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
