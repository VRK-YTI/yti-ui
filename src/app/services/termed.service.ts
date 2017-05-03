import { Injectable } from '@angular/core';
import { URLSearchParams, ResponseOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { TermedHttp } from './termed-http.service';
import { flatten, normalizeAsArray } from '../utils/array';
import { MetaModelService } from './meta-model.service';
import { NodeExternal, NodeType, NodeInternal, Identifier, VocabularyNodeType } from '../entities/node-api';
import { CollectionNode, ConceptNode, GroupNode, Node, OrganizationNode, VocabularyNode } from '../entities/node';
import * as moment from 'moment';
import { GraphMeta } from '../entities/meta';
import { Localizable } from '../entities/localization';
import { environment } from '../../environments/environment';

const infiniteResultsParams = new URLSearchParams();
infiniteResultsParams.append('max', '-1');

@Injectable()
export class TermedService {

  constructor(private http: TermedHttp, private metaModelService: MetaModelService) {
  }

  getVocabulary(graphId: string, languages: string[]): Observable<VocabularyNode> {
    return this.metaModelService.getMeta().flatMap(metaModel => {
      if (metaModel.graphHas(graphId, 'Vocabulary')) {
        return this.getVocabularyNode(graphId, 'Vocabulary')
          .map(vocabulary => Node.create(vocabulary, metaModel, languages, true));
      } else {
        return this.getVocabularyNode(graphId, 'TerminologicalVocabulary')
          .map(vocabulary => Node.create(vocabulary, metaModel, languages, true));
      }
    });
  }

  getVocabularyList(languages: string[]): Observable<VocabularyNode[]> {
    return Observable.zip(this.metaModelService.getMeta(), this.getVocabularyNodes('Vocabulary'), this.getVocabularyNodes('TerminologicalVocabulary'))
      .map(([meta, vocabularies, terminologicalVocabularies]) =>
        [...vocabularies, ...terminologicalVocabularies]
          .map(vocabulary => Node.create(vocabulary, meta, languages, true) as VocabularyNode));
  }

  getConcept(graphId: string, conceptId: string, languages: string[]): Observable<ConceptNode> {
    return Observable.zip(this.metaModelService.getMeta(), this.getConceptDetailsNode(graphId, conceptId))
      .map(([meta, concept]) => Node.create(concept, meta, languages, true));
  }

  findConcept(graphId: string, conceptId: string, languages: string[]): Observable<ConceptNode|null> {
    return Observable.zip(this.metaModelService.getMeta(), this.findConceptDetailsNode(graphId, conceptId))
      .map(([meta, concept]) => concept ? Node.create(concept, meta, languages, true) : null);
  }

  getConceptList(graphId: string, languages: string[]): Observable<ConceptNode[]> {
    return Observable.zip(this.metaModelService.getMeta(), this.getConceptListNodes(graphId))
      .map(([meta, concepts]) => concepts.map(concept => Node.create(concept, meta, languages, true)));
  }

  getCollection(graphId: string, conceptId: string, languages: string[]): Observable<CollectionNode> {
    return Observable.zip(this.metaModelService.getMeta(), this.getCollectionDetailsNode(graphId, conceptId))
      .map(([meta, collection]) => Node.create(collection, meta, languages, true));
  }

  findCollection(graphId: string, conceptId: string, languages: string[]): Observable<CollectionNode|null> {
    return Observable.zip(this.metaModelService.getMeta(), this.findCollectionDetailsNode(graphId, conceptId))
      .map(([meta, collection]) => collection ? Node.create(collection, meta, languages, true) : null);
  }

  getCollectionList(graphId: string, languages: string[]): Observable<CollectionNode[]> {
    return Observable.zip(this.metaModelService.getMeta(), this.getCollectionListNodes(graphId))
      .map(([meta, concepts]) => concepts.map(collection => Node.create(collection, meta, languages, true)));
  }

  getNarrowerConcepts(graphId: string, broaderConceptId: string, languages: string[]): Observable<ConceptNode[]> {
    return Observable.zip(this.metaModelService.getMeta(), this.getNarrowerConceptNodes(graphId, broaderConceptId))
      .map(([meta, concepts]) => concepts.map(concept => Node.create(concept, meta, languages, true)));
  }

  getOrganizationList(): Observable<OrganizationNode[]> {
    return Observable.zip(this.metaModelService.getMeta(), this.getNodeListWithoutReferencesOrReferrers('Organization'))
      .map(([meta, organizations]) => organizations.map(organization => Node.create(organization, meta, ['fi', 'en'], true)));
  }

  getGroupList(): Observable<GroupNode[]> {
    return Observable.zip(this.metaModelService.getMeta(), this.getNodeListWithoutReferencesOrReferrers('Group'))
      .map(([meta, organizations]) => organizations.map(organization => Node.create(organization, meta, ['fi', 'en'], true)));
  }

  createVocabulary(template: GraphMeta, vocabulary: VocabularyNode): Observable<Response> {

    const graphId = vocabulary.graphId;

    return this.createGraph(graphId, template.label)
      .flatMap(() => this.updateMeta(template.copyToGraph(graphId)))
      .flatMap(() => this.updateNode(vocabulary));
  }

  removeVocabulary(vocabulary: VocabularyNode): Observable<any> {

    const graphId = vocabulary.graphId;

    return this.removeGraphNodes(graphId)
      .flatMap(() => this.metaModelService.removeGraphMeta(graphId))
      .flatMap(() => this.removeGraph(graphId));
  }

  updateNode<T extends NodeType>(node: Node<T>) {

    node.lastModifiedDate = moment();

    const termNodes =
      flatten(Object.values(node.references)
        .filter(ref => ref.term)
        .map(ref => ref.values.map(term => term.toInternalNode()))
      );

    return this.updateUpdateInternalNodes([...termNodes, node.toInternalNode()]);
  }

  removeNode<T extends NodeType>(node: Node<T>) {

    const termIdentifiers =
      flatten(Object.values(node.references)
        .filter(ref => ref.term)
        .map(ref => ref.values.filter(term => term.persistent).map(term => term.identifier))
      );

    return this.removeNodeIdentifiers([...termIdentifiers, node.identifier]);
  }

  private removeGraphNodes(graphId: string): Observable<any> {
    // TODO all node ids should be enough or even api for forcing graph removal
    return this.getAllNodes(graphId).flatMap(nodes => this.removeNodeIdentifiers(nodes));
  }

  private removeGraph(graphId: string): Observable<any> {
    return this.http.delete(`/api/graphs/${graphId}`);
  }

  private createGraph(graphId: string, label: Localizable): Observable<Response> {
    return this.http.post(`/api/graphs`, {
      id: graphId,
      permissions: {},
      properties: {
        prefLabel: Object.entries(label).map(([lang, value]) => ({lang, value}))
      },
      roles: []
    });
  }

  private updateMeta(graphMeta: GraphMeta): Observable<any> {

    const params = new URLSearchParams();
    params.append('batch', 'true');

    return this.http.post(`${environment.api_url}/graphs/${graphMeta.graphId}/types`, graphMeta.toNodes(), { search: params })
      .flatMap(() => this.metaModelService.addMeta(graphMeta));
  }

  private removeNodeIdentifiers(nodeIds: Identifier<any>[]) {

    const params = new URLSearchParams();
    params.append('batch', 'true');
    params.append('sync', 'true');

    return this.http.delete(`${environment.api_url}/nodes`, { search: params, body: nodeIds });
  }

  private updateUpdateInternalNodes(nodes: NodeInternal<any>[]): Observable<Response> {

    const params = new URLSearchParams();
    params.append('batch', 'true');
    params.append('sync', 'true');

    return this.http.post(`${environment.api_url}/nodes`, nodes, { search: params });
  }

  private getVocabularyNode<T extends VocabularyNodeType>(graphId: string, type: T): Observable<NodeExternal<VocabularyNodeType>> {

    const params = new URLSearchParams();
    params.append('max', '-1');
    params.append('graphId', graphId);
    params.append('typeId', type);
    params.append('select.referrers', '');
    params.append('select.audit', 'true');

    return this.http.get(`${environment.api_url}/ext.json`, { search: params } )
      .map(response => requireSingle(response.json() as NodeExternal<VocabularyNodeType>));
  }

  private getVocabularyNodes<T extends VocabularyNodeType>(type: T): Observable<NodeExternal<T>[]> {

    const params = new URLSearchParams();
    params.append('max', '-1');
    params.append('typeId', type);
    params.append('select.references', 'publisher');
    params.append('select.references', 'inGroup');
    params.append('select.referrers', '');

    return this.http.get(`${environment.api_url}/ext.json`, { search: params } )
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

    return this.http.get(`${environment.api_url}/ext.json`, { search: params } )
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

    return this.http.get(`${environment.api_url}/ext.json`, { search: params } )
      .map(response => normalizeAsArray(response.json() as NodeExternal<'Concept'>[])).catch(notFoundAsDefault([]));
  }

  private getConceptDetailsNode(graphId: string, conceptId: string): Observable<NodeExternal<'Concept'>> {
    return this.conceptDetailsNodeRequest(graphId, conceptId)
      .map(response => requireSingle(response.json() as NodeExternal<'Concept'>));
  }


  private findConceptDetailsNode(graphId: string, conceptId: string): Observable<NodeExternal<'Concept'>|null> {
    return this.conceptDetailsNodeRequest(graphId, conceptId)
      .map(response => requireSingle(response.json() as NodeExternal<'Concept'>)).catch(notFoundAsDefault(null));
  }

  private conceptDetailsNodeRequest(graphId: string, conceptId: string): Observable<Response> {
    const params = new URLSearchParams();
    params.append('max', '-1');
    params.append('graphId', graphId);
    params.append('uri', 'urn:uuid:' + conceptId);
    params.append('recurse.references.prefLabelXl', '1');
    params.append('select.audit', 'true');

    return this.http.get(`${environment.api_url}/ext.json`, { search: params } );
  }

  private getCollectionListNodes(graphId: string): Observable<NodeExternal<'Collection'>[]> {

    const params = new URLSearchParams();
    params.append('max', '-1');
    params.append('graphId', graphId);
    params.append('typeId', 'Collection');
    params.append('select.properties', 'prefLabel');
    params.append('select.audit', 'true');

    return this.http.get(`${environment.api_url}/ext.json`, { search: params } )
      .map(response => normalizeAsArray(response.json() as NodeExternal<'Collection'>[])).catch(notFoundAsDefault([]));
  }

  private getCollectionDetailsNode(graphId: string, collectionId: string): Observable<NodeExternal<'Collection'>> {
    return this.collectionDetailsNodeRequest(graphId, collectionId)
      .map(response => requireSingle(response.json() as NodeExternal<'Collection'>));
  }

  private findCollectionDetailsNode(graphId: string, collectionId: string): Observable<NodeExternal<'Collection'>|null> {
    return this.collectionDetailsNodeRequest(graphId, collectionId)
      .map(response => requireSingle(response.json() as NodeExternal<'Collection'>)).catch(notFoundAsDefault(null));
  }

  private collectionDetailsNodeRequest(graphId: string, collectionId: string): Observable<Response> {
    const params = new URLSearchParams();
    params.append('max', '-1');
    params.append('graphId', graphId);
    params.append('uri', 'urn:uuid:' + collectionId);
    params.append('select.audit', 'true');
    params.append('recurse.references.prefLabelXl', '1');

    return this.http.get(`${environment.api_url}/ext.json`, { search: params } );
  }

  private getNodeListWithoutReferencesOrReferrers<T extends NodeType>(type: T): Observable<NodeExternal<T>[]> {

    const params = new URLSearchParams();
    params.append('max', '-1');
    params.append('typeId', type);
    params.append('select.references', '');
    params.append('select.referrers', '');

    return this.http.get(`${environment.api_url}/ext.json`, { search: params } )
      .map(response => normalizeAsArray(response.json() as NodeExternal<T>[])).catch(notFoundAsDefault([]));
  }

  private getAllNodes(graphId: string): Observable<NodeInternal<any>[]> {

    const params = new URLSearchParams();
    params.append('max', '-1');

    return this.http.get(`${environment.api_url}/graphs/${graphId}/nodes`, { search: params } )
      .map(response => normalizeAsArray(response.json() as NodeInternal<any>[])).catch(notFoundAsDefault([]));
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
