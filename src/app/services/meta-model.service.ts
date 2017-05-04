import { URLSearchParams } from '@angular/http';
import { Observable, ReplaySubject } from 'rxjs';
import { normalizeAsArray } from '../utils/array';
import { Injectable } from '@angular/core';
import { TermedHttp } from './termed-http.service';
import { Graph } from '../entities/graph';
import { GraphMeta, MetaModel } from '../entities/meta';
import { NodeMetaInternal } from '../entities/meta-api';
import { NodeType } from '../entities/node-api';
import { CollectionNode, ConceptNode, Node, VocabularyNode } from '../entities/node';
import { TranslateService } from 'ng2-translate';
import { LanguageService } from './language.service';
import { asLocalizable } from '../entities/localization';
import { environment } from '../../environments/environment';

const infiniteResultsParams = new URLSearchParams();
infiniteResultsParams.append('max', '-1');

const infiniteResultsOptions = { search: infiniteResultsParams };

@Injectable()
export class MetaModelService {

  private meta = new ReplaySubject<MetaModel>();

  constructor(private http: TermedHttp,
              private translateService: TranslateService,
              private languageService: LanguageService) {

    this.getGraphs()
      .flatMap(graphs => Observable.forkJoin(graphs.map(graph => Observable.zip(Observable.of(graph), this.getMetaNodes(graph.id)))))
      .map(graphAndNodes => {

        const meta = new Map<string, GraphMeta>();

        for (const [graph, nodeMetasInGraph] of graphAndNodes) {
          const template = graph.properties.type ? graph.properties.type[0].value === 'Metamodel' : false;
          const label = asLocalizable(graph.properties['prefLabel']);
          meta.set(graph.id, new GraphMeta(graph.id, label, nodeMetasInGraph, template));
        }

        return new MetaModel(meta);
      })
      .subscribe(meta => this.meta.next(meta));
  }

  getMeta(): Observable<MetaModel> {
    return this.meta.asObservable();
  }

  createEmptyNode<N extends Node<T>, T extends NodeType>(graphId: string, nodeId: string, nodeType: T, languages: string[]): Observable<N> {
    return this.meta.map(metaModel => metaModel.createEmptyNode<N, T>(graphId, nodeId, nodeType, languages));
  }

  createEmptyConcept(vocabulary: VocabularyNode, nodeId: string): Observable<ConceptNode> {

    const label$ = this.translateService.get('New concept');

    return Observable.zip(label$, this.meta).map(([newConceptLabel, meta]) => {
      return meta.createEmptyConcept(vocabulary, nodeId, newConceptLabel, this.languageService.language);
    });
  }

  createEmptyCollection(vocabulary: VocabularyNode, nodeId: string): Observable<CollectionNode> {

    const label$ = this.translateService.get('New collection');

    return Observable.zip(label$, this.meta).map(([newCollectionLabel, meta]) => {
      return meta.createEmptyCollection(vocabulary, nodeId, newCollectionLabel, this.languageService.language);
    });
  }

  updateMeta(graphMeta: GraphMeta): Observable<any> {

    const params = new URLSearchParams();
    params.append('batch', 'true');

    return this.http.post(`${environment.api_url}/graphs/${graphMeta.graphId}/types`, graphMeta.toNodes(), { search: params })
      .flatMap(() => this.addMeta(graphMeta));
  }

  removeGraphMeta(graphId: string): Observable<any> {
    return this.getMeta().flatMap(meta => this.removeMetaNodes(graphId, meta.getGraphMeta(graphId).toNodes()));
  }

  private addMeta(graphMeta: GraphMeta): Observable<any> {
    return this.meta.map(meta => meta.addMeta(graphMeta));
  }

  private removeMetaNodes(graphId: string, nodes: NodeMetaInternal[]) {

    const params = new URLSearchParams();
    params.append('batch', 'true');

    return this.http.delete(`${environment.api_url}/graphs/${graphId}/types`, { search: params, body: nodes });
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
