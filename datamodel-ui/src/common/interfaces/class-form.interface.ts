import { ConceptType } from './concept-interface';
import { SimpleResource } from './simple-resource.interface';
import { Status } from './status.interface';

export interface ClassFormType {
  editorialNote: string;
  concept?: ConceptType;
  equivalentClass?: {
    label: string;
    identifier: string;
  }[];
  identifier: string;
  label: { [key: string]: string };
  note: { [key: string]: string };
  subClassOf?: {
    label: string;
    identifier: string;
  }[];
  status: Status;
  targetClass?: { label: string; id: string };
  node?: { label: string; id: string };
  attribute?: SimpleResource[];
  association?: SimpleResource[];
}

export const initialClassForm: ClassFormType = {
  editorialNote: '',
  concept: undefined,
  equivalentClass: [],
  identifier: '',
  label: {},
  note: {},
  subClassOf: [],
  status: 'DRAFT',
};
