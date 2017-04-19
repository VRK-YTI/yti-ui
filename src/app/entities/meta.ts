import { ReferenceAttributeInternal, TextAttributeInternal, NodeMetaInternal } from './meta-api';
import { comparingNumber } from '../utils/comparator';
import { any, contains, groupBy, index, normalizeAsArray } from '../utils/array';
import { asLocalizable, Localizable } from './localization';
import { NodeType, NodeExternal } from './node-api';
import { Node } from './node';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';
import { assertNever, requireDefined } from '../utils/object';

export type Cardinality = 'single'
                        | 'multiple';

export type TypeName = 'string'
                     | 'localizable'
                     | 'status';

export type ReferenceType = 'PrimaryTerm'
                          | 'Synonym'
                          | 'Concept'
                          | 'Other';

export type PropertyType = StringProperty
                         | LocalizableProperty
                         | StatusProperty;

export type StringProperty = { type: 'string', cardinality: Cardinality, area: boolean };
export type LocalizableProperty = { type: 'localizable', cardinality: Cardinality, area: boolean };
export type StatusProperty = { type: 'status' };

function createString(multiple: boolean, area: boolean): StringProperty {
  return { type: 'string', cardinality: (multiple ? 'multiple' : 'single'), area };
}

function createLocalizable(single: boolean, area: boolean): LocalizableProperty {
  return { type: 'localizable', cardinality: (single ? 'single' : 'multiple'), area };
}

function createStatus(): StatusProperty {
  return { type: 'status' };
}

function createPropertyType(name: TypeName, attributes: Set<string>): PropertyType {
  switch (name) {
    case 'string':
      return createString(attributes.has('multiple'), attributes.has('area'));
    case 'localizable':
      return createLocalizable(attributes.has('single'), attributes.has('area'));
    case 'status':
      return createStatus();
    default:
      return assertNever(name, 'Unsupported type: ' + name);
  }
}

function parseTypeAndAttributes(textAttribute: TextAttributeInternal): [TypeName, string[]] {

  function findTypePropertyValue(): string {

    const property = textAttribute.properties.type;

    if (property && property.length > 0) {
      return property[0].value;
    } else {
      return '';
    }
  }

  const typePropertyValue = findTypePropertyValue();

  if (typePropertyValue.indexOf(':') !== -1) {
    const [type, attributesString] = typePropertyValue.split(':');
    return [type.trim() as TypeName, attributesString.split(',').map(a => a.trim())];
  } else {
    return [typePropertyValue.trim() as TypeName, []];
  }
}

function createDefaultPropertyType(propertyId: string) {

  function resolveTypeName(): TypeName {
    switch(propertyId) {
      case 'prefLabel':
      case 'altLabel':
      case 'hiddenLabel':
      case 'definition':
      case 'description':
      case 'note':
      case 'scopeNote':
      case 'historyNote':
      case 'changeNote':
        return 'localizable';
      case 'status':
        return 'status';
      default:
        return 'string';
    }
  }

  function resolveAttributes(): Set<string> {
    const attrs = new Set<string>();

    switch(propertyId) {
      case 'definition':
      case 'description':
      case 'note':
      case 'scopeNote':
      case 'historyNote':
      case 'changeNote':
        attrs.add('area');
    }

    if (propertyId === 'prefLabel') {
      attrs.add('single');
    }

    return attrs;
  }

  return createPropertyType(resolveTypeName(), resolveAttributes());
}

export class PropertyMeta {

  id: string;
  label: Localizable;
  regex: string;
  index: number;
  type: PropertyType;

  constructor(textAttribute: TextAttributeInternal) {
    this.id = textAttribute.id;
    this.label = asLocalizable(textAttribute.properties.prefLabel);
    this.regex = textAttribute.regex;
    this.index = textAttribute.index;

    const [type, attributes] = parseTypeAndAttributes(textAttribute);

    if (type) {
      this.type = createPropertyType(type, new Set<string>(attributes));
    } else {
      this.type = createDefaultPropertyType(this.id);
    }
  }

  get typeAsString(): StringProperty {

    if (this.type.type !== 'string') {
      throw new Error('Property is not string literal');
    }

    return this.type;
  }

  get typeAsLocalizable(): LocalizableProperty {

    if (this.type.type !== 'localizable') {
      throw new Error('Property is not localizable');
    }

    return this.type;
  }

  get multiColumn() {

    if ((this.type.type === 'string' || this.type.type === 'localizable') && this.type.area) {
      return false;
    }

    switch(this.id) {
      case 'prefLabel':
      case 'altLabel':
      case 'hiddenLabel':
        return false;
      default:
        return true;
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

  get referenceType(): ReferenceType {
    switch (this.targetType) {
      case 'Concept':
        return 'Concept';
      case 'Term':
        return this.id === 'prefLabelXl' ? 'PrimaryTerm' : 'Synonym';
      default:
        return 'Other';
    }
  }

  get term(): boolean {
    const termTypes: ReferenceType[] = ['PrimaryTerm', 'Synonym'];
    return contains(termTypes, this.referenceType);
  }

  get concept(): boolean {
    return this.referenceType === 'Concept';
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
