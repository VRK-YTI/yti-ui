import { Injectable } from '@angular/core';
import { withFirstLocalizations } from 'yti-common-ui/utils/localization';
import { LanguageService } from './language.service';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { normalizeAsArray } from 'yti-common-ui/utils/array';
import { Moment } from 'moment';
import * as moment from 'moment';
import { Localizable, LocalizableArray } from 'yti-common-ui/types/localization';
import { apiUrl } from 'app/config';

export interface IndexedConceptData {
  id: string,
  vocabulary: {
    id: string, // actually graphId
    label: Localizable|LocalizableArray
  }
  label: Localizable|LocalizableArray,
  sortByLabel: Localizable,
  altLabel: Localizable|LocalizableArray,
  definition: Localizable|LocalizableArray,
  broader: string[],
  narrower: string[],
  modified: string,
  status: string,
  hasNarrower: boolean,
  uri: string
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
  uri: string;

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
    this.hasNarrower = hit._source.hasNarrower;
    this.uri = hit._source.uri;

    function setPropertyPath(obj: any, path: string, value: any) {

      const split = path.split('.');
      let objectAtPath = obj;

      for (let i = 0; i < split.length - 1; i++) {
        objectAtPath = objectAtPath[split[i]];
      }

      const lastProperty = split[split.length - 1];
      objectAtPath[lastProperty] = value;
    }

    // replace localizable values with highlights if found
    for (const [propertyPath, highlighted] of Object.entries(hit.highlight || {})) {
      setPropertyPath(this, propertyPath, normalizeAsArray(highlighted)[0]);
    }
  }

  get idIdentifier() {
    return this.uri;
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

    const headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post(`${apiUrl}/searchConcept`, JSON.stringify(body), { headers } )
      .map(response => response.json() as SearchResponse<IndexedConceptData>);
  }

  frontpageSearch(filter: string, onlyGraph: string|null, onlyStatus: string|null, from: number, size: number): Observable<IndexedConcept[]> {

    const mustConditions: any[] = [{
      multi_match: {
        query: filter,
        fields: [
          field('label', this.language, 10),
          field('label', '*'),
          field('definition', this.language, 2),
          field('definition', '*'),
        ],
        type: 'best_fields',
        minimum_should_match: '90%'
      },
    }];

    if (onlyGraph) {
      mustConditions.push({
        match: {
          'vocabulary.id': onlyGraph
        }
      });
    }

    if (onlyStatus) {
      mustConditions.push({
        match: {
          'status': onlyStatus
        }
      });
    }

    return this.search({
      query: {
        bool: {
          must: mustConditions
        }
      },
      sort: ['_score'],
      highlight : {
        pre_tags : ['<b>'],
        post_tags : ['</b>'],
        fields : {
          'label.*': {},
          'altLabel.*': {}
        }
      },
      from,
      size,
    }).map(result => result.hits.hits.map(hit => new IndexedConcept(hit)));
  }

  findSingleConceptForVocabulary(graphId: string,
                                 conceptId: string,
                                 filter: string,
                                 sortByModified: boolean,
                                 onlyStatus: string|null): Observable<IndexedConcept|null> {

    return this.getConceptsForVocabularies(graphId, 'include', conceptId, filter, sortByModified, onlyStatus, 0, 1)
      .map(concepts => {
        if (concepts.length === 0) {
          return null;
        } else {
          return concepts[0];
        }
      });
  }

  getAllConceptsForVocabulary(graphId: string,
                              filter: string,
                              sortByModified: boolean,
                              onlyStatus: string|null,
                              from: number,
                              size: number): Observable<IndexedConcept[]> {

    return this.getConceptsForVocabularies(graphId, 'include', null, filter, sortByModified, onlyStatus, from, size);
  }

  getAllConceptsNotInVocabulary(notInGraphId: string,
                                filter: string,
                                sortByModified: boolean,
                                onlyStatus: string|null,
                                from: number,
                                size: number): Observable<IndexedConcept[]> {

    return this.getConceptsForVocabularies(notInGraphId, 'exclude', null, filter, sortByModified, onlyStatus, from, size);
  }

  private getConceptsForVocabularies(graphId: string,
                                     graphMode: 'include'|'exclude',
                                     conceptId: string|null,
                                     filter: string,
                                     sortByModified: boolean,
                                     onlyStatus: string|null,
                                     from: number,
                                     size: number): Observable<IndexedConcept[]> {

    const mustConditions: any[] = [];
    const mustNotConditions: any[] = [];

    const vocabularyMatch = {
      match: {
        'vocabulary.id': graphId
      }
    };

    if (graphMode === 'include') {
      mustConditions.push(vocabularyMatch);
    } else {
      mustNotConditions.push(vocabularyMatch);
    }

    if (conceptId) {
      mustConditions.push({
        match: {
          'id': conceptId
        }
      });
    }

    if (filter) {
      mustConditions.push({
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
      mustConditions.push({
        match: {
          'status': onlyStatus
        }
      });
    }

    const sort: any[] = filter ? ['_score'] : [`sortByLabel.${this.language}`];

    if (sortByModified) {
      sort.unshift({ 'modified': { 'order' : 'desc' } });
    }

    return this.search({
      query: {
        bool: {
          must: mustConditions,
          must_not: mustNotConditions
        }
      },
      highlight : {
        pre_tags : ['<b>'],
        post_tags : ['</b>'],
        fields : {
          'label.*': {},
        }
      },
      from,
      size,
      sort
    }).map(result => result.hits.hits.map(hit => new IndexedConcept(hit)));
  }

  getTopConceptsForVocabulary(graphId: string, from: number, size: number): Observable<IndexedConcept[]> {

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
      from,
      size,
      sort: [`sortByLabel.${this.language}`]
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
      sort: [`sortByLabel.${this.language}`]
    }).map(result => result.hits.hits.map(hit => new IndexedConcept(hit)));
  }

  private get language() {
    return this.languageService.translateLanguage;
  }
}
