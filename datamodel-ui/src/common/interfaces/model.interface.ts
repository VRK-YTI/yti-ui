import { Status } from './status.interface';

export interface ModelType {
  type: 'LIBRARY' | 'PROFILE';
  prefix: string;
  status: Status;
  label: { [key: string]: string };
  description: { [key: string]: string };
  languages: string[];
  organizations: string[];
  groups: string[];
  contact: string;
  internalNamespaces: [];
  externalNamespaces: [];
  created: string;
  modified: string;
}

export interface Group {
  id: string;
  type: string;
  identifier: string;
  label: LangObject[];
}

export interface Organization {
  id: string;
  type: string;
  parentOrganization: string;
  prefLabel: LangObject[];
}

// Note: This might need a more descriptive name
export interface Link {
  id: string;
  description: LangObject;
  homepage: string;
  title: LangObject;
}

export interface Terminology {
  id: string;
  type: string;
  modified: string;
  prefLabel: LangObject | LangObject[];
  versionInfo: Status;
}

export interface ReferenceData {
  id: string;
  type: string;
  creator: string;
  description: LangObject | LangObject[];
  identifier: string;
  isPartOf: string | string[];
  status: Status;
  title: LangObject | LangObject[];
}

export interface DataVocabulary {
  id: string;
  type: string[];
  label: LangObject | LangObject[];
  preferredXMLNamespaceName: string[];
  preferredXMLNamespacePrefix: string;
}

export interface LangObject {
  lang: string;
  value: string;
}
