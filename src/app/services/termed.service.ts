import { Injectable } from '@angular/core';
import { Graph } from '../entities/graph';
import { URLSearchParams, ResponseOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs';
import { TermedHttp } from './termed-http.service';
import { ConceptScheme } from '../entities/conceptScheme';
import { Concept } from '../entities/concept';
import { MetaModel } from '../entities/metaModel';
import { Term } from '../entities/term';
import { normalizeAsArray, index, filterDefined, flatten } from '../utils/array';
import { Localizable, asLocalizable } from '../entities/localization';

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

  getConceptSchemeListItems(): Observable<ConceptSchemeListItem[]> {
    return this.getConceptSchemes().map(schemes => schemes.map(scheme => new ConceptSchemeListItem(scheme)));
  }

  // FIXME: makes n+1 requests and needs proper API
  getConceptSchemes(): Observable<ConceptScheme[]> {

    return this.getGraphs()
      .flatMap(graphs => {

        const conceptSchemes: Observable<(ConceptScheme|null)>[] =
          graphs.map(graph => this.getConceptScheme(graph.id).catch(notFoundAsDefault(null)));

        return Observable.forkJoin(conceptSchemes);
      })
      .map(conceptSchemes => conceptSchemes.filter(conceptScheme => conceptScheme !== null));
  }

  getConceptScheme(graphId: string): Observable<ConceptScheme> {
    return this.getNodesOfType(graphId, 'ConceptScheme')
      .map(schemes => requireSingle(schemes) as ConceptScheme);
  }

  getConceptListItems(graphId: string): Observable<ConceptListItem[]> {
    const concepts = this.getConcepts(graphId);
    const terms = this.getTerms(graphId).map(terms => index(terms, term => term.id));

    return Observable.combineLatest([concepts, terms], (concepts: Concept[], termMap: Map<string, Term>) => {
      return concepts.map(concept => {
        const terms = normalizeAsArray(concept.references.prefLabelXl);
        return new ConceptListItem(concept, filterDefined(terms.map(termRef => termMap.get(termRef.id))));
      })
    });
  }

  getConcepts(graphId: string): Observable<Concept[]> {
    return this.getNodesOfType(graphId, 'Concept');
  }

  getConceptItem(graphId: string, conceptId: string): Observable<ConceptItem> {
    const concept = this.getConcept(graphId, conceptId);
    const terms = this.getTerms(graphId).map(terms => index(terms, term => term.id));

    return Observable.combineLatest([concept, terms], (concept: Concept, termMap: Map<string, Term>) => {
      const terms = normalizeAsArray(concept.references.prefLabelXl);
      return new ConceptItem(concept, filterDefined(terms.map(termRef => termMap.get(termRef.id))));
    });
  }

  getConcept(graphId: string, conceptId: string): Observable<Concept> {
    return this.getNodeOfType(graphId, 'Concept', conceptId);
  }

  getTerms(graphId: string): Observable<Term[]> {
    return this.getNodesOfType(graphId, 'Term');
  }

  getTerm(graphId: string, termId: string): Observable<Term> {
    return this.getNodeOfType(graphId, 'Term', termId);
  }

  private getNodesOfType<T>(graphId: string, nodeType: string): Observable<T[]> {
    return this.http.get(`/api/graphs/${graphId}/types/${nodeType}/nodes`, infiniteResultsOptions)
      .map(response => normalizeAsArray(response.json() as T[])).catch(notFoundAsDefault([]))
  }

  private getNodeOfType<T>(graphId: string, nodeType: string, nodeId: string): Observable<T> {
    return this.http.get(`/api/graphs/${graphId}/types/${nodeType}/nodes/${nodeId}`, infiniteResultsOptions)
      .map(response => requireSingle(response.json() as T));
  }
}

export class ConceptSchemeListItem {

  id: string;
  graphId: string;
  label: Localizable;

  constructor(conceptScheme: ConceptScheme) {
    this.id = conceptScheme.id;
    this.graphId = conceptScheme.type.graph.id;
    this.label = asLocalizable(conceptScheme.properties.prefLabel);
  }
}

export class ConceptListItem {

  id: string;
  label: Localizable;

  constructor(concept: Concept, terms: Term[]) {
    this.id = concept.id;
    this.label = asLocalizable(flatten(terms.map(term => term.properties.prefLabel)));
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

  constructor(concept: Concept, terms: Term[]) {
    this.id = concept.id;
    this.label = asLocalizable(flatten(terms.map(term => term.properties.prefLabel)));
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
