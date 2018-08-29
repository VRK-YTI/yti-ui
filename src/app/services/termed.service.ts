import { Injectable } from '@angular/core';
import { Observable, of, zip, forkJoin } from 'rxjs';
import { map, flatMap, catchError } from 'rxjs/operators';
import { contains, flatten, normalizeAsArray } from 'yti-common-ui/utils/array';
import { MetaModelService } from './meta-model.service';
import { Identifier, NodeExternal, NodeInternal, NodeType, VocabularyNodeType } from 'app/entities/node-api';
import { CollectionNode, ConceptNode, GroupNode, Node, OrganizationNode, VocabularyNode } from 'app/entities/node';
import * as moment from 'moment';
import { Graph } from 'app/entities/graph';
import { PrefixAndNamespace } from 'app/entities/prefix-and-namespace';
import { UserRequest } from 'app/entities/user-request';
import { apiUrl } from 'app/config';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Injectable()
export class TermedService {

  constructor(private http: HttpClient,
              private metaModelService: MetaModelService) {
  }

  getVocabulary(graphId: string): Observable<VocabularyNode> {
    return zip(this.metaModelService.getMeta(graphId), this.getVocabularyNode(graphId))
      .pipe(map(([meta, vocabulary]) => Node.create(vocabulary, meta, true) as VocabularyNode));
  }

  getVocabularyList(): Observable<VocabularyNode[]> {
    return this.getVocabularyNodes()
      .pipe(flatMap(vocabularies => {

          // necessary optimization since forkJoin doesn't ever complete with empty observables array
          if (vocabularies.length === 0) {
            return of([]);
          }

          return forkJoin(vocabularies.map(vocabulary =>
              this.metaModelService.getMeta(vocabulary.type.graph.id)
                .pipe(map(metaModel => Node.create(vocabulary, metaModel, true) as VocabularyNode))
            )
          );
        }
      ));
  }

  getConcept(graphId: string, conceptId: string): Observable<ConceptNode> {
    return zip(this.metaModelService.getMeta(graphId), this.getConceptDetailsNode(graphId, conceptId))
      .pipe(map(([meta, concept]) => Node.create(concept, meta, true) as ConceptNode));
  }

  findConcept(graphId: string, conceptId: string): Observable<ConceptNode|null> {
    return zip(this.metaModelService.getMeta(graphId), this.findConceptDetailsNode(graphId, conceptId))
      .pipe(map(([meta, concept]) => concept ? Node.create(concept, meta, true) as ConceptNode : null));
  }

  getCollection(graphId: string, collectionId: string): Observable<CollectionNode> {
    return zip(this.metaModelService.getMeta(graphId), this.getCollectionDetailsNode(graphId, collectionId))
      .pipe(map(([meta, collection]) => Node.create(collection, meta, true) as CollectionNode));
  }

  findCollection(graphId: string, collectionId: string): Observable<CollectionNode|null> {
    return zip(this.metaModelService.getMeta(graphId), this.findCollectionDetailsNode(graphId, collectionId))
      .pipe(map(([meta, collection]) => collection ? Node.create(collection, meta, true) as CollectionNode : null));
  }

  getCollectionList(graphId: string): Observable<CollectionNode[]> {
    return zip(this.metaModelService.getMeta(graphId), this.getCollectionListNodes(graphId))
      .pipe(map(([meta, concepts]) => concepts.map(collection => Node.create(collection, meta, true) as CollectionNode)));
  }

  getOrganizationList(): Observable<OrganizationNode[]> {
    return this.getOrganizationListNodes()
      .pipe(flatMap(organizations =>
        forkJoin(organizations.map(organization =>
          this.metaModelService.getMeta(organization.type.graph.id)
            .pipe(map(metaModel => Node.create(organization, metaModel, true) as OrganizationNode))
        ))
      ));
  }

  getGroupList(): Observable<GroupNode[]> {
    return this.getGroupListNodes()
      .pipe(flatMap(groups =>
        forkJoin(groups.map(group =>
          this.metaModelService.getMeta(group.type.graph.id)
            .pipe(map(metaModel => Node.create(group, metaModel, true) as GroupNode))
        ))
      ));
  }

  createVocabulary(templateGraphId: string, vocabulary: VocabularyNode, prefix: string): Observable<string> {

    const params = {
      'templateGraphId': templateGraphId,
      'prefix': prefix
    };

    return this.http.post<string>(`${apiUrl}/vocabulary`, vocabulary.toInternalNode(), { params });
  }

  removeVocabulary(graphId: string): Observable<any> {

    const params = {
      'graphId': graphId
    };

    return this.http.delete(`${apiUrl}/vocabulary`, { params });
  }

  saveNodes<T extends NodeType>(nodes: Node<T>[]): Observable<HttpResponse<any>> {

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

    const params = {
      'prefix': prefix
    };

    return this.http.get<boolean>(`${apiUrl}/namespaceInUse`, { params } );
  }

  getNamespaceRoot(): Observable<string> {
    return this.http.get(`${apiUrl}/namespaceRoot`, {
      observe: 'body',
      responseType: 'text'
    });
  }

  getGraphNamespace(graphId: string): Observable<PrefixAndNamespace> {
    return this.http.get<Graph>(`${apiUrl}/graphs/${graphId}`, { observe: 'body'})
      .pipe(map(graph => {
        return {
          prefix: graph.code,
          namespace: graph.uri
        };
      }));
  }

  getUserRequests(): Observable<UserRequest[]> {
    return this.http.get<UserRequest[]>(`${apiUrl}/requests`);
  }

  sendRequest(organizationId: string): Observable<HttpResponse<any>> {

    const params = {
      'organizationId': organizationId
    };

    return this.http.post(`${apiUrl}/request`, null, {
      params,
      observe: 'response'
    });
  }

  getFakeableUsers() {
    return this.http.get<{ email: string, firstName: string, lastName: string }[]>(`${apiUrl}/fakeableUsers`);
  }

  getGroupManagementUrl(): Observable<string> {
    return this.http.get(`${apiUrl}/groupManagementUrl`, {
      observe: 'body',
      responseType: 'text'
    });
  }

  private removeNodeIdentifiers(nodeIds: Identifier<any>[], sync: boolean, disconnect: boolean) {

    const params = {
      'sync': sync.toString(),
      'disconnect': disconnect.toString()
    };

    return this.http.request('DELETE', `${apiUrl}/remove`, {
      params,
      body: nodeIds
    });
  }

  private updateAndDeleteInternalNodes(toUpdate: NodeInternal<any>[], toDelete: Identifier<any>[]): Observable<HttpResponse<any>> {

    const body = {
      'delete': toDelete,
      'save': toUpdate
    };

    return this.http.post<any>(`${apiUrl}/modify`, body, { observe: 'response' });
  }

  private getVocabularyNode(graphId: string): Observable<NodeExternal<VocabularyNodeType>> {

    const params = {
      'graphId': graphId
    };

    return this.http.get<NodeExternal<VocabularyNodeType>[]>(`${apiUrl}/vocabulary`, { params } )
      .pipe(map(requireSingle));
  }

  private getVocabularyNodes(): Observable<NodeExternal<VocabularyNodeType>[]> {
    return this.http.get<NodeExternal<VocabularyNodeType>[]>(`${apiUrl}/vocabularies`)
      .pipe(map(normalizeAsArray));
  }

  private getConceptDetailsNode(graphId: string, conceptId: string): Observable<NodeExternal<'Concept'>> {
    const params = {
      'graphId': graphId,
      'conceptId': conceptId
    };

    return this.http.get<NodeExternal<'Concept'>[]>(`${apiUrl}/concept`, { params } )
      .pipe(map(requireSingle));
  }


  private findConceptDetailsNode(graphId: string, conceptId: string): Observable<NodeExternal<'Concept'>|null> {
    return this.getConceptDetailsNode(graphId, conceptId)
      .pipe(catchError(notFoundAsDefault(null)));
  }

  private getCollectionListNodes(graphId: string): Observable<NodeExternal<'Collection'>[]> {

    const params = {
      'graphId': graphId
    };

    return this.http.get<NodeExternal<'Collection'>[]>(`${apiUrl}/collections`, { params } )
      .pipe(
        map(normalizeAsArray),
        catchError(notFoundAsDefault([]))
      );
  }

  private getCollectionDetailsNode(graphId: string, collectionId: string): Observable<NodeExternal<'Collection'>> {

    const params = {
      'graphId': graphId,
      'collectionId': collectionId
    };

    return this.http.get<NodeExternal<'Collection'>>(`${apiUrl}/collection`, { params } )
      .pipe(map(requireSingle));
  }

  private findCollectionDetailsNode(graphId: string, collectionId: string): Observable<NodeExternal<'Collection'>|null> {
    return this.getCollectionDetailsNode(graphId, collectionId)
      .pipe(catchError(notFoundAsDefault(null)));
  }

  private getGroupListNodes(): Observable<NodeExternal<'Group'>[]> {
    return this.http.get(`${apiUrl}/groups`)
      .pipe(
        map(normalizeAsArray),
        catchError(notFoundAsDefault([]))
      );
  }

  private getOrganizationListNodes(): Observable<NodeExternal<'Organization'>[]> {
    return this.http.get(`${apiUrl}/organizations`)
      .pipe(map(normalizeAsArray),
        catchError(notFoundAsDefault([]))
      );
  }
}

function requireSingle<T>(json: T|T[]): T {
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
  return (error: HttpErrorResponse, observable: Observable<T>) => {
    if (error.status === responseCode) {
      return of(defaultValue);
    } else {
      return observable;
    }
  };
}
