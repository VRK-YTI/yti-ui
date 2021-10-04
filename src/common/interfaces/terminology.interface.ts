export interface TerminologySimpleDTO {
  id: string;
  code: string | null;
  uri: string | null;
  status: string | null;
  label: { [key: string]: string };
}

export interface TerminologyDTO extends TerminologySimpleDTO {
  description: { [key: string]: string };
  informationDomainDTO: any; // TODO: add typing
  contributors: any; // TODO: add typing
}

export interface TerminologySearchResult {
  totalHitCount: number;
  resultStart: number;
  terminologies: TerminologyDTO[];
  deepHits: any; // TODO: add typing
}
