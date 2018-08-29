import { Observable, ReplaySubject, of, forkJoin, zip } from 'rxjs';
import { map, flatMap, publishReplay, refCount, tap } from 'rxjs/operators';
import { groupBy, index, normalizeAsArray } from 'yti-common-ui/utils/array';
import { Injectable } from '@angular/core';
import { Graph } from 'app/entities/graph';
import { GraphMeta, MetaModel, ReferenceMeta } from 'app/entities/meta';
import { NodeMetaInternal } from 'app/entities/meta-api';
import { asLocalizable } from 'yti-common-ui/utils/localization';
import { KnownNode, Node, Referrer } from 'app/entities/node';
import { getOrCreate } from 'yti-common-ui/utils/map';
import { apiUrl } from 'app/config';
import { HttpClient } from '@angular/common/http';
import { requireDefined } from 'yti-common-ui/utils/object';

@Injectable()
export class MetaModelService {

  private metaCache = new Cache<string, GraphMeta>(graphMeta => graphMeta.graphId);
  private templates = new ReplaySubject<GraphMeta[]>();

  constructor(private http: HttpClient) {

    const graphMetas$ = this.createAllGraphMetas().pipe(publishReplay(1), refCount());

    this.metaCache.init(graphMetas$);

    graphMetas$.subscribe(graphMetas => {
      this.templates.next(graphMetas.filter(graphMeta => graphMeta.template));
      this.templates.complete();
    });
  }

  getMeta(graphId: string): Observable<MetaModel> {
    return this.getGraphMeta(graphId).pipe(flatMap(graphMeta => this.createMetaModel(graphMeta)));
  }

  getGraphMeta(graphId: string): Observable<GraphMeta> {

    return this.metaCache.getOrCreate(graphId, () =>
      this.getGraph(graphId).pipe(flatMap(graph => this.createGraphMeta(graph))));
  }

  private createAllGraphMetas(): Observable<GraphMeta[]> {
    return zip(this.getGraphs(), this.getAllMetaNodesByGraph())
      .pipe(map(([graphs, metaNodesByGraph]) =>
        graphs.map(graph => MetaModelService.createGraphMetaFromNodeMetas(graph, metaNodesByGraph.get(graph.id) || []))));
  }

  private createGraphMeta(graph: Graph): Observable<GraphMeta> {
    return this.getMetaNodes(graph.id).pipe(map(nodeMetasInGraph =>
      MetaModelService.createGraphMetaFromNodeMetas(graph, nodeMetasInGraph)));
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
      return of(new MetaModel([graphMeta]));
    }

    return forkJoin(Array.from(externalGraphs).map(graph => this.getGraphMeta(graph)))
      .pipe(map(graphMetas => new MetaModel([graphMeta, ...graphMetas])));
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

    const referrerNodes = forkJoin(
      referrer.values.map(nodeExternal =>
        this.getMeta(nodeExternal.type.graph.id).pipe(map(meta =>
          Node.create(nodeExternal, meta, true) as N)))
    );

    return referrerNodes.pipe(map(nodes => groupByMeta(nodes)));
  }

  getMetaTemplates(): Observable<GraphMeta[]> {
    return this.templates.asObservable();
  }

  private getGraph(graphId: string): Observable<Graph> {
    return this.http.get<Graph>(`${apiUrl}/graphs/${graphId}`);
  }

  private getGraphs(): Observable<Graph[]> {
    return this.http.get<Graph[]>(`${apiUrl}/graphs`)
      .pipe(map(normalizeAsArray));
  }

  private getMetaNodes(graphId: string): Observable<NodeMetaInternal[]> {

    const params = {
      graphId
    };

    return this.http.get<NodeMetaInternal[]>(`${apiUrl}/types`, { params })
      .pipe(map(normalizeAsArray));
  }

  private getAllMetaNodesByGraph(): Observable<Map<string, NodeMetaInternal[]>> {
    return this.http.get<NodeMetaInternal[]>(`${apiUrl}/types`)
      .pipe(
        map(normalizeAsArray),
        map(allNodes => groupBy(allNodes, node => node.graph.id))
      );
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
    return zip(this.cache, value$)
      .pipe(
        tap(([cache, value]) => cache.set(this.keyExtractor(value), value)),
        map(([cache, value]) => value)
      );
  }

  remove(key$: Observable<K>): Observable<K> {
    return zip(this.cache, key$)
      .pipe(
        tap(([cache, key]) => cache.delete(key)),
        map(([cache, key]) => key)
      );
  }

  getOrCreate(key: K, create: () => Observable<V>): Observable<V> {
    return this.cache.pipe(flatMap(cache => {
      if (cache.has(key)) {
        return of(requireDefined(cache.get(key)));
      } else {
        return create().pipe(tap(value => cache.set(key, value)));
      }
    }));
  }
}

