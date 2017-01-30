import { URLSearchParams } from '@angular/http';
import { Observable, ReplaySubject } from 'rxjs';
import { normalizeAsArray, flatten } from '../utils/array';
import { Injectable } from '@angular/core';
import { TermedHttp } from './termed-http.service';
import { isDefined, requireDefined } from '../utils/object';
import { Graph } from '../entities/graph';
import { NodeMeta } from '../entities/meta';
import { NodeMetaInternal } from '../entities/meta-api';

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

  getMetaForGraph(graphId: string): Observable<Map<string, NodeMeta>> {
    return this.meta.map(m => requireDefined(m.get(graphId)));
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

function getOrCreate<K, V>(map: Map<K, V>, key: K, create: () => V): V {

  const result = map.get(key);

  if (isDefined(result)) {
    return result;
  } else {
    const created = create();
    map.set(key, created);
    return created;
  }
}
