import { Injectable } from '@angular/core';
import { Response, ResponseOptionsArgs, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { TermedHttp } from './termed-http.service';
import { contains, flatten, normalizeAsArray } from 'yti-common-ui/utils/array';
import { MetaModelService } from './meta-model.service';
import { Identifier, NodeExternal, NodeInternal, NodeType, VocabularyNodeType } from 'app/entities/node-api';
import { CollectionNode, ConceptNode, GroupNode, Node, OrganizationNode, VocabularyNode } from 'app/entities/node';
import * as moment from 'moment';
import { environment } from 'environments/environment';
import { Graph } from 'app/entities/graph';
import { PrefixAndNamespace } from 'app/entities/prefix-and-namespace';
import { UserRequest } from 'app/entities/user-request';

@Injectable()
export class TermedService {

  constructor(private http: TermedHttp,
              private metaModelService: MetaModelService) {
  }

  getVocabulary(graphId: string): Observable<VocabularyNode> {
    return Observable.zip(this.metaModelService.getMeta(graphId), this.getVocabularyNode(graphId))
      .map(([meta, vocabulary]) => Node.create(vocabulary, meta, true));
  }

  getVocabularyList(): Observable<VocabularyNode[]> {
    return this.getVocabularyNodes()
      .flatMap(vocabularies =>
        Observable.forkJoin(vocabularies.map(vocabulary =>
            this.metaModelService.getMeta(vocabulary.type.graph.id)
              .map(metaModel => Node.create(vocabulary, metaModel, true) as VocabularyNode)
          )
        )
      );
  }

  getConcept(graphId: string, conceptId: string): Observable<ConceptNode> {
    return Observable.zip(this.metaModelService.getMeta(graphId), this.getConceptDetailsNode(graphId, conceptId))
      .map(([meta, concept]) => Node.create(concept, meta, true));
  }

  findConcept(graphId: string, conceptId: string): Observable<ConceptNode|null> {
    return Observable.zip(this.metaModelService.getMeta(graphId), this.findConceptDetailsNode(graphId, conceptId))
      .map(([meta, concept]) => concept ? Node.create(concept, meta, true) : null);
  }

  getCollection(graphId: string, collectionId: string): Observable<CollectionNode> {
    return Observable.zip(this.metaModelService.getMeta(graphId), this.getCollectionDetailsNode(graphId, collectionId))
      .map(([meta, collection]) => Node.create(collection, meta, true));
  }

  findCollection(graphId: string, collectionId: string): Observable<CollectionNode|null> {
    return Observable.zip(this.metaModelService.getMeta(graphId), this.findCollectionDetailsNode(graphId, collectionId))
      .map(([meta, collection]) => collection ? Node.create(collection, meta, true) : null);
  }

  getCollectionList(graphId: string): Observable<CollectionNode[]> {
    return Observable.zip(this.metaModelService.getMeta(graphId), this.getCollectionListNodes(graphId))
      .map(([meta, concepts]) => concepts.map(collection => Node.create(collection, meta, true)));
  }

  getOrganizationList(): Observable<OrganizationNode[]> {
    return this.getOrganizationListNodes()
      .flatMap(organizations =>
        Observable.forkJoin(organizations.map(organization =>
          this.metaModelService.getMeta(organization.type.graph.id)
            .map(metaModel => Node.create(organization, metaModel, true))
        ))
      );
  }

  getGroupList(): Observable<GroupNode[]> {
    return this.getGroupListNodes()
      .flatMap(groups =>
        Observable.forkJoin(groups.map(group =>
          this.metaModelService.getMeta(group.type.graph.id)
            .map(metaModel => Node.create(group, metaModel, true))
        ))
      );
  }

  createVocabulary(templateGraphId: string, vocabulary: VocabularyNode, prefix: string): Observable<string> {

    const params = new URLSearchParams();
    params.append('templateGraphId', templateGraphId);
    params.append('prefix', prefix);

    return this.http.post(`${environment.api_url}/vocabulary`, vocabulary.toInternalNode(), { params })
      .map(response => response.json());
  }

  removeVocabulary(graphId: string): Observable<any> {

    const params = new URLSearchParams();
    params.append('graphId', graphId);

    return this.http.delete(`${environment.api_url}/vocabulary`, { params });
  }

  saveNodes<T extends NodeType>(nodes: Node<T>[]): Observable<Response> {

    const inlineNodes =
      flatten(flatten(nodes.map(node => node.getAllReferences()))
        .filter(ref => ref.inline)
        .map(ref => ref.values.map(n => n.toInternalNode()))
      );

    return this.updateAndDeleteInternalNodes([...inlineNodes, ...nodes.map(node => node.toInternalNode())], []);
  }

  updateNode<T extends NodeType>(updatedNode: Node<T>, previousNode: Node<T>|null) {

    updatedNode.lastModifiedDate = moment();

    function inlineNodes(node: Node<any>) {
      return flatten(node.getAllReferences()
        .filter(ref => ref.inline)
        .map(ref => ref.values.map(n => n.toInternalNode()))
      );
    }

    function inlineNodeIds(node: Node<any>) {
      return flatten(node.getAllReferences()
        .filter(ref => ref.inline)
        .map(ref => ref.values.map(n => n.identifier))
      );
    }

    const updatedInlineNodes = inlineNodes(updatedNode);
    const previousInlineNodeIds  = previousNode ? inlineNodeIds(previousNode) : [];

    function nodeIdsAreEqual(left: Identifier<any>, right: Identifier<any>) {
      return left.id === right.id && left.type.id
        && left.type.id === right.type.id
        && left.type.graph.id === right.type.graph.id;
    }

    const deletedInlineNodeIds = previousInlineNodeIds.filter(id => !contains(updatedInlineNodes, id, nodeIdsAreEqual));

    return this.updateAndDeleteInternalNodes([...updatedInlineNodes, updatedNode.toInternalNode()], deletedInlineNodeIds);
  }

  removeNode<T extends NodeType>(node: Node<T>) {

    const inlineNodeIds =
      flatten(node.getAllReferences()
        .filter(ref => ref.inline)
        .map(ref => ref.values.filter(term => term.persistent).map(term => term.identifier))
      );

    return this.removeNodeIdentifiers([...inlineNodeIds, node.identifier], true, true);
  }

  isNamespaceInUse(prefix: string): Observable<boolean> {

    const params = new URLSearchParams();
    params.append('prefix', prefix);

    return this.http.get(`${environment.api_url}/namespaceInUse`, { params } )
      .map(response => response.json() as boolean);
  }

  getNamespaceRoot(): Observable<string> {
    return this.http.get(`${environment.api_url}/namespaceRoot`)
      .map(response => response.text());
  }

  getGraphNamespace(graphId: string): Observable<PrefixAndNamespace> {
    return this.http.get(`${environment.api_url}/graphs/${graphId}`)
      .map(response => {
        const graph = response.json() as Graph;
        return {
          prefix: graph.code,
          namespace: graph.uri
        };
      })
  }

  getUserRequests(): Observable<UserRequest[]> {
    return this.http.get(`${environment.api_url}/requests`)
      .map(response => response.json() as UserRequest[]);
  }

  sendRequest(organizationId: string): Observable<Response> {

    const params = new URLSearchParams();
    params.append('organizationId', organizationId);

    return this.http.post(`${environment.api_url}/request`, null, { params } );
  }

  getFakeableUsers(): Observable<{ email: string, firstName: string, lastName: string }[]> {
    return this.http.get(`${environment.api_url}/fakeableUsers`)
      .map(response => response.json());
  }

  private removeNodeIdentifiers(nodeIds: Identifier<any>[], sync: boolean, disconnect: boolean) {

    const params = new URLSearchParams();
    params.append('sync', sync.toString());
    params.append('disconnect', disconnect.toString());

    return this.http.delete(`${environment.api_url}/remove`, { params, body: nodeIds });
  }

  private updateAndDeleteInternalNodes(toUpdate: NodeInternal<any>[], toDelete: Identifier<any>[]): Observable<Response> {

    const body = {
      'delete': toDelete,
      'save': toUpdate
    };

    return this.http.post(`${environment.api_url}/modify`, body);
  }

  private getVocabularyNode<T extends VocabularyNodeType>(graphId: string): Observable<NodeExternal<VocabularyNodeType>> {

    const params = new URLSearchParams();
    params.append('graphId', graphId);

    return this.http.get(`${environment.api_url}/vocabulary`, { params } )
      .map(response => requireSingle(response.json() as NodeExternal<VocabularyNodeType>));
  }

  private getVocabularyNodes<T extends VocabularyNodeType>(): Observable<NodeExternal<T>[]> {
    return this.http.get(`${environment.api_url}/vocabularies`)
      .map(response => normalizeAsArray(response.json() as NodeExternal<VocabularyNodeType>));
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
    params.append('graphId', graphId);
    params.append('conceptId', conceptId);

    return this.http.get(`${environment.api_url}/concept`, { params } );
  }

  private getCollectionListNodes(graphId: string): Observable<NodeExternal<'Collection'>[]> {

    const params = new URLSearchParams();
    params.append('graphId', graphId);

    return this.http.get(`${environment.api_url}/collections`, { params } )
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
    params.append('graphId', graphId);
    params.append('collectionId', collectionId);

    return this.http.get(`${environment.api_url}/collection`, { params } );
  }

  private getGroupListNodes(): Observable<NodeExternal<'Group'>[]> {
    return this.http.get(`${environment.api_url}/groups`)
      .map(response => normalizeAsArray(response.json() as NodeExternal<'Group'>)).catch(notFoundAsDefault([]));
  }

  private getOrganizationListNodes(): Observable<NodeExternal<'Organization'>[]> {
    return this.http.get(`${environment.api_url}/organizations`)
      .map(response => normalizeAsArray(response.json() as NodeExternal<'Organization'>)).catch(notFoundAsDefault([]));
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
  return responseCodeAsDefault(404, defaultValue);
}

function responseCodeAsDefault<T>(responseCode: number, defaultValue: T) {
  return (error: ResponseOptionsArgs, observable: Observable<T>) => {
    if (error.status = responseCode) {
      return Observable.of(defaultValue);
    } else {
      return observable;
    }
  }
}
