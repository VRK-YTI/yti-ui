import { ReferenceAttributeInternal, TextAttributeInternal, NodeMetaInternal } from './meta-api';
import { comparingPrimitive } from '../utils/comparator';
import { anyMatching, contains, index, normalizeAsArray } from '../utils/array';
import { asLocalizable, Localizable } from './localization';
import { NodeType, NodeExternal, VocabularyNodeType } from './node-api';
import { CollectionNode, ConceptLinkNode, ConceptNode, Node, VocabularyNode } from './node';
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
                          | 'ConceptLink'
                          | 'Organization'
                          | 'Group'
                          | 'Other';

export type PropertyType = StringProperty
                         | LocalizableProperty;

export type StringProperty = { type: 'string', cardinality: Cardinality, required: boolean, editorType: EditorType };
export type LocalizableProperty = { type: 'localizable', cardinality: Cardinality, required: boolean, editorType: EditorType };

export type EditorType = 'input'
                       | 'markdown'
                       | 'status';

function createString(multiple: boolean, required: boolean, editorType: EditorType): StringProperty {
  return { type: 'string', cardinality: (multiple ? 'multiple' : 'single'), required, editorType };
}

function createLocalizable(single: boolean, required: boolean, editorType: EditorType): LocalizableProperty {
  return { type: 'localizable', cardinality: (single ? 'single' : 'multiple'), required, editorType };
}

function createPropertyType(name: TypeName, attributes: Set<string>): PropertyType {

  switch (name) {
    case 'string':
      return createString(attributes.has('multiple'), attributes.has('required'), attributes.has('area') ? 'markdown' : 'input');
    case 'localizable':
      return createLocalizable(attributes.has('single'), attributes.has('required'), attributes.has('area') ? 'markdown' : 'input');
    case 'status':
      return createString(false, true, 'status');
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
    return [type.trim() as TypeName, [...(textAttribute.id === 'language' ? ['required'] : []), ...attributesString.split(',').map(a => a.trim())]];
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
      attrs.add('required');
    }

    if (propertyId === 'language') {
      attrs.add('required');
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

  constructor(private textAttribute: TextAttributeInternal) {
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

  get multiColumn() {

    if ((this.type.type === 'string' || this.type.type === 'localizable') && this.type.editorType === 'markdown') {
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

  copyToGraph(graphId: string): TextAttributeInternal {
    return Object.assign({}, this.textAttribute, {
      domain: {
        id: this.textAttribute.domain.id,
        graph: {
          id: graphId
        }
      }
    });
  }
}

export class ReferenceMeta {

  id: string;
  label: Localizable;
  targetType: NodeType;
  index: number;
  graphId: string;

  constructor(private referenceAttribute: ReferenceAttributeInternal) {

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
      case 'ConceptLink':
        return 'ConceptLink';
      case 'Term':
        return this.id === 'prefLabelXl' ? 'PrimaryTerm' : 'Synonym';
      case 'Organization':
        return 'Organization';
      case 'Group':
        return 'Group';
      default:
        return 'Other';
    }
  }

  get required(): boolean {
    return contains(['Organization', 'Group', 'PrimaryTerm'] as ReferenceType[], this.referenceType);
  }

  get term(): boolean {
    const termTypes: ReferenceType[] = ['PrimaryTerm', 'Synonym'];
    return contains(termTypes, this.referenceType);
  }

  get concept(): boolean {
    return this.referenceType === 'Concept';
  }

  get conceptLink(): boolean {
    return this.referenceType === 'ConceptLink';
  }

  get cardinality(): Cardinality {
    return this.referenceType === 'PrimaryTerm' ? 'single' : 'multiple';
  }

  copyToGraph(graphId: string): ReferenceAttributeInternal {

    const domainGraph = this.referenceAttribute.domain.graph.id;
    const rangeGraph = this.referenceAttribute.range.graph.id;
    const newRangeGraph = domainGraph === rangeGraph ? graphId : rangeGraph;

    return Object.assign({}, this.referenceAttribute, {
      domain: {
        id: this.referenceAttribute.domain.id,
        graph: {
          id: graphId
        }
      },
      range: {
        id: this.referenceAttribute.range.id,
        graph: {
          id: newRangeGraph
        }
      }
    });
  }
}

export class MetaModel {

  constructor(private meta: Map<string, GraphMeta>) {
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

  createEmptyNode<N extends Node<T>, T extends NodeType>(graphId: string, nodeId: string, nodeType: T): N {
    return Node.create(this.getNodeMeta(graphId, nodeType).createEmptyNode(nodeId), this, false) as N;
  }

  createEmptyVocabulary(graphId: string, nodeId: string, label: string, language: string): VocabularyNode {

    const vocabularyType: VocabularyNodeType = this.graphHas(graphId, 'Vocabulary') ? 'Vocabulary' : 'TerminologicalVocabulary';

    const newVocabulary = this.createEmptyNode<VocabularyNode, VocabularyNodeType>(graphId, nodeId, vocabularyType);
    newVocabulary.setPrimaryLabel(language, label);
    return newVocabulary;
  }

  createEmptyConcept(vocabulary: VocabularyNode, nodeId: string, label: string, language: string): ConceptNode {

    const newConcept = this.createEmptyNode<ConceptNode, 'Concept'>(vocabulary.graphId, nodeId, 'Concept');

    if (newConcept.hasVocabulary()) {
      newConcept.vocabulary = vocabulary.clone();
    }

    newConcept.setPrimaryLabel(language, label);

    return newConcept;
  }

  createEmptyCollection(vocabulary: VocabularyNode, nodeId: string, label: string, language: string): CollectionNode {

    const newCollection = this.createEmptyNode<CollectionNode, 'Collection'>(vocabulary.graphId, nodeId, 'Collection');
    newCollection.setPrimaryLabel(language, label);
    return newCollection;
  }

  createConceptLink(toGraphId: string, fromVocabulary: VocabularyNode, concept: ConceptNode): ConceptLinkNode {

    const newConceptLink = this.createEmptyNode<ConceptLinkNode, 'ConceptLink'>(toGraphId, uuid(), 'ConceptLink');

    newConceptLink.label = concept.label;
    newConceptLink.vocabularyLabel = fromVocabulary.label;
    newConceptLink.targetGraph = concept.graphId;
    newConceptLink.targetId = concept.id;

    return newConceptLink;
  }
}

export class GraphMeta {

  private meta = new Map<NodeType, NodeMeta>();

  constructor(public graphId: string, public label: Localizable, private nodeMetas: NodeMetaInternal[], public template: boolean) {
    this.meta = index(nodeMetas.map(m => new NodeMeta(m)), m => m.type);
  }

  has(nodeType: NodeType) {
    return this.meta.has(nodeType);
  }

  getNodeMeta(type: NodeType): NodeMeta {
    return requireDefined(this.meta.get(type), `Meta not found for graph: ${this.graphId} and node type: ${type}`);
  }

  getNodeMetas() {
    return Array.from(this.meta.values());
  }

  toNodes(): NodeMetaInternal[] {
    return this.nodeMetas;
  }

  copyToGraph(graphId: string): GraphMeta {
    return new GraphMeta(graphId, this.label, Array.from(this.meta.values()).map(m => m.copyToGraph(graphId)), false);
  }
}

export class NodeMeta {

  label: Localizable;
  properties: PropertyMeta[];
  references: ReferenceMeta[];
  type: NodeType;
  graphId: string;
  uri: string;

  constructor(private metaNode: NodeMetaInternal) {

    this.label = asLocalizable(metaNode.properties.prefLabel);
    this.type = metaNode.id;
    this.graphId = metaNode.graph.id;
    this.uri = metaNode.uri;

    this.properties = normalizeAsArray(metaNode.textAttributes)
      .sort(comparingPrimitive<TextAttributeInternal>(x => x.index))
      .map(x => new PropertyMeta(x));

    this.references = normalizeAsArray(metaNode.referenceAttributes)
      .sort(comparingPrimitive<ReferenceAttributeInternal>(x => x.index))
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
      code: undefined,
      createdBy: '',
      createdDate: moment().toISOString(),
      lastModifiedBy: '',
      lastModifiedDate: moment().toISOString(),
      uri: undefined,
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

  hasProperty(propertyId: string) {
    return anyMatching(this.properties, ref => ref.id === propertyId);
  }

  hasReference(referenceId: string) {
    return anyMatching(this.references, ref => ref.id === referenceId);
  }

  copyToGraph(graphId: string): NodeMetaInternal {
    return Object.assign({}, this.metaNode, {
      graph: {
        id: graphId
      },
      textAttributes: this.properties.map(p => p.copyToGraph(graphId)),
      referenceAttributes: this.references.map(r => r.copyToGraph(graphId))
    });
  }
}
