import { Property } from './termed-data-types.interface';

export interface TerminologySimpleDTO {
  id: string;
  code: string;
  uri: string;
  status: string;
  label: { [key: string]: string };
}

export interface ContributorsDTO {
  id: string;
  label: { [key: string]: string };
}

export interface InformationDomainDTO {
  id: string;
  label: { [key: string]: string };
}

export interface TerminologyDTO extends TerminologySimpleDTO {
  description?: { [key: string]: string };
  contributors: ContributorsDTO[];
  informationDomains: InformationDomainDTO[];
}

export interface TerminologySearchResult {
  totalHitCount: number;
  resultStart: number;
  terminologies: TerminologyDTO[] | null;
  deepHits: null;
}

export interface GroupSearchResult {
  code: string;
  id: string;
  properties: {
    definition: Property[];
    notation: Property[];
    order: Property[];
    prefLabel: Property;
  };
  type: {
    graph: {
      id: string;
    };
    id: string;
  };
  uri: string;
}

export interface OrganizationSearchResult {
  code: string;
  id: string;
  properties: {
    prefLabel: Property;
  };
  type: {
    graph: {
      id: string;
    };
    id: string;
  };
}
