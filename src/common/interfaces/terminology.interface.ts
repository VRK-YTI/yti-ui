export interface TerminologySimpleDTO {
  id: string;
  code: string | null;
  uri: string | null;
  status: string | null;
  label: { [key: string]: string };
}

export interface ContributorsDTO {
  id: string;
  label: any; // TODO: Add typing
}

export interface InformationDomainDTO {
  id: string;
  label: any; // TODO: Add typing
}

export interface TerminologyDTO extends TerminologySimpleDTO {
  description: { [key: string]: string };
  contributors: ContributorsDTO[];
  informationDomains: InformationDomainDTO[];
}

// export interface DeepHitsObjDTO {
//   topHits: TerminologyDTO[];
//   totalHitCount: number;
//   type: string;
// }

// export interface DeepHitsDTO {
//   [id: string]: DeepHitsObjDTO[];
// }

export interface TerminologySearchResult {
  totalHitCount: number;
  resultStart: number;
  terminologies: TerminologyDTO[] | null;
  deepHits: any | null; // TODO: Add typing
}
