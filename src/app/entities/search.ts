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

export class Concept extends ConceptSimple {
  altLabel?: Localizable;
  definition?: Localizable;
  modified?: string;
  narrower?: string[];
  broader?: string[];
  terminology: TerminologySimple;
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

export class ConceptSearchRequest {
  query?: string;
  conceptId?: string[];
  terminologyId?: string[];
  notInTerminologyId?: string[];
  broaderConceptId?: string[];
  onlyTopConcepts?: boolean;
  status?: string[];
  sortBy?: 'PREF_LABEL' | 'MODIFIED';
  sortDirection?: 'ASC' | 'DESC';
  sortLanguage?: string;
  pageSize?: number;
  pageFrom?: number;
  highlight?: boolean;
}

export class ConceptSearchResponse {
  totalHitCount: number;
  resultStart: number;
  concepts: Concept[];
}
