import { Injectable } from '@angular/core';
import { URLSearchParams, ResponseOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { TermedHttp } from './termed-http.service';
import { flatten, normalizeAsArray } from '../utils/array';
import { MetaModelService } from './meta-model.service';
import { NodeExternal, NodeType, NodeInternal, Identifier, VocabularyNodeType } from '../entities/node-api';
import { Node } from '../entities/node';
import * as moment from 'moment';

const infiniteResultsParams = new URLSearchParams();
infiniteResultsParams.append('max', '-1');

@Injectable()
export class TermedService {

  constructor(private http: TermedHttp, private metaModelService: MetaModelService) {
  }

  getVocabulary(graphId: string, languages: string[]): Observable<Node<VocabularyNodeType>> {

    const vocabulary: Observable<NodeExternal<VocabularyNodeType>|null> =
      Observable.forkJoin([
        this.getVocabularyNode(graphId, 'Vocabulary').catch(notFoundAsDefault(null)),
        this.getVocabularyNode(graphId, 'TerminologicalVocabulary').catch(notFoundAsDefault(null))
      ], (vocabulary, terminologicalVocabulary) => vocabulary || terminologicalVocabulary);

    return Observable.zip(this.metaModelService.getMeta(), vocabulary)
      .map(([meta, vocabulary]) => {
        if (!vocabulary) {
          throw new Error('Vocabulary not found for graph: ' + graphId);
        }
        return new Node<VocabularyNodeType>(vocabulary, meta, languages)
      });
  }

  getVocabularyList(languages: string[]): Observable<Node<VocabularyNodeType>[]> {
    return Observable.zip(this.metaModelService.getMeta(), this.getVocabularyNodes('Vocabulary'), this.getVocabularyNodes('TerminologicalVocabulary'))
      .map(([meta, vocabularies, terminologicalVocabularies]) =>
      [...vocabularies, ...terminologicalVocabularies].map(vocabulary => new Node<VocabularyNodeType>(vocabulary, meta, languages))
          .filter(scheme => !scheme.references['inGroup'].empty));
  }

  getConcept(graphId: string, conceptId: string, languages: string[]): Observable<Node<'Concept'>> {
    return Observable.zip(this.metaModelService.getMeta(), this.getConceptDetailsNode(graphId, conceptId))
      .map(([meta, concept]) => new Node(concept, meta, languages));
  }

  getConceptList(graphId: string, languages: string[]): Observable<Node<'Concept'>[]> {
    return Observable.zip(this.metaModelService.getMeta(), this.getConceptListNodes(graphId))
      .map(([meta, concepts]) => concepts.map(concept => new Node<'Concept'>(concept, meta, languages)));
  }

  getNarrowerConcepts(graphId: string, broaderConceptId: string, languages: string[]): Observable<Node<'Concept'>[]> {
    return Observable.zip(this.metaModelService.getMeta(), this.getNarrowerConceptNodes(graphId, broaderConceptId))
      .map(([meta, concepts]) => concepts.map(concept => new Node<'Concept'>(concept, meta, languages)));
  }

  updateNode<T extends NodeType>(node: Node<T>) {

    node.lastModifiedDate = moment();

    const termNodes =
      flatten(Object.values(node.references)
        .filter(ref => ref.term)
        .map(ref => ref.values.map(term => term.toInternalNode()))
      );

    return this.updateUpdateInternalNodes([...termNodes, node.toInternalNode()])
      .delay(1000); // FIXME Remove delay when api supports blocking modifications
  }

  removeNode<T extends NodeType>(node: Node<T>) {

    const termIdentifiers =
      flatten(Object.values(node.references)
        .filter(ref => ref.term)
        .map(ref => ref.values.map(term => term.identifier))
      );

    return this.removeNodeIdentifiers([...termIdentifiers, node.identifier]);
  }

  private removeNodeIdentifiers(nodeIds: Identifier<any>[]) {

    const params = new URLSearchParams();
    params.append('batch', 'true');

    return this.http.delete('/api/nodes', {
      search: params,
      body: nodeIds
    });
  }

  private updateUpdateInternalNodes(nodes: NodeInternal<any>[]): Observable<Response> {

    const params = new URLSearchParams();
    params.append('batch', 'true');

    return this.http.post('/api/nodes', nodes, { search: params });
  }

  private getVocabularyNode<T extends VocabularyNodeType>(graphId: string, type: T): Observable<NodeExternal<VocabularyNodeType>> {

    const params = new URLSearchParams();
    params.append('max', '-1');
    params.append('graphId', graphId);
    params.append('typeId', type);
    params.append('select.referrers', '');
    params.append('select.audit', 'true');

    return this.http.get(`/api/ext.json`, { search: params } )
      .map(response => requireSingle(response.json() as NodeExternal<VocabularyNodeType>));
  }

  private getVocabularyNodes<T extends VocabularyNodeType>(type: T): Observable<NodeExternal<T>[]> {

    const params = new URLSearchParams();
    params.append('max', '-1');
    params.append('typeId', type);
    params.append('select.references', 'publisher');
    params.append('select.references', 'inGroup');
    params.append('select.referrers', '');

    return this.http.get(`/api/ext.json`, { search: params } )
      .map(response => normalizeAsArray(response.json() as NodeExternal<T>[])).catch(notFoundAsDefault([]));
  }

  private getConceptListNodes(graphId: string): Observable<NodeExternal<'Concept'>[]> {

    const params = new URLSearchParams();
    params.append('max', '-1');
    params.append('graphId', graphId);
    params.append('typeId', 'Concept');
    params.append('select.referrers', 'broader');
    params.append('select.references', 'broader');
    params.append('select.references', 'prefLabelXl');
    params.append('select.properties', 'prefLabel');
    params.append('select.properties', 'status');
    params.append('select.properties', 'definition');
    params.append('select.audit', 'true');

    return this.http.get(`/api/ext.json`, { search: params } )
      .map(response => normalizeAsArray(response.json() as NodeExternal<'Concept'>[])).catch(notFoundAsDefault([]));
  }

  private getNarrowerConceptNodes(graphId: string, broaderConceptId: string): Observable<NodeExternal<'Concept'>[]> {

    const params = new URLSearchParams();
    params.append('max', '-1');
    params.append('graphId', graphId);
    params.append('typeId', 'Concept');
    params.append('recurse.referrers.broader', '1');
    params.append('recurse.references.prefLabelXl', '1');
    params.append('select.references', 'prefLabelXl');
    params.append('select.properties', 'prefLabel');
    params.append('select.properties', 'status');
    params.append('select.properties', 'definition');
    params.append('select.referrers', 'broader');
    params.append('where.references.broader', broaderConceptId);

    return this.http.get(`/api/ext.json`, { search: params } )
      .map(response => normalizeAsArray(response.json() as NodeExternal<'Concept'>[])).catch(notFoundAsDefault([]));
  }

  private getConceptDetailsNode(graphId: string, conceptId: string): Observable<NodeExternal<'Concept'>> {

    const params = new URLSearchParams();
    params.append('max', '-1');
    params.append('graphId', graphId);
    params.append('uri', 'urn:uuid:' + conceptId);
    params.append('recurse.references.prefLabelXl', '1');
    params.append('select.audit', 'true');

    return this.http.get(`/api/ext.json`, { search: params } )
      .map(response => requireSingle(response.json() as NodeExternal<'Concept'>));
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
