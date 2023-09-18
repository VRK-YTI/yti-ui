import { ConceptType } from './concept-interface';
import { SimpleResource } from './simple-resource.interface';
import { Status } from './status.interface';
import { UriData } from './uri.interface';

export interface ClassFormType {
  editorialNote: string;
  concept?: ConceptType;
  equivalentClass?: UriData[];
  identifier: string;
  label: { [key: string]: string };
  note: { [key: string]: string };
  subClassOf?: UriData[];
  disjointWith?: UriData[];
  status: Status;
  targetClass?: UriData;
  node?: UriData;
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
  disjointWith: [],
  status: 'DRAFT',
  targetClass: undefined,
  node: undefined,
  attribute: [],
  association: [],
};
