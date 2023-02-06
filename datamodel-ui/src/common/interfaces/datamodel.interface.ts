import { Type } from './type.interface';

export interface DataModel {
  comment: {
    [key: string]: string;
  };
  contentModified?: string;
  contributor: string[];
  created: string;
  documentation?: {
    [key: string]: string;
  };
  id: string;
  isPartOf: string[];
  label: {
    [key: string]: string;
  };
  language: string[];
  modified: string;
  namespace: string;
  prefix: string;
  status: string;
  statusModified: string;
  type: Type;
  useContext: string;
}
