import { ConceptType } from './concept-interface';
import { Status } from './status.interface';

export interface ClassFormType {
  editorialNote: string;
  concept?: ConceptType;
  equivalentClass: {
    label: { [key: string]: string };
    identifier: string;
  }[];
  identifier: string;
  label: { [key: string]: string };
  inheritedAttributes: string[];
  note: { [key: string]: string };
  ownAttributes: string[];
  subClassOf: {
    label: string;
    identifier: string;
    attributes: string[];
  }[];
  status: Status;
  targetClass?: { label: string; id: string };
}

export const initialClassForm: ClassFormType = {
  editorialNote: '',
  concept: undefined,
  equivalentClass: [],
  identifier: '',
  label: {},
  inheritedAttributes: [],
  note: {},
  ownAttributes: [],
  subClassOf: [],
  status: 'DRAFT',
};
