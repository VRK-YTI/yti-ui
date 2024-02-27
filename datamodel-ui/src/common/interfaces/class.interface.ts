import { ConceptType } from './concept-interface';
import { SimpleResource } from './simple-resource.interface';
import { Status } from './status.interface';
import { UriData } from './uri.interface';

export interface ClassType {
  attribute?: SimpleResource[];
  association?: SimpleResource[];
  label: { [key: string]: string };
  editorialNote?: string;
  status: Status;
  equivalentClass?: UriData[];
  subClassOf?: UriData[];
  disjointWith?: UriData[];
  subject?: ConceptType;
  identifier: string;
  created: string;
  creator: {
    id: string | null;
    name: string | null;
  };
  modified: string;
  modifier: {
    id: string | null;
    name: string | null;
  };
  contributor: [
    {
      id: string;
      label: { [key: string]: string };
      parentOrganization: string;
    }
  ];
  contact?: string;
  note: { [key: string]: string };
  targetClass?: UriData;
  targetNode?: UriData;
  uri: string;
  curie: string;
}
