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
}

export const initialClassForm: ClassFormType = {
  editorialNote: '',
  equivalentClass: [],
  identifier: '',
  label: {},
  inheritedAttributes: [],
  note: {},
  ownAttributes: [],
  subClassOf: [],
  status: 'DRAFT',
};
