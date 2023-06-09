import { Status } from './status.interface';

export interface ModelType {
  type: 'LIBRARY' | 'PROFILE';
  prefix: string;
  status: Status;
  label: { [key: string]: string };
  description: { [key: string]: string };
  languages: string[];
  organizations: Organization[];
  groups: Group[];
  contact: string;
  internalNamespaces: string[];
  externalNamespaces: {
    name: string;
    namespace: string;
    prefix: string;
  }[];
  terminologies: ModelTerminology[];
  codeLists: ModelCodeList[];
  created: string;
  creator: {
    id: string;
    name: string;
  };
  modified: string;
  modifier: {
    id: string;
    name: string;
  };
}

export interface Group {
  id: string;
  identifier: string;
  label: { [key: string]: string };
}

export interface Organization {
  id: string;
  parentOrganization?: string;
  label: { [key: string]: string };
}

// Note: This might need a more descriptive name
export interface Link {
  id: string;
  description: LangObject;
  homepage: string;
  title: LangObject;
}

export interface ModelTerminology {
  uri: string;
  label: { [key: string]: string };
}

export interface ModelCodeList {
  id: string;
  prefLabel: { [key: string]: string };
  status: Status;
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

export interface ModelUpdatePayload {
  status: string;
  label: { [key: string]: string };
  description: { [key: string]: string };
  languages: string[];
  organizations: string[];
  groups: string[];
  internalNamespaces: string[];
  externalNamespaces: {
    name: string;
    namespace: string;
    prefix: string;
  }[];
  terminologies: string[];
  codeLists: string[];
  contact: string;
}
