import { URLSearchParams } from '@angular/http';
import { Observable, ReplaySubject } from 'rxjs';
import { groupBy, index, normalizeAsArray } from 'yti-common-ui/utils/array';
import { Injectable } from '@angular/core';
import { TermedHttp } from './termed-http.service';
import { Graph } from 'app/entities/graph';
import { GraphMeta, MetaModel, ReferenceMeta } from 'app/entities/meta';
import { NodeMetaInternal } from 'app/entities/meta-api';
import { asLocalizable } from 'yti-common-ui/utils/localization';
import { environment } from 'environments/environment';
import { KnownNode, Node, Referrer } from 'app/entities/node';
import { getOrCreate } from 'yti-common-ui/utils/map';

@Injectable()
export class MetaModelService {

  private metaCache = new Cache<string, GraphMeta>(graphMeta => graphMeta.graphId);
  private templates = new ReplaySubject<GraphMeta[]>();

  constructor(private http: TermedHttp) {

    const graphMetas$ = this.createAllGraphMetas().publishReplay(1).refCount();

    this.metaCache.init(graphMetas$);

    graphMetas$.subscribe(graphMetas => {
      this.templates.next(graphMetas.filter(graphMeta => graphMeta.template));
      this.templates.complete();
    });
  }

  getMeta(graphId: string): Observable<MetaModel> {
    return this.getGraphMeta(graphId).flatMap(graphMeta => this.createMetaModel(graphMeta));
  }

  getGraphMeta(graphId: string): Observable<GraphMeta> {

    return this.metaCache.getOrCreate(graphId, () =>
      this.getGraph(graphId).flatMap(graph => this.createGraphMeta(graph)));
  }

  private createAllGraphMetas(): Observable<GraphMeta[]> {
    return Observable.zip(this.getGraphs(), this.getAllMetaNodesByGraph())
      .map(([graphs, metaNodesByGraph]) => graphs.map(graph => MetaModelService.createGraphMetaFromNodeMetas(graph, metaNodesByGraph.get(graph.id) || [])));
  }

  private createGraphMeta(graph: Graph): Observable<GraphMeta> {
    return this.getMetaNodes(graph.id).map(nodeMetasInGraph =>
      MetaModelService.createGraphMetaFromNodeMetas(graph, nodeMetasInGraph));
  }

  private static createGraphMetaFromNodeMetas(graph: Graph, nodeMetasInGraph: NodeMetaInternal[]) {
    const template = graph.properties.type ? graph.properties.type[0].value === 'Metamodel' : false;
    const label = asLocalizable(graph.properties['prefLabel']);
    return new GraphMeta(graph.id, label, nodeMetasInGraph, template);
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
      return Observable.of(new MetaModel([graphMeta]));
    }

    return Observable.forkJoin(Array.from(externalGraphs).map(graph => this.getGraphMeta(graph)))
      .map(graphMetas => new MetaModel([graphMeta, ...graphMetas]));
  }

  getReferrersByMeta<N extends KnownNode | Node<any>>(referrer: Referrer): Observable<{ meta: ReferenceMeta, nodes: N[] }[]> {

    const referenceId = referrer.referenceId;

    function groupByMeta(nodes: N[]): { meta: ReferenceMeta, nodes: N[] }[] {

      const references = new Map<ReferenceMeta, N[]>();

      for (const node of nodes) {
        const referenceMeta = node.meta.getReference(referenceId);
        getOrCreate(references, referenceMeta, () => []).push(node);
      }

      return Array.from(references.entries()).map((entry => ({meta: entry[0], nodes: entry[1]})));
    }

    const referrerNodes = Observable.forkJoin(
      referrer.values.map(nodeExternal =>
        this.getMeta(nodeExternal.type.graph.id).map(meta =>
          Node.create(nodeExternal, meta, true) as N))
    );

    return referrerNodes.map(nodes => groupByMeta(nodes));
  }

  getMetaTemplates(): Observable<GraphMeta[]> {
    return this.templates.asObservable();
  }

  private getGraph(graphId: string): Observable<Graph> {
    return this.http.get(`${environment.api_url}/graphs/${graphId}`)
      .map(response => response.json() as Graph);
  }

  private getGraphs(): Observable<Graph[]> {
    return this.http.get(`${environment.api_url}/graphs`)
      .map(response => normalizeAsArray(response.json()) as Graph[]);
  }

  private getMetaNodes(graphId: string): Observable<NodeMetaInternal[]> {

    const params = new URLSearchParams();
    params.append('graphId', graphId);

    return this.http.get(`${environment.api_url}/types`, { params })
      .map(response => normalizeAsArray(response.json()) as NodeMetaInternal[]);
  }

  private getAllMetaNodesByGraph(): Observable<Map<string, NodeMetaInternal[]>> {
    return this.http.get(`${environment.api_url}/types`)
      .map(response => normalizeAsArray(response.json()) as NodeMetaInternal[])
      .map(allNodes => groupBy(allNodes, node => node.graph.id));
  }
}

class Cache<K, V> {

  private cache = new ReplaySubject<Map<K, V>>();

  constructor(private keyExtractor: (value: V) => K) {
  }

  init(values$: Observable<V[]>) {
    values$.subscribe(values => {
      this.cache.next(index(values, this.keyExtractor));
      this.cache.complete();
    });
  }

  update(value$: Observable<V>): Observable<V> {
    return Observable.zip(this.cache, value$)
      .do(([cache, value]) => cache.set(this.keyExtractor(value), value))
      .map(([cache, value]) => value);
  }

  remove(key$: Observable<K>): Observable<K> {
    return Observable.zip(this.cache, key$)
      .do(([cache, key]) => cache.delete(key))
      .map(([cache, key]) => key);
  }

  getOrCreate(key: K, create: () => Observable<V>): Observable<V> {
    return this.cache.flatMap(cache => {
      if (cache.has(key)) {
        return Observable.of(cache.get(key));
      } else {
        return create().do(value => cache.set(key, value));
      }
    });
  }
}

