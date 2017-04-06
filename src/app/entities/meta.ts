import { ReferenceAttributeInternal, TextAttributeInternal, NodeMetaInternal } from './meta-api';
import { comparingNumber } from '../utils/comparator';
import { any, groupBy, index, normalizeAsArray } from '../utils/array';
import { asLocalizable, Localizable } from './localization';
import { NodeType, NodeExternal } from './node-api';
import { Node } from './node';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';
import { requireDefined } from '../utils/object';

export type PropertyType = 'localizable' | 'status' | 'string';

export class PropertyMeta {

  id: string;
  label: Localizable;
  regex: string;
  index: number;

  constructor(textAttribute: TextAttributeInternal) {
    this.id = textAttribute.id;
    this.label = asLocalizable(textAttribute.properties.prefLabel);
    this.regex = textAttribute.regex;
    this.index = textAttribute.index;
  }

  get type(): PropertyType {

    switch(this.id) {
      case 'prefLabel':
      case 'definition':
      case 'description':
      case 'note':
        return 'localizable';
      case 'status':
        return 'status';
      default:
        return 'string';
    }
  }

  get area() {
    switch(this.id) {
      case 'definition':
      case 'description':
      case 'note':
        return true;
      default:
        return false;
    }
  }
}

export class ReferenceMeta {

  id: string;
  label: Localizable;
  targetType: NodeType;
  index: number;
  graphId: string;

  constructor(referenceAttribute: ReferenceAttributeInternal) {

    this.id = referenceAttribute.id;
    this.label = asLocalizable(referenceAttribute.properties.prefLabel);
    this.targetType = referenceAttribute.range.id;
    this.graphId = referenceAttribute.range.graph.id;
    this.index = referenceAttribute.index;
  }

  get term(): boolean {
    return this.targetType === 'Term';
  }

  get concept(): boolean {
    return this.targetType === 'Concept';
  }
}

export class MetaModel {

  private meta = new Map<string, GraphMeta>();

  constructor(nodeMetas: NodeMetaInternal[]) {

    const nodeMetasByGroup = groupBy(nodeMetas, meta => meta.graph.id);

    for (const [graphId, nodeMetasInGroup] of Array.from(nodeMetasByGroup.entries())) {
      this.meta.set(graphId, new GraphMeta(graphId, nodeMetasInGroup));
    }
  }

  graphHas(graphId: string, nodeType: NodeType) {
    return this.getGraphMeta(graphId).has(nodeType);
  }

  getGraphMeta(graphId: string): GraphMeta {
    return requireDefined(this.meta.get(graphId), 'Meta not found for graph: ' + graphId);
  }

  getNodeMeta(graphId: string, nodeType: NodeType): NodeMeta {
    return this.getGraphMeta(graphId).getNodeMeta(nodeType);
  }

  createEmptyNode<N extends Node<T>, T extends NodeType>(graphId: string, nodeId: string, nodeType: T, languages: string[]): N {
    return Node.create(this.getNodeMeta(graphId, nodeType).createEmptyNode(nodeId), this, languages, false) as N;
  }
}

export class GraphMeta {

  private meta = new Map<NodeType, NodeMeta>();

  constructor(public graphId: string, nodeMetas: NodeMetaInternal[]) {
    this.meta = index(nodeMetas.map(m => new NodeMeta(m)), m => m.type);
  }

  has(nodeType: NodeType) {
    return this.meta.has(nodeType);
  }

  getNodeMeta(type: NodeType): NodeMeta {
    return requireDefined(this.meta.get(type), `Meta not found for graph: ${this.graphId} and node type: ${type}`);
  }
}

export class NodeMeta {

  label: Localizable;
  properties: PropertyMeta[];
  references: ReferenceMeta[];
  type: NodeType;
  graphId: string;
  uri: string;

  constructor(metaNode: NodeMetaInternal) {

    this.label = asLocalizable(metaNode.properties.prefLabel);
    this.type = metaNode.id;
    this.graphId = metaNode.graph.id;
    this.uri = metaNode.uri;

    this.properties = normalizeAsArray(metaNode.textAttributes)
      .sort(comparingNumber<TextAttributeInternal>(x => x.index))
      .map(x => new PropertyMeta(x));

    this.references = normalizeAsArray(metaNode.referenceAttributes)
      .sort(comparingNumber<ReferenceAttributeInternal>(x => x.index))
      .map(x => new ReferenceMeta(x));
  }

  get term(): boolean {
    return this.type === 'Term';
  }

  get concept(): boolean {
    return this.type === 'Concept';
  }

  createEmptyNode(id = uuid()): NodeExternal<any> {

    const result: NodeExternal<any> = {
      id: id,
      type: {
        id: this.type,
        uri: this.uri,
        graph: {
          id: this.graphId
        }
      },
      code: '',
      createdBy: '',
      createdDate: moment().toISOString(),
      lastModifiedBy: '',
      lastModifiedDate: moment().toISOString(),
      uri: '',
      properties: {},
      references: {},
      referrers: {}
    };

    for (const property of this.properties) {
      result.properties[property.id] = [];
    }

    for (const reference of this.references) {
      result.references[reference.id] = [];
    }

    return result;
  }

  hasReference(referenceId: string) {
    return any(this.references, ref => ref.id === referenceId);
  }
}
