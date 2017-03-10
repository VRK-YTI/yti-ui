import { Injectable } from '@angular/core';
import { URLSearchParams, ResponseOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { TermedHttp } from './termed-http.service';
import { normalizeAsArray } from '../utils/array';
import { MetaModelService } from './meta-model.service';
import { NodeExternal, NodeType, NodeInternal } from '../entities/node-api';
import { Node } from '../entities/node';
import { requireDefined } from '../utils/object';
import * as moment from 'moment';

const infiniteResultsParams = new URLSearchParams();
infiniteResultsParams.append('max', '-1');

@Injectable()
export class TermedService {

  constructor(private http: TermedHttp, private metaModelService: MetaModelService) {
  }

  getConceptScheme(graphId: string): Observable<Node<'TerminologicalVocabulary'>> {
    return Observable.zip(this.metaModelService.getMetaForGraph(graphId), this.getUniqueNodeWithoutReferences(graphId, 'TerminologicalVocabulary'))
      .map(([meta, conceptScheme]) => new Node<'TerminologicalVocabulary'>(conceptScheme, meta));
  }

  getConceptSchemeList(): Observable<Node<'TerminologicalVocabulary'>[]> {
    return Observable.zip(this.metaModelService.getMeta(), this.getAllNodesWithoutReferences('TerminologicalVocabulary'))
      .map(([meta, conceptSchemes]) => conceptSchemes.map(scheme => new Node<'TerminologicalVocabulary'>(scheme, requireDefined(meta.get(scheme.type.graph.id)))));
  }

  getConcept(graphId: string, conceptId: string): Observable<Node<'Concept'>> {
    return Observable.zip(this.metaModelService.getMetaForGraph(graphId), this.getConceptDetailsNode(graphId, conceptId))
      .map(([meta, concept]) => new Node(concept, meta));
  }

  getConceptList(graphId: string): Observable<Node<'Concept'>[]> {
    return Observable.zip(this.metaModelService.getMetaForGraph(graphId), this.getConceptListNodes(graphId))
      .map(([meta, concepts]) => concepts.map(concept => new Node<'Concept'>(concept, meta)));
  }

  getTopConceptList(graphId: string): Observable<Node<'Concept'>[]> {
    return Observable.zip(this.metaModelService.getMetaForGraph(graphId), this.getConceptSchemeWithTopConcepts(graphId))
      .map(([meta, conceptScheme]) => normalizeAsArray(conceptScheme.references['hasTopConcept']).map(concept => new Node<'Concept'>(concept, meta)));
  }

  getNarrowerConcepts(graphId: string, broaderConceptId: string): Observable<Node<'Concept'>[]> {
    return Observable.zip(this.metaModelService.getMetaForGraph(graphId), this.getNarrowerConceptNodes(graphId, broaderConceptId))
      .map(([meta, concepts]) => concepts.map(concept => new Node<'Concept'>(concept, meta)));
  }

  updateNode<T extends NodeType>(node: Node<T>) {

    node.lastModifiedDate = moment();

    const termNodes: NodeInternal<any>[] = [];

    for (const reference of Object.values(node.references)) {
      if (reference.term) {
        for (const node of reference.values) {
          termNodes.push(node.toInternalNode());
        }
      }
    }

    this.updateUpdateInternalNodes([node.toInternalNode(), ...termNodes]).subscribe();
  }

  private updateUpdateInternalNodes(nodes: NodeInternal<any>[]): Observable<Response> {

    const params = new URLSearchParams();
    params.append('batch', 'true');

    return this.http.post('/api/nodes', nodes, { search: params });
  }

  private getUniqueNodeWithoutReferences<T extends NodeType>(graphId: string, type: T): Observable<NodeExternal<T>> {

    const params = new URLSearchParams();
    params.append('max', '-1');
    params.append('graphId', graphId);
    params.append('typeId', type);
    params.append('select.references', '');
    params.append('select.referrers', '');

    return this.http.get(`/api/ext.json`, { search: params } )
      .map(response => requireSingle(response.json() as NodeExternal<T>));
  }

  private getAllNodesWithoutReferences<T extends NodeType>(type: T): Observable<NodeExternal<T>[]> {

    const params = new URLSearchParams();
    params.append('max', '-1');
    params.append('typeId', type);
    params.append('select.references', '');
    params.append('select.referrers', '');

    return this.http.get(`/api/ext.json`, { search: params } )
      .map(response => normalizeAsArray(response.json() as NodeExternal<T>[])).catch(notFoundAsDefault([]));
  }

  private getConceptListNodes(graphId: string): Observable<NodeExternal<'Concept'>[]> {

    const params = new URLSearchParams();
    params.append('max', '-1');
    params.append('graphId', graphId);
    params.append('typeId', 'Concept');
    params.append('select.referrers', '');
    params.append('select.references', 'prefLabelXl');
    params.append('select.properties', 'prefLabel');
    params.append('select.properties', 'term_status');
    params.append('select.properties', 'termStatus');
    params.append('select.audit', 'true');

    return this.http.get(`/api/ext.json`, { search: params } )
      .map(response => normalizeAsArray(response.json() as NodeExternal<'Concept'>[])).catch(notFoundAsDefault([]));
  }

  private getConceptSchemeWithTopConcepts(graphId: string): Observable<NodeExternal<'TerminologicalVocabulary'>> {

    const params = new URLSearchParams();
    params.append('max', '-1');
    params.append('graphId', graphId);
    params.append('typeId', 'TerminologicalVocabulary');
    params.append('recurse.referrers.broader', '1');
    params.append('recurse.references.prefLabelXl', '1');
    params.append('select.properties', 'prefLabel');
    params.append('select.references', 'hasTopConcept');
    params.append('select.references', 'prefLabelXl');
    params.append('select.referrers', 'broader');

    return this.http.get(`/api/ext.json`, { search: params } )
      .map(response => requireSingle(response.json() as NodeExternal<'TerminologicalVocabulary'>[]));
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
