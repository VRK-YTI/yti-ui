import { Localizable } from 'yti-common-ui/types/localization';

export class InformationDomain {
  id: string;
  label: Localizable;
}

export class Organization {
  id: string;
  label: Localizable;
}

export class TerminologySimple {
  id: string;
  code: string;
  uri: string;
  status: string;
  label: Localizable;
}

export class Terminology extends TerminologySimple {
  description: Localizable;
  informationDomains: InformationDomain[];
  contributors: Organization[];
}

export class ConceptSimple {
  id: string;
  uri: string;
  status: string;
  label: Localizable;
}

export class DeepSearchHitList {
  type: 'CONCEPT';
  totalHitCount: number;
  topHits: ConceptSimple[];
}

export class TerminologySearchRequest {
  query: string;
  searchConcepts: boolean;
  prefLang: string;
  pageSize: number;
  pageFrom: number;

  constructor(query: string, searchConcepts: boolean, prefLang: string, pageSize: number, pageFrom: number) {
    this.query = query;
    this.searchConcepts = searchConcepts;
    this.prefLang = prefLang;
    this.pageSize = pageSize;
    this.pageFrom = pageFrom;
  }
}

export class TerminologySearchResponse {
  totalHitCount: number;
  resultStart: number;
  terminologies: Terminology[];
  deepHits: { [terminologyId: string]: DeepSearchHitList[] };
}
