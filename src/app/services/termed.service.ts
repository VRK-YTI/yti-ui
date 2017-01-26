import { Injectable } from '@angular/core';
import { URLSearchParams, ResponseOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs';
import { TermedHttp } from './termed-http.service';
import { normalizeAsArray, flatten } from '../utils/array';
import { Localizable, asLocalizable } from '../entities/localization';
import { ConceptSchemeListNode, ConceptSchemeNode } from '../entities/external/concept-scheme';
import { ConceptListNode, ConceptDetailsNode } from '../entities/external/concept';
import { Graph } from '../entities/internal/graph';
import { MetaModel } from '../entities/internal/metaModel';

const infiniteResultsParams = new URLSearchParams();
infiniteResultsParams.append('max', '-1');

const infiniteResultsOptions = { search: infiniteResultsParams };

@Injectable()
export class TermedService {

  constructor(private http: TermedHttp) {
  }

  getGraphs(): Observable<Graph[]> {
    return this.http.get('/api/graphs', infiniteResultsOptions)
      .map(response => normalizeAsArray(response.json()) as Graph[]);
  }

  getMetaModels(graphId: string): Observable<MetaModel[]> {
    return this.http.get(`/api/graphs/${graphId}/types`, infiniteResultsOptions)
      .map(response => normalizeAsArray(response.json()) as MetaModel[]);
  }

  getMetaModel(graphId: string, nodeType: string): Observable<MetaModel> {
    return this.http.get(`/api/graphs/${graphId}/types/${nodeType}`, infiniteResultsOptions)
      .map(response => requireSingle(response.json() as MetaModel));
  }

  getConceptSchemeItem(graphId: string): Observable<ConceptSchemeItem> {
    return this.getConceptScheme(graphId).map(conceptScheme => new ConceptSchemeItem(conceptScheme));
  }

  getConceptScheme(graphId: string): Observable<ConceptSchemeNode> {

    const params = new URLSearchParams();
    params.append('max', '-1');
    params.append('graphId', graphId);
    params.append('typeId', 'ConceptScheme');
    params.append('select.references', '');
    params.append('select.referrers', '');

    return this.http.get(`/api/ext.json`, { search: params } )
      .map(response => requireSingle(response.json() as ConceptSchemeNode));
  }

  getConceptSchemeListItems(): Observable<ConceptSchemeListItem[]> {
    return this.getConceptSchemes().map(schemes => schemes.map(scheme => new ConceptSchemeListItem(scheme)));
  }

  getConceptSchemes(): Observable<ConceptSchemeListNode[]> {

    const params = new URLSearchParams();
    params.append('max', '-1');
    params.append('typeId', 'ConceptScheme');
    params.append('select.references', '');
    params.append('select.referrers', '');

    return this.http.get(`/api/ext.json`, { search: params } )
      .map(response => normalizeAsArray(response.json() as ConceptSchemeListNode[])).catch(notFoundAsDefault([]));
  }

  getConceptListItems(graphId: string): Observable<ConceptListItem[]> {
    return this.getConcepts(graphId).map(concepts => concepts.map(concept => new ConceptListItem(concept)));
  }

  getConcepts(graphId: string): Observable<ConceptListNode[]> {

    const params = new URLSearchParams();
    params.append('max', '-1');
    params.append('graphId', graphId);
    params.append('typeId', 'Concept');
    params.append('select.referrers', '');
    params.append('select.references', 'prefLabelXl');
    params.append('select.properties', 'prefLabel');

    return this.http.get(`/api/ext.json`, { search: params } )
      .map(response => normalizeAsArray(response.json() as ConceptListNode[])).catch(notFoundAsDefault([]));
  }


  getConceptItem(graphId: string, conceptId: string): Observable<ConceptItem> {
    return this.getConceptDetails(graphId, conceptId).map(concept => new ConceptItem(concept));
  }

  getConceptDetails(graphId: string, conceptId: string): Observable<ConceptDetailsNode> {

    const params = new URLSearchParams();
    params.append('max', '-1');
    params.append('graphId', graphId);
    params.append('uri', 'urn:uuid:' + conceptId);

    return this.http.get(`/api/ext.json`, { search: params } )
      .map(response => requireSingle(response.json() as ConceptDetailsNode));
  }
}

export class ConceptSchemeItem {

  id: string;
  graphId: string;
  label: Localizable;

  constructor(conceptScheme: ConceptSchemeNode) {
    this.id = conceptScheme.id;
    this.graphId = conceptScheme.type.graph.id;
    this.label = asLocalizable(conceptScheme.properties.prefLabel);
  }
}

export class ConceptSchemeListItem {

  id: string;
  graphId: string;
  label: Localizable;

  constructor(conceptScheme: ConceptSchemeListNode) {
    this.id = conceptScheme.id;
    this.graphId = conceptScheme.type.graph.id;
    this.label = asLocalizable(conceptScheme.properties.prefLabel);
  }
}

export class ConceptListItem {

  id: string;
  label: Localizable;

  constructor(concept: ConceptListNode) {
    this.id = concept.id;
    this.label = asLocalizable(flatten(normalizeAsArray(concept.references.prefLabelXl).map(term => term.properties.prefLabel)));
  }
}

export class ConceptItem {

  id: string;
  label: Localizable;
  definition: Localizable;
  status: string;
  uri: string;
  createdDate: string;
  lastModifiedDate: string;

  constructor(concept: ConceptDetailsNode) {
    this.id = concept.id;
    this.label = asLocalizable(flatten(concept.references.prefLabelXl.map(term => term.properties.prefLabel)));
    this.definition = asLocalizable(concept.properties.definition);
    this.status = concept.properties.term_status[0].value;
    this.uri = concept.uri;
    this.createdDate = concept.createdDate;
    this.lastModifiedDate = concept.lastModifiedDate;
  }
}

function requireSingle(json: any): any {
  if (Array.isArray(json)) {
    if (json.length === 1) {
      return json[0];
    } else {
      throw new Error('Must be single length array, was: ' + json.length);
    }
  } else {
    return json;
  }
}

function notFoundAsDefault<T>(defaultValue: T) {
  return (error: ResponseOptionsArgs, observable: Observable<T>) => {
    if (error.status = 404) {
      return Observable.of(defaultValue);
    } else {
      return observable;
    }
  }
}
