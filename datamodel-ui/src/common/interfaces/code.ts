import { Status } from 'yti-common-ui/interfaces/status.interface';

export interface CodeType {
  id: string;
  codeValue: string;
  uri: string;
  url: string;
  codesUrl: string;
  extensionsUrl: string;
  extensions?: {
    id: string;
    uri: string;
    url: string;
    membersUrl: string;
    codeValue: string;
    status: Status;
    startDate: string;
    created: string;
    modified: string;
    statusModified: string;
    prefLabel: { [key: string]: string };
    propertyType: {
      id: string;
      url: string;
      created: string;
      modified: string;
      context: string;
      uri: string;
      localName: string;
      prefLabel: { [key: string]: string };
      valueTypes: {
        id: string;
        url: string;
        localName: string;
        typeUri: string;
        uri: string;
        prefLabel: { [key: string]: string };
        regexp: string;
        required: boolean;
      }[];
    };
  }[];
  prefLabel: { [key: string]: string };
  startDate?: string;
  definition?: { [key: string]: string };
  description?: { [key: string]: string };
  created: string;
  modified: string;
  contentModified: string;
  statusModified: string;
  status: Status;
  infoDomains: {
    id: string;
    codeValue: string;
    uri: string;
    url: string;
    status: Status;
    order: number;
    hierarchyLevel: number;
    created: string;
    modified: string;
    prefLabel: { [key: string]: string };
    description: { [key: string]: string };
    membersUrl: string;
  }[];
  languageCodes: {
    id: string;
    codeValue: string;
    uri: string;
    url: string;
    status: Status;
    order: number;
    hierarchyLevel: number;
    created: string;
    modified: string;
    prefLabel: { [key: string]: string };
    membersUrl: string;
  }[];
  defaultCode: {
    id: string;
    codeValue: string;
    uri: string;
    url: string;
    status: Status;
    order: number;
    hierarchyLevel: number;
    startDate: string;
    created: string;
    modified: string;
    statusModified: string;
    prefLabel: { [key: string]: string };
    membersUrl: string;
  };
  conceptUriInVocabularies?: string;
  organizations: {
    id: string;
    url: string;
    prefLabel: { [key: string]: string };
    description: { [key: string]: string };
    removed: boolean;
  }[];
  cumulative: boolean;
  codeRegistry: {
    id: string;
    codeValue: string;
    uri: string;
    url: string;
    prefLabel: { [key: string]: string };
    description: { [key: string]: string };
    created: string;
    modified: string;
    codeSchemesUrl: string;
  };
  totalNrOfSearchHitsCodes: number;
  totalNrOfSearchHitsExtensions: number;
}
