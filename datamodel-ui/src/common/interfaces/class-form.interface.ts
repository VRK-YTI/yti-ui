import { ConceptType } from './concept-interface';
import { SimpleResource } from './simple-resource.interface';
import { UriData } from './uri.interface';

export interface ClassFormType {
  editorialNote: string;
  concept?: ConceptType;
  equivalentClass?: UriData[];
  identifier: string;
  uri: string;
  label: { [key: string]: string };
  note: { [key: string]: string };
  subClassOf?: UriData[];
  disjointWith?: UriData[];
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
  uri: '',
  label: {},
  note: {},
  subClassOf: [],
  disjointWith: [],
  targetClass: undefined,
  node: undefined,
  attribute: [],
  association: [],
};
