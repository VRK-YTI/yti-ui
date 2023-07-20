import { ConceptType } from './concept-interface';
import { SimplePropertyShape } from './simple-property-shape.interface';
import { Status } from './status.interface';

export interface ClassType {
  attribute?: SimplePropertyShape[];
  association?: SimplePropertyShape[];
  label: { [key: string]: string };
  editorialNote?: string;
  status: Status;
  equivalentClass?: string[];
  subClassOf?: string[];
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
  targetClass?: string;
  targetNode?: string;
  uri: string;
}
