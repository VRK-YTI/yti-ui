import { Status } from './status.interface';

export interface ModelType {
  type: 'LIBRARY' | 'PROFILE';
  uri: string;
  prefix: string;
  status: Status;
  label: { [key: string]: string };
  description: { [key: string]: string };
  documentation: { [key: string]: string };
  languages: string[];
  organizations: Organization[];
  groups: Group[];
  contact: string;
  internalNamespaces: InternalNamespace[];
  externalNamespaces: ExternalNamespace[];
  terminologies: ModelTerminology[];
  codeLists: ModelCodeList[];
  links: {
    description: { [key: string]: string };
    name: { [key: string]: string };
    uri: string;
  }[];
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
  version?: string;
  versionIri?: string;
}

export interface InternalNamespace {
  name: { [key: string]: string };
  namespace: string;
  prefix: string;
}

export interface ExternalNamespace {
  name: { [key: string]: string };
  namespace: string;
  prefix: string;
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
  description: { [key: string]: string };
  name: { [key: string]: string };
  uri: string;
  id: string;
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
  label: { [key: string]: string };
  description: { [key: string]: string };
  languages: string[];
  organizations: string[];
  groups: string[];
  internalNamespaces: string[];
  externalNamespaces: {
    name: { [key: string]: string };
    namespace: string;
    prefix: string;
  }[];
  terminologies: string[];
  codeLists: string[];
  documentation: { [key: string]: string };
  contact: string;
  links: {
    description: { [key: string]: string };
    name: { [key: string]: string };
    uri: string;
  }[];
}

export interface VersionedModelUpdatePayload {
  label: { [key: string]: string };
  description: { [key: string]: string };
  organizations: string[];
  groups: string[];
  contact: string;
  documentation: { [key: string]: string };
  links: {
    description: { [key: string]: string };
    name: { [key: string]: string };
    uri: string;
  }[];
  status: Status;
}
