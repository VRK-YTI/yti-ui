import { Injectable } from '@angular/core';
import { Localizable, LocalizableArray, withFirstLocalizations } from '../entities/localization';
import { LanguageService } from './language.service';
import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { normalizeAsArray } from '../utils/array';
import { Moment } from 'moment';
import * as moment from 'moment';

export interface IndexedConceptData {
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
  status: string,
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

  constructor(hit: SearchResponseHit<IndexedConceptData>) {
    this.id = hit._source.id;
    this.label = withFirstLocalizations(hit._source.label);
    this.altLabel = withFirstLocalizations(hit._source.altLabel);
    this.definition = withFirstLocalizations(hit._source.definition);
    this.vocabulary = {
      id: hit._source.vocabulary.id,
      label: withFirstLocalizations(hit._source.vocabulary.label)
    };
    this.status = hit._source.status;
    this.modified = moment(hit._source.modified);
    this.hasNarrower = hit._source.hasNarrower === 'true';

    function setPropertyPath(obj: any, path: string, value: any) {

      const split = path.split('.');
      let objectAtPath = obj;

      for (let i = 0; i < split.length - 1; i++) {
        objectAtPath = objectAtPath[split[i]];
      }

      const lastProperty = split[split.length - 1];

      if (lastProperty !== 'exact') {
        objectAtPath[lastProperty] = value;
      }
    }

    // replace localizable values with highlights if found
    for (const [propertyPath, highlighted] of Object.entries(hit.highlight || {})) {
      setPropertyPath(this, propertyPath, normalizeAsArray(highlighted)[0]);
    }
  }
}

function field(name: string, language: string, boost?: number) {
  return name + '.' + language + (boost ? '^' + boost : '');
}

@Injectable()
export class ElasticSearchService {

  constructor(private http: Http, private languageService: LanguageService) {
  }

  private search(body: any): Observable<SearchResponse<IndexedConceptData>> {

    // uses GET because posting search to sanasto.csc.fi results in 403 response

    const params = new URLSearchParams();
    params.set('source', JSON.stringify(body));
    params.set('source_content_type', 'application/json');

    return this.http.get(`${environment.es_url}/concepts/concept/_search`, { search: params })
      .map(response => response.json() as SearchResponse<IndexedConceptData>);
  }

  frontPageSearch(search: string, resultSize: number): Observable<IndexedConcept[]> {

    return this.search({
        query: {
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
            type: 'best_fields',
            analyzer: 'termed',
            minimum_should_match: '90%'
          }
        },
        sort: ['_score'],
        highlight : {
          pre_tags : ['<b>'],
          post_tags : ['</b>'],
          fields : {
            'label.*': {},
            'altLabel.*': {},
            'definition.*': {}
          }
        },
        from: 0,
        size: resultSize
    }).map(result => result.hits.hits.map(hit => new IndexedConcept(hit)));
  }

  getConceptsForVocabulary(graphId: string, filter: string, sortByModified: boolean, onlyStatus: string|null): Observable<IndexedConcept[]> {

    const conditions: any[] = [
      {
        match: {
          'vocabulary.id': graphId
        }
      }
    ];

    if (filter) {
      conditions.push({
        multi_match: {
          query: filter,
          fields: [
            field('label', this.language, 10),
            field('label', '*')
          ],
          type: 'best_fields',
          minimum_should_match: '90%'
        },
      });
    }

    if (onlyStatus) {
      conditions.push({
        match: {
          'status': onlyStatus
        }
      });
    }

    const sort: any[] = filter ? ['_score'] : [`label.${this.languageService.language}.exact`];

    if (sortByModified) {
      sort.unshift({ 'modified': { 'order' : 'desc' } });
    }

    return this.search({
      query: {
        bool: {
          must: conditions
        }
      },
      highlight : {
        pre_tags : ['<b>'],
        post_tags : ['</b>'],
        fields : {
          'label.*': {},
        }
      },
      from: 0,
      size: 10000,
      sort
    }).map(result => result.hits.hits.map(hit => new IndexedConcept(hit)));
  }

  getTopConceptsForVocabulary(graphId: string): Observable<IndexedConcept[]> {

    return this.search({
      query: {
        bool: {
          must: {
            match: {
              'vocabulary.id': graphId
            }
          },
          must_not: {
            exists: {
              field: 'broader'
            }
          }
        }
      },
      from: 0,
      size: 10000,
      sort: [`label.${this.languageService.language}.exact`]
    }).map(result => result.hits.hits.map(hit => new IndexedConcept(hit)));
  }

  getNarrowerConcepts(graphId: string, broaderConceptId: string) {

    return this.search({
      query: {
        bool: {
          must: [
            {
              match: {
                'vocabulary.id': graphId
              }
            },
            {
              match: {
                'broader': broaderConceptId
              }
            }
          ]
        }
      },
      from: 0,
      size: 10000,
      sort: [`label.${this.languageService.language}.exact`]
    }).map(result => result.hits.hits.map(hit => new IndexedConcept(hit)));
  }

  private get language() {
    return this.languageService.language;
  }
}
