import { ReferenceAttributeInternal, TextAttributeInternal, NodeMetaInternal } from './meta-api';
import { comparingPrimitive } from '../utils/comparator';
import { any, contains, index, normalizeAsArray } from '../utils/array';
import { asLocalizable, Localizable } from './localization';
import { NodeType, NodeExternal, VocabularyNodeType } from './node-api';
import { CollectionNode, ConceptLinkNode, ConceptNode, Node, VocabularyNode } from './node';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';
import { assertNever, requireDefined } from '../utils/object';
import { defaultLanguages } from '../utils/language';

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

  addMeta(graphMeta: GraphMeta) {
    this.meta.set(graphMeta.graphId, graphMeta);
  }

  graphHas(graphId: string, nodeType: NodeType) {
    return this.getGraphMeta(graphId).has(nodeType);
  }

  getGraphMeta(graphId: string): GraphMeta {
    return requireDefined(this.meta.get(graphId), 'Meta not found for graph: ' + graphId);
  }

  getMetaTemplates() {
    return Array.from(this.meta.values()).filter(meta => meta.template);
  }

  getNodeMeta(graphId: string, nodeType: NodeType): NodeMeta {
    return this.getGraphMeta(graphId).getNodeMeta(nodeType);
  }

  createEmptyNode<N extends Node<T>, T extends NodeType>(graphId: string, nodeId: string, nodeType: T, languages: string[]): N {
    return Node.create(this.getNodeMeta(graphId, nodeType).createEmptyNode(nodeId), this, languages, false) as N;
  }

  createEmptyVocabulary(graphId: string, nodeId: string, label: string, language: string): VocabularyNode {

    const vocabularyType: VocabularyNodeType = this.graphHas(graphId, 'Vocabulary') ? 'Vocabulary' : 'TerminologicalVocabulary';

    const newVocabulary = this.createEmptyNode<VocabularyNode, VocabularyNodeType>(graphId, nodeId, vocabularyType, defaultLanguages);
    newVocabulary.setPrimaryLabel(language, label);
    return newVocabulary;
  }

  createEmptyConcept(vocabulary: VocabularyNode, nodeId: string, label: string, language: string): ConceptNode {

    const newConcept = this.createEmptyNode<ConceptNode, 'Concept'>(vocabulary.graphId, nodeId, 'Concept', vocabulary.languages);

    if (newConcept.hasVocabulary()) {
      newConcept.vocabulary = vocabulary.clone();
    }

    newConcept.setPrimaryLabel(language, label);

    return newConcept;
  }

  createEmptyCollection(vocabulary: VocabularyNode, nodeId: string, label: string, language: string): CollectionNode {

    const newCollection = this.createEmptyNode<CollectionNode, 'Collection'>(vocabulary.graphId, nodeId, 'Collection', vocabulary.languages);
    newCollection.setPrimaryLabel(language, label);
    return newCollection;
  }

  createConceptLink(toGraphId: string, fromVocabulary: VocabularyNode, concept: ConceptNode): ConceptLinkNode {

    const newConceptLink = this.createEmptyNode<ConceptLinkNode, 'ConceptLink'>(toGraphId, uuid(), 'ConceptLink', defaultLanguages /* TODO */);

    newConceptLink.label = concept.label;
    newConceptLink.vocabularyLabel = fromVocabulary.label;
    newConceptLink.targetGraph = concept.graphId;
    newConceptLink.targetId = concept.id;

    return newConceptLink;
  }

  copyTemplateToGraph(templateMeta: GraphMeta, graphId: string): MetaModel {

    const newMeta = new MetaModel(new Map<string, GraphMeta>(this.meta));
    newMeta.addMeta(templateMeta.copyToGraph(graphId));
    return newMeta;
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

  hasReference(referenceId: string) {
    return any(this.references, ref => ref.id === referenceId);
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
