import { Injectable } from '@angular/core';
import { URLSearchParams, ResponseOptionsArgs, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { TermedHttp, UserCredentials } from './termed-http.service';
import { anyMatching, flatten, normalizeAsArray } from '../utils/array';
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

  checkCredentials(credentials: UserCredentials): Observable<boolean> {

    const options = { headers: new Headers() };

    TermedHttp.addAuthorizationHeader(options.headers, credentials);

    // uses an arbitrary url for checking authentication
    return this.http.get(`${environment.api_url}/graphs`, options)
      .map(() => true)
      .catch(unauthorizedAsFalse);
  }

  getVocabulary(graphId: string): Observable<VocabularyNode> {
    return this.metaModelService.getMeta(graphId).flatMap(metaModel => {
      if (metaModel.graphHas(graphId, 'Vocabulary')) {
        return this.getVocabularyNode(graphId, 'Vocabulary')
          .map(vocabulary => Node.create(vocabulary, metaModel, true));
      } else {
        return this.getVocabularyNode(graphId, 'TerminologicalVocabulary')
          .map(vocabulary => Node.create(vocabulary, metaModel, true));
      }
    });
  }

  getVocabularyList(): Observable<VocabularyNode[]> {
    return Observable.zip(this.getVocabularyNodes('Vocabulary'), this.getVocabularyNodes('TerminologicalVocabulary'))
      .flatMap(([vocabularies, terminologicalVocabularies]) =>
        Observable.forkJoin([...vocabularies, ...terminologicalVocabularies]
          .map(vocabulary =>
            this.metaModelService.getMeta(vocabulary.type.graph.id)
              .map(metaModel => Node.create(vocabulary, metaModel, true) as VocabularyNode))
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
    return this.getNodeListWithoutReferencesOrReferrers('Organization')
      .flatMap(organizations =>
        Observable.forkJoin(organizations.map(organization =>
          this.metaModelService.getMeta(organization.type.graph.id)
            .map(metaModel => Node.create(organization, metaModel, true))
        ))
      );
  }

  getGroupList(): Observable<GroupNode[]> {
    return this.getNodeListWithoutReferencesOrReferrers('Group')
      .flatMap(groups =>
        Observable.forkJoin(groups.map(group =>
          this.metaModelService.getMeta(group.type.graph.id)
            .map(metaModel => Node.create(group, metaModel, true))
        ))
      );
  }

  createVocabulary(template: GraphMeta, vocabulary: VocabularyNode): Observable<Response> {

    const graphId = vocabulary.graphId;

    return this.createGraph(graphId, template.label)
      .flatMap(() => this.metaModelService.updateMeta(template.copyToGraph(graphId)))
      .flatMap(() => this.updateNode(vocabulary, null));
  }

  removeVocabulary(vocabulary: VocabularyNode): Observable<any> {

    const graphId = vocabulary.graphId;

    return this.removeGraphNodes(graphId)
      .flatMap(() => this.metaModelService.removeGraphMeta(graphId))
      .flatMap(() => this.removeGraph(graphId));
  }

  updateNode<T extends NodeType>(node: Node<T>, previous: Node<T>|null) {

    node.lastModifiedDate = moment();

    const inlineNodes =
      flatten(Object.values(node.references)
        .filter(ref => ref.inline)
        .map(ref => ref.values.map(node => node.toInternalNode()))
      );

    function resolveDeletedInlineReferenceIds() {

      if (!previous) {
        return [];
      } else {
        return flatten(Object.values(previous.references)
          .filter(ref => ref.inline)
          .map(ref => ref.values.map(term => term.identifier)))
          .filter(id => !anyMatching(inlineNodes, inlineNode => inlineNode.id === id));
      }
    }

    return this.updateAndDeleteInternalNodes([...inlineNodes, node.toInternalNode()], resolveDeletedInlineReferenceIds());
  }

  removeNode<T extends NodeType>(node: Node<T>) {

    const inlineNodeIds =
      flatten(Object.values(node.references)
        .filter(ref => ref.inline)
        .map(ref => ref.values.filter(term => term.persistent).map(term => term.identifier))
      );

    return this.removeNodeIdentifiers([...inlineNodeIds, node.identifier], true);
  }

  private removeGraphNodes(graphId: string): Observable<any> {
    return this.getAllNodeIds(graphId).flatMap(nodeIds => this.removeNodeIdentifiers(nodeIds, false));
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

  private removeNodeIdentifiers(nodeIds: Identifier<any>[], sync: boolean) {

    const params = new URLSearchParams();
    params.append('batch', 'true');
    params.append('sync', sync.toString());

    return this.http.delete(`${environment.api_url}/nodes`, { search: params, body: nodeIds });
  }

  private updateAndDeleteInternalNodes(toUpdate: NodeInternal<any>[], toDelete: Identifier<any>[]): Observable<Response> {

    const params = new URLSearchParams();
    params.append('changeset', 'true');
    params.append('sync', 'true');

    const body = {
      "delete": toDelete,
      "save": toUpdate
    };

    return this.http.post(`${environment.api_url}/nodes`, body, { search: params });
  }

  private getVocabularyNode<T extends VocabularyNodeType>(graphId: string, type: T): Observable<NodeExternal<VocabularyNodeType>> {

    const params = new URLSearchParams();
    params.append('select', 'id');
    params.append('select', 'type');
    params.append('select', 'code');
    params.append('select', 'uri');
    params.append('select', 'createdBy');
    params.append('select', 'createdDate');
    params.append('select', 'lastModifiedBy');
    params.append('select', 'lastModifiedDate');
    params.append('select', 'properties.*');
    params.append('select', 'references.*');
    params.append('where', 'graph.id:' + graphId);
    params.append('where', 'type.id:' + type);
    params.append('max', '-1');

    return this.http.get(`${environment.api_url}/node-trees`, { search: params } )
      .map(response => requireSingle(response.json() as NodeExternal<VocabularyNodeType>));
  }

  private getVocabularyNodes<T extends VocabularyNodeType>(type: T): Observable<NodeExternal<T>[]> {

    const params = new URLSearchParams();
    params.append('select', 'id');
    params.append('select', 'type');
    params.append('select', 'properties.*');
    params.append('select', 'references.publisher');
    params.append('select', 'references.inGroup');
    params.append('where', 'type.id:' + type);
    params.append('max', '-1');

    return this.http.get(`${environment.api_url}/node-trees`, { search: params } )
      .map(response => normalizeAsArray(response.json() as NodeExternal<T>[])).catch(notFoundAsDefault([]));
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
    params.append('select', 'id');
    params.append('select', 'type');
    params.append('select', 'code');
    params.append('select', 'uri');
    params.append('select', 'createdBy');
    params.append('select', 'createdDate');
    params.append('select', 'lastModifiedBy');
    params.append('select', 'lastModifiedDate');
    params.append('select', 'properties.*');
    params.append('select', 'references.*');
    params.append('select', 'references.prefLabelXl:2');
    params.append('select', 'referrers.*');
    params.append('select', 'referrers.prefLabelXl:2');
    params.append('where', 'graph.id:' + graphId);
    params.append('where', 'id:' + conceptId);
    params.append('max', '-1');

    return this.http.get(`${environment.api_url}/node-trees`, { search: params } );
  }

  private getCollectionListNodes(graphId: string): Observable<NodeExternal<'Collection'>[]> {

    const params = new URLSearchParams();
    params.append('select', 'id');
    params.append('select', 'type');
    params.append('select', 'properties.prefLabel');
    params.append('select', 'properties.status');
    params.append('select', 'lastModifiedDate');
    params.append('where', 'graph.id:' + graphId);
    params.append('where', 'type.id:' + 'Collection');
    params.append('max', '-1');

    return this.http.get(`${environment.api_url}/node-trees`, { search: params } )
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
    params.append('select', 'id');
    params.append('select', 'type');
    params.append('select', 'code');
    params.append('select', 'uri');
    params.append('select', 'createdBy');
    params.append('select', 'createdDate');
    params.append('select', 'lastModifiedBy');
    params.append('select', 'lastModifiedDate');
    params.append('select', 'properties.*');
    params.append('select', 'references.*');
    params.append('select', 'references.prefLabelXl:2');
    params.append('where', 'graph.id:' + graphId);
    params.append('where', 'id:' + collectionId);
    params.append('max', '-1');

    return this.http.get(`${environment.api_url}/node-trees`, { search: params } );
  }

  private getNodeListWithoutReferencesOrReferrers<T extends NodeType>(type: T): Observable<NodeExternal<T>[]> {

    const params = new URLSearchParams();
    params.append('select', 'id');
    params.append('select', 'type');
    params.append('select', 'properties.*');
    params.append('where', 'type.id:' + type);
    params.append('max', '-1');

    return this.http.get(`${environment.api_url}/node-trees`, { search: params } )
      .map(response => normalizeAsArray(response.json() as NodeExternal<T>[])).catch(notFoundAsDefault([]));
  }

  private getAllNodeIds(graphId: string): Observable<Identifier<any>[]> {

    const params = new URLSearchParams();
    params.append('select', 'id');
    params.append('select', 'type');
    params.append('where', 'graph.id:' + graphId);
    params.append('max', '-1');

    return this.http.get(`${environment.api_url}/node-trees`, { search: params } )
      .map(response => normalizeAsArray(response.json() as Identifier<any>[])).catch(notFoundAsDefault([]));
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

const unauthorizedAsFalse = responseCodeAsDefault(401, false);

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
