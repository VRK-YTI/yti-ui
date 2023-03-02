import { Status } from './status.interface';

export interface ClassFormType {
  comment: string;
  concept: object;
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
  comment: '',
  concept: {},
  equivalentClass: [],
  identifier: '',
  label: {},
  inheritedAttributes: [],
  note: {},
  ownAttributes: [],
  subClassOf: [],
  status: 'DRAFT',
};
