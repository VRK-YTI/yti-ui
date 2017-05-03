import { Injectable } from '@angular/core';
import { Localizable, LocalizableArray } from '../entities/localization';
import { LanguageService } from './language.service';
import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

export interface IndexedConcept {
  id: string,
  vocabulary: {
    id: string, // actually graphId
    label: Localizable|LocalizableArray
  }
  label: Localizable|LocalizableArray,
  altLabel: Localizable|LocalizableArray,
  definition: Localizable|LocalizableArray,
  broader: string[],
  narrower: string[],
  modified: string,
  hasNarrower: 'true'|'false', // FIXME: should be boolean
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
  value: number,
  description: string,
  details: Explanation[]
}

export interface ShardsResponse {
  total: number;
  successful: number;
  failed: number;
}

@Injectable()
export class ElasticSearchService {

  constructor(private http: Http, private languageService: LanguageService) {
  }

  private search(body: any): Observable<SearchResponse<IndexedConcept>> {

    // FIXME: uses GET because posting search to sanasto.csc.fi results in 403 response

    const params = new URLSearchParams();
    params.set('source', JSON.stringify(body));

    return this.http.get(`${environment.es_url}/concepts/concept/_search`, { search: params })
      .map(response => response.json() as SearchResponse<IndexedConcept>);
  }

  frontPageSearch(search: string, resultSize: number): Observable<SearchResponse<IndexedConcept>> {

    return this.search({
        query: this.createQueryObject(search),
        sort: ['_score'],
        highlight : {
          pre_tags : ['<b>'],
          post_tags : ['</b>'],
          fields : {
            'label.*': {},
            'altLabel.*': {}
          }
        },
        from : 0,
        size : resultSize
    });
  }

  private createQueryObject(search: string) {

    const field = (name: string, language: string, boost?: number) => {
      return name + '.' + language + (boost ? '^' + boost : '');
    };

    return {
      multi_match: {
        query: search,
        fields: [
          field('label', this.language, 10),
          field('label', '*'),
          field('altLabel', this.language, 8),
          field('altLabel', '*'),
          field('definition', this.language, 2),
          field('definition', '*'),
        ],
        type: "most_fields",
        minimum_should_match: "90%"
      }
    }
  }

  private get language() {
    return this.languageService.language;
  }
}
