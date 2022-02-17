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

export interface CommonInfoDTO {
  lang: string;
  regex: string;
  value: string;
}

export interface GroupSearchResult {
  code: string;
  id: string;
  properties: {
    definition: CommonInfoDTO[];
    notation: CommonInfoDTO[];
    order: CommonInfoDTO[];
    prefLabel: CommonInfoDTO;
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
    prefLabel: CommonInfoDTO;
  };
  type: {
    graph: {
      id: string;
    };
    id: string;
  };
}
