import { Injectable } from '@angular/core';
import { LanguageService } from './language.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Localizable, LocalizableArray } from 'yti-common-ui/types/localization';
import { apiUrl } from 'app/config';
import { HttpClient } from '@angular/common/http';
import {
  Concept,
  ConceptSearchRequest,
  ConceptSearchResponse,
  TerminologySearchRequest,
  TerminologySearchResponse
} from '../entities/search';

export interface IndexedConceptData {
  id: string;
  vocabulary: {
    id: string, // actually graphId
    label: Localizable | LocalizableArray
  };
  label: Localizable | LocalizableArray;
  sortByLabel: Localizable;
  altLabel: Localizable | LocalizableArray;
  definition: Localizable | LocalizableArray;
  broader: string[];
  narrower: string[];
  modified: string;
  status: string;
  hasNarrower: boolean;
  uri: string;
}

export interface SearchResponse<T> {
  took: number;
  timed_out: boolean;
  _scroll_id?: string;
  _shards: ShardsResponse;
  hits: {
    total: number;
    max_score: number;
    hits: SearchResponseHit<T>[];
  };
  aggregations?: any;
}

export interface SearchResponseHit<T> {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _source: T;
  _version: number;
  _explanation?: Explanation;
  fields?: any;
  highlight?: any;
  inner_hits?: any;
}

export interface Explanation {
  value: number;
  description: string;
  details: Explanation[];
}

export interface ShardsResponse {
  total: number;
  successful: number;
  failed: number;
}

export class IndexedConcept {
  id: string;
  label: Localizable;
  altLabel: Localizable;
  definition: Localizable;
  vocabulary: {
    id: string, // actually graphId
    label: Localizable
  };
  status: string;
  modified: Moment;
  hasNarrower: boolean;
  uri: string;

  constructor(hit: Concept) {
    this.id = hit.id;
    this.label = hit.label;
    this.status = hit.status;
    this.uri = hit.uri;
    this.hasNarrower = !!hit.narrower && hit.narrower.length > 0;
    if (hit.altLabel) this.altLabel = hit.altLabel;
    if (hit.definition) this.definition = hit.definition;
    if (hit.modified) this.modified = moment(hit.modified);

    this.vocabulary = {
      id: hit.terminology.id,
      label: hit.terminology.label
    };
  }

  get idIdentifier() {
    return this.uri;
  }
}

@Injectable()
export class ElasticSearchService {

  constructor(private http: HttpClient, private languageService: LanguageService) {
  }

  private get language() {
    return this.languageService.translateLanguage;
  }

  private static convert(response: ConceptSearchResponse): IndexedConcept[] {
    return response && response.concepts ? response.concepts.map(concept => new IndexedConcept(concept)) : [];
  }

  findSingleConceptForVocabulary(graphId: string,
                                 conceptId: string,
                                 filter: string,
                                 sortByModified: boolean,
                                 onlyStatus: string | null): Observable<IndexedConcept | null> {
    return this.conceptSearch({
      terminologyId: graphId ? [graphId] : undefined,
      conceptId: [conceptId],
      query: filter ? filter : undefined,
      sortBy: sortByModified ? "MODIFIED" : undefined,
      status: onlyStatus ? [onlyStatus] : undefined
    }).pipe(map(response => {
      if (response.concepts && response.concepts.length > 0) {
        return new IndexedConcept(response.concepts[0]);
      }
      return null;
    }));
  }

  getAllConceptsForVocabulary(graphId: string,
                              filter: string,
                              sortByModified: boolean,
                              onlyStatus: string | null,
                              from: number,
                              size: number): Observable<IndexedConcept[]> {
    return this.getAllConceptsInOrNotInVocabulary(graphId, undefined, filter, sortByModified, onlyStatus, from, size);
  }

  getAllConceptsNotInVocabulary(notInGraphId: string,
                                filter: string,
                                sortByModified: boolean,
                                onlyStatus: string | null,
                                from: number,
                                size: number): Observable<IndexedConcept[]> {
    return this.getAllConceptsInOrNotInVocabulary(undefined, notInGraphId, filter, sortByModified, onlyStatus, from, size);
  }

  getTopConceptsForVocabulary(graphId: string, from: number, size: number): Observable<IndexedConcept[]> {

    return this.conceptSearch({
      terminologyId: graphId ? [graphId] : undefined,
      pageSize: size,
      pageFrom: from,
      sortLanguage: this.language
    }).pipe(map(ElasticSearchService.convert));
  }

  getNarrowerConcepts(graphId: string, broaderConceptId: string) {
    return this.conceptSearch({
      terminologyId: graphId ? [graphId] : undefined,
      broaderConceptId: [broaderConceptId],
      pageSize: 10000,
      pageFrom: 0,
      sortLanguage: this.language
    }).pipe(map(ElasticSearchService.convert));
  }

  terminologySearch(request: TerminologySearchRequest): Observable<TerminologySearchResponse> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<TerminologySearchResponse>(`${apiUrl}/searchTerminology`, JSON.stringify(request), { headers });
  }

  conceptSearch(request: ConceptSearchRequest): Observable<ConceptSearchResponse> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<ConceptSearchResponse>(`${apiUrl}/searchConcept`, JSON.stringify(request), { headers });
  }

  private getAllConceptsInOrNotInVocabulary(graphId: string | undefined,
                                            notInGraphId: string | undefined,
                                            filter: string,
                                            sortByModified: boolean,
                                            onlyStatus: string | null,
                                            from: number,
                                            size: number): Observable<IndexedConcept[]> {
    return this.conceptSearch({
      terminologyId: graphId ? [graphId] : undefined,
      notInTerminologyId: notInGraphId ? [notInGraphId] : undefined,
      query: filter ? filter : undefined,
      sortBy: sortByModified ? "MODIFIED" : undefined,
      status: onlyStatus ? [onlyStatus] : undefined,
      pageSize: size,
      pageFrom: from,
      sortLanguage: this.language
    }).pipe(map(ElasticSearchService.convert));
  }
}
