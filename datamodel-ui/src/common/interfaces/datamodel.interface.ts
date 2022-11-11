export interface DataModel {
  id: string;
  useContext: string;
  status: string;
  statusModified: string;
  modified: string;
  created: string;
  contentModified: string;
  type: 'library' | 'profile';
  prefix: string;
  namespace: string;
  label: {
    [key: string]: string;
  };
  comment: {
    [key: string]: string;
  };
  contributor: string[];
  isPartOf: string[];
  language: string[];
}
