import { URLSearchParams } from '@angular/http';
import { Observable, ReplaySubject } from 'rxjs';
import { normalizeAsArray, flatten } from '../utils/array';
import { Injectable } from '@angular/core';
import { TermedHttp } from './termed-http.service';
import { Graph } from '../entities/graph';
import { MetaModel } from '../entities/meta';
import { NodeMetaInternal } from '../entities/meta-api';
import { NodeType } from '../entities/node-api';
import { CollectionNode, ConceptNode, Node, VocabularyNode } from '../entities/node';
import { TranslateService } from 'ng2-translate';
import { LanguageService } from './language.service';

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
      .flatMap(graphs => Observable.forkJoin(graphs.map(graph => this.getMetaModels(graph.id))))
      .map(metaModels => new MetaModel(flatten(metaModels)))
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

    return Observable.zip(label$, this.createEmptyNode<ConceptNode, 'Concept'>(vocabulary.graphId, nodeId, 'Concept', vocabulary.languages))
      .map(([newConceptLabel, newConcept]) => {

        if (newConcept.hasVocabulary()) {
          newConcept.vocabulary = vocabulary.clone();
        }

        newConcept.setPrimaryLabel(this.languageService.language, newConceptLabel);

        return newConcept;
      });
  }

  createEmptyCollection(vocabulary: VocabularyNode, nodeId: string): Observable<CollectionNode> {

    const label = this.translateService.get('New collection');

    return Observable.zip(label, this.createEmptyNode<CollectionNode, 'Collection'>(vocabulary.graphId, nodeId, 'Collection', vocabulary.languages))
      .map(([newCollectionLabel, newCollection]) => {

        newCollection.setPrimaryLabel(this.languageService.language, newCollectionLabel);

        return newCollection;
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
