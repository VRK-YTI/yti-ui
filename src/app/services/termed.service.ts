import { Injectable } from '@angular/core';
import { Graph } from '../entities/graph';
import { URLSearchParams, ResponseOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs';
import { TermedHttp } from './termed-http.service';
import { ConceptScheme } from '../entities/conceptScheme';

@Injectable()
export class TermedService {

  constructor(private http: TermedHttp) {
  }

  getGraphs(): Observable<Graph[]> {
    return this.http.get('/api/graphs')
      .map(response => response.json() as Graph[]);
  }

  // FIXME: makes n+1 requests and needs proper API
  getConceptSchemes(): Observable<ConceptScheme[]> {

    return this.getGraphs()
      .flatMap(graphs =>
        Observable.forkJoin(graphs.map(graph => this.getConceptScheme(graph.id).catch(notFoundAsDefault(null)))))
      .map(conceptSchemes => conceptSchemes.filter(conceptScheme => conceptScheme !== null));
  }

  getConceptScheme(graphId: string): Observable<ConceptScheme> {

    const params = new URLSearchParams();
    params.append('max', '-1');

    return this.http.get(`/api/graphs/${graphId}/types/ConceptScheme/nodes`, { search: params })
      .map(response => requireSingle(response.json()) as ConceptScheme)
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
