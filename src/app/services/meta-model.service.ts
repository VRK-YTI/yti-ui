import { URLSearchParams } from '@angular/http';
import { Observable, ReplaySubject } from 'rxjs';
import { index, normalizeAsArray } from '../utils/array';
import { Injectable } from '@angular/core';
import { TermedHttp } from './termed-http.service';
import { Graph } from '../entities/graph';
import { GraphMeta, MetaModel } from '../entities/meta';
import { NodeMetaInternal } from '../entities/meta-api';
import { asLocalizable } from '../entities/localization';
import { environment } from '../../environments/environment';

const infiniteResultsParams = new URLSearchParams();
infiniteResultsParams.append('max', '-1');

const infiniteResultsOptions = { search: infiniteResultsParams };

@Injectable()
export class MetaModelService {

  private metaCache = new ReplaySubject<Map<string, GraphMeta>>();
  private templates = new ReplaySubject<GraphMeta[]>();

  constructor(private http: TermedHttp) {

    this.getGraphs()
      .flatMap(graphs => Observable.forkJoin(graphs.map(graph => this.createGraphMeta(graph))))
      .subscribe(graphMetas => {
        this.metaCache.next(index(graphMetas, graphMeta => graphMeta.graphId));
        this.metaCache.complete();
        this.templates.next(graphMetas.filter(graphMeta => graphMeta.template));
        this.templates.complete();
      });
  }

  getMeta(graphId: string): Observable<MetaModel> {
    return this.getGraphMeta(graphId).flatMap(graphMeta => this.createMetaModel(graphMeta));
  }

  copyTemplateToGraph(templateMeta: GraphMeta, graphId: string): Observable<MetaModel> {
    return this.createMetaModel(templateMeta.copyToGraph(graphId));
  }

  getGraphMeta(graphId: string): Observable<GraphMeta> {

    return this.metaCache.flatMap(metaCache => {

      if (metaCache.has(graphId)) {
        return Observable.of(metaCache.get(graphId));
      } else {
        return this.getGraph(graphId)
          .flatMap(graph => this.createGraphMeta(graph))
          .do(graphMeta => metaCache.set(graphId, graphMeta));
      }
    });
  }

  private createGraphMeta(graph: Graph): Observable<GraphMeta> {
    return this.getMetaNodes(graph.id).map(nodeMetasInGraph => {
      const template = graph.properties.type ? graph.properties.type[0].value === 'Metamodel' : false;
      const label = asLocalizable(graph.properties['prefLabel']);
      return new GraphMeta(graph.id, label, nodeMetasInGraph, template);
    });
  }

  private createMetaModel(graphMeta: GraphMeta): Observable<MetaModel> {

    const externalGraphs = new Set<string>();

    for (const nodeMeta of graphMeta.getNodeMetas()) {
      for (const reference of nodeMeta.references) {
        externalGraphs.add(reference.graphId);
      }
    }

    externalGraphs.delete(graphMeta.graphId);

    // necessary optimization since forkJoin doesn't ever complete with empty observables array
    if (externalGraphs.size === 0) {
      return Observable.of(new MetaModel(index([graphMeta], graphMeta => graphMeta.graphId)));
    }

    return Observable.forkJoin(Array.from(externalGraphs).map(graph => this.getGraphMeta(graph)))
      .map(graphMetas => new MetaModel(index([graphMeta, ...graphMetas], graphMeta => graphMeta.graphId)));
  }

  getMetaTemplates(): Observable<GraphMeta[]> {
    return this.templates.asObservable();
  }

  updateMeta(graphMeta: GraphMeta): Observable<any> {

    const params = new URLSearchParams();
    params.append('batch', 'true');

    return Observable.zip(this.metaCache, this.http.post(`${environment.api_url}/graphs/${graphMeta.graphId}/types`, graphMeta.toNodes(), { search: params }))
      .do(([metaCache, response]) => metaCache.set(graphMeta.graphId, graphMeta));
  }

  removeGraphMeta(graphId: string): Observable<any> {
    return this.getGraphMeta(graphId)
      .flatMap(meta => Observable.zip(this.metaCache, this.removeMetaNodes(graphId, meta.toNodes()))
        .do(([metaCache, response]) => metaCache.delete(graphId)));
  }

  private removeMetaNodes(graphId: string, nodes: NodeMetaInternal[]) {

    const params = new URLSearchParams();
    params.append('batch', 'true');

    return this.http.delete(`${environment.api_url}/graphs/${graphId}/types`, { search: params, body: nodes });
  }

  private getGraph(graphId: string): Observable<Graph> {
    return this.http.get(`${environment.api_url}/graphs/${graphId}`)
      .map(response => response.json() as Graph);
  }

  private getGraphs(): Observable<Graph[]> {
    return this.http.get(`${environment.api_url}/graphs`, infiniteResultsOptions)
      .map(response => normalizeAsArray(response.json()) as Graph[]);
  }

  private getMetaNodes(graphId: string): Observable<NodeMetaInternal[]> {
    return this.http.get(`${environment.api_url}/graphs/${graphId}/types`, infiniteResultsOptions)
      .map(response => normalizeAsArray(response.json()) as NodeMetaInternal[]);
  }
}
