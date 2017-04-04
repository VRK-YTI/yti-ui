import { URLSearchParams } from '@angular/http';
import { Observable, ReplaySubject } from 'rxjs';
import { normalizeAsArray, flatten } from '../utils/array';
import { Injectable } from '@angular/core';
import { TermedHttp } from './termed-http.service';
import { requireDefined } from '../utils/object';
import { Graph } from '../entities/graph';
import { NodeMeta } from '../entities/meta';
import { NodeMetaInternal } from '../entities/meta-api';
import { NodeType } from '../entities/node-api';
import { Node } from '../entities/node';
import { getOrCreate } from '../utils/map';

const infiniteResultsParams = new URLSearchParams();
infiniteResultsParams.append('max', '-1');

const infiniteResultsOptions = { search: infiniteResultsParams };

@Injectable()
export class MetaModelService {

  meta = new ReplaySubject<Map<string, Map<string, NodeMeta>>>();

  constructor(private http: TermedHttp) {

    this.getGraphs()
      .flatMap(graphs => Observable.forkJoin(graphs.map(graph => this.getMetaModels(graph.id))))
      .map(metaModels => {

        const metaNodeMap = new Map<string, Map<string, NodeMeta>>();

        for (const metaNode of flatten(metaModels)) {
          getOrCreate(metaNodeMap, metaNode.graph.id, () => new Map<string, NodeMeta>())
            .set(metaNode.id, new NodeMeta(metaNode));
        }

        return metaNodeMap;
      })
      .subscribe(meta => this.meta.next(meta));
  }

  getMeta(): Observable<Map<string, Map<string, NodeMeta>>> {
    return this.meta;
  }

  createEmptyNode<N extends Node<T>, T extends NodeType>(graphId: string, nodeId: string, nodeType: T, languages: string[]): Observable<N> {
    return this.meta.map(metas => {
      const graphMeta = requireDefined(metas.get(graphId), 'Graph not found: '+ graphId);
      const conceptMeta = requireDefined(graphMeta.get(nodeType), 'Node type not found: ' + nodeType);
      const node = Node.create(conceptMeta.createEmptyNode(nodeId), metas, languages);
      node.persistent = false;
      return node;
    });
  }

  private getGraphs(): Observable<Graph[]> {
    return this.http.get('/api/graphs', infiniteResultsOptions)
      .map(response => normalizeAsArray(response.json()) as Graph[]);
  }

  private getMetaModels(graphId: string): Observable<NodeMetaInternal[]> {
    return this.http.get(`/api/graphs/${graphId}/types`, infiniteResultsOptions)
      .map(response => normalizeAsArray(response.json()) as NodeMetaInternal[]);
  }
}
