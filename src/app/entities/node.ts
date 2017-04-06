import { asLocalizable, Localizable, combineLocalizables, Localization } from './localization';
import { requireDefined, assertNever } from '../utils/object';
import { normalizeAsArray, any, requireSingle, all } from '../utils/array';
import { NodeExternal, NodeType, Attribute, Identifier, NodeInternal, VocabularyNodeType } from './node-api';
import { PropertyMeta, ReferenceMeta, NodeMeta } from './meta';
import { Moment } from 'moment';
import * as moment from 'moment';

export type KnownNode = VocabularyNode
  | ConceptNode
  | TermNode
  | CollectionNode
  | GroupNode
  | OrganizationNode;

export class Property {

  value: string|Localization[];

  constructor(attributes: Attribute[], public meta: PropertyMeta, public languages: string[]) {

    const initializeLocalizable = () => {
      this.value = [];

      for (const language of languages) {
        const attribute = attributes.find(a => a.lang === language);

        if (attribute) {
          this.value.push(attribute);
        } else {
          this.value.push({ lang: language, value: '' });
        }
      }
    };

    const initializeString = (defaultValue = '') => {
      switch (attributes.length) {
        case 0:
          this.value = defaultValue;
          break;
        case 1:
          this.value = attributes[0].value || defaultValue;
          break;
        default:
          throw new Error('Literal with multiple values: ' + attributes.map(a => a.value).join(','));
      }
    };

    switch (meta.type) {
      case 'localizable':
        initializeLocalizable();
        break;
      case 'status':
        initializeString('Unstable');
        break;
      case 'string':
        initializeString();
        break;
      default:
        assertNever(meta.type, 'Unknown meta type: ' + meta.type);
    }
  }

  get empty() {
    if (typeof this.value === 'string') {
      return !this.value.trim();
    } else {
      return !any(this.value, localization => !!localization.value.trim());
    }
  }

  localizable() {
    return this.meta.type == 'localizable';
  }

  toAttributes(): Attribute[] {
    if (typeof this.value === 'string') {
      return [{ lang: '', regex: this.meta.regex, value: this.value }];
    } else {
      return this.value.map(value => Object.assign({ regex: this.meta.regex }, value));
    }
  }
}

export class Reference<N extends KnownNode | Node<any>> {

  values: N[];

  constructor(nodes: NodeExternal<any>[], public meta: ReferenceMeta, metas: Map<string, Map<string, NodeMeta>>, public languages: string[]) {
    if (this.term) {

      this.values = [];
      const nodeMeta = requireDefined(requireDefined(metas.get(meta.graphId)).get(meta.targetType));

      for (const language of languages) {

        const node = nodes.find(node => {
          const prefLabel = node.properties['prefLabel'];
          return prefLabel && prefLabel[0].lang === language
        });

        if (node) {
          this.values.push(Node.create(node, metas, [language], true) as N);
        } else {
          this.values.push(Node.create(nodeMeta.createEmptyNode(), metas, [language], false) as N);
        }
      }
    } else {
      this.values = nodes.map(node => Node.create(node, metas, languages, true) as N);
    }
  }

  get term(): boolean {
    return this.meta.term;
  }

  get concept(): boolean {
    return this.meta.concept;
  }

  toIdentifiers(): Identifier<any>[] {
    return this.values.map(node => node.identifier);
  }

  get empty() {
    if (this.term) {
      return all((this.values as TermNode[]), term => term.empty);
    } else {
      return this.values.length === 0;
    }
  }
}

export class Node<T extends NodeType> {

  meta: NodeMeta;

  properties: { [key: string]: Property } = {};
  references: { [key: string]: Reference<any> } = {};
  referrers: { [key: string]: Node<any>[] } = {};

  protected constructor(protected node: NodeExternal<T>,
                        protected metas: Map<string, Map<string, NodeMeta>>,
                        public readonly languages: string[],
                        public persistent: boolean) {

    this.meta = requireDefined(requireDefined(metas.get(node.type.graph.id)).get(node.type.id), 'Meta not found for ' + node.type.id);

    for (const propertyMeta of this.meta.properties) {
      const property = normalizeAsArray(node.properties[propertyMeta.id]);
      this.properties[propertyMeta.id] = new Property(property, propertyMeta, languages);
    }

    for (const referenceMeta of this.meta.references) {
      const reference = normalizeAsArray(node.references[referenceMeta.id]);
      this.references[referenceMeta.id] = new Reference(reference, referenceMeta, metas, languages);
    }

    for (const [name, referrerNodes] of Object.entries(node.referrers)) {
      this.referrers[name] = normalizeAsArray(referrerNodes).map(referrerNode => Node.create(referrerNode, metas, languages, true));
    }
  }

  static create(node: NodeExternal<any>, metas: Map<string, Map<string, NodeMeta>>, languages: string[], persistent: boolean): KnownNode | Node<any> {
    switch (node.type.id) {
      case 'Vocabulary':
      case 'TerminologicalVocabulary':
        return new VocabularyNode(node, metas, languages, persistent);
      case 'Concept':
        return new ConceptNode(node, metas, languages, persistent);
      case 'Term':
        return new TermNode(node, metas, languages, persistent);
      case 'Collection':
        return new CollectionNode(node, metas, languages, persistent);
      case 'Group':
        return new GroupNode(node, metas, languages, persistent);
      case 'Organization':
        return new OrganizationNode(node, metas, languages, persistent);
      default:
        return new Node<any>(node, metas, languages, persistent);
    }
  }

  protected toNodeWithoutReferencesAndReferrers() {

    const serializeProperties = () => {

      const result: { [key: string]: Attribute[] } = {};

      for (const [key, property] of Object.entries(this.properties)) {
        result[key] = property.toAttributes();
      }

      return result;
    };

    return {
      id: this.node.id,
      type: this.node.type,
      code: this.node.code,
      createdBy: this.node.createdBy,
      createdDate: this.node.createdDate,
      lastModifiedBy: this.node.lastModifiedBy,
      lastModifiedDate: this.node.lastModifiedDate,
      uri: this.node.uri,
      properties: serializeProperties()
    };
  }

  clone<N extends Node<T>>(): N {

    const setPersistent = (original: Node<any>, clone: Node<any>) => {

      clone.persistent = original.persistent;

      for (const [key, reference] of Object.entries(original.references)) {
        const cloneReferenceValues = clone.references[key].values;

        for (const refNode of reference.values) {
          setPersistent(refNode, requireDefined(cloneReferenceValues.find(clonedRefNode => refNode.id === clonedRefNode.id)));
        }
      }
    };

    const cloned = Node.create(JSON.parse(JSON.stringify(this.toExternalNode())), this.metas, this.languages, this.persistent) as N;
    setPersistent(this, cloned);
    return cloned;
  }

  toExternalNode(): NodeExternal<T> {

    const extractReferences = () => {
      const result: { [key: string]: NodeExternal<any>[] } = {};

      for (const [key, reference] of Object.entries(this.references)) {
        result[key] = reference.values.map(node => node.toExternalNode());
      }

      return result;
    };

    return Object.assign(this.toNodeWithoutReferencesAndReferrers(), {
      referrers: this.node.referrers,
      references: extractReferences()
    });
  }

  toInternalNode(): NodeInternal<T> {

    const extractReferences = () => {
      const result: { [key: string]: Identifier<any>[] } = {};

      for (const [key, reference] of Object.entries(this.references)) {
        result[key] = reference.toIdentifiers();
      }

      return result;
    };

    const extractReferrers = () => {
      const result: { [key: string]: Identifier<any>[] } = {};

      for (const [key, referrers] of Object.entries(this.referrers)) {
        result[key] = referrers.map(referrer => referrer.identifier);
      }

      return result;
    };

    return Object.assign(this.toNodeWithoutReferencesAndReferrers(), {
      referrers: extractReferrers(),
      references: extractReferences()
    });
  }

  get identifier(): Identifier<T> {
    return { id: this.id, type: this.node.type };
  }

  get id() {
    return this.node.id;
  }

  get code() {
    return this.node.code;
  }

  get uri() {
    return this.node.uri;
  }

  get graphId() {
    return this.node.type.graph.id;
  }

  get type(): T {
    return this.node.type.id;
  }

  get createdBy() {
    return this.node.createdBy;
  }

  get createdDate() {
    return moment(this.node.createdDate);
  }

  get lastModifiedBy() {
    return this.node.lastModifiedBy;
  }

  get lastModifiedDate() {
    return moment(this.node.lastModifiedDate);
  }

  set lastModifiedDate(date: Moment) {
    this.node.lastModifiedDate = date.toISOString();
  }

  get concept(): boolean {
    return this.meta.concept;
  }

  get term(): boolean {
    return this.meta.term;
  }

  get typeLabel(): Localizable {
    return this.meta.label;
  }

  getPropertyAsLocalizable(property: string): Localizable {
    const propertyValue = requireDefined(this.properties[property]).value;

    if (typeof propertyValue === 'string') {
      throw new Error('Property must be localizable');
    }

    return asLocalizable(propertyValue);
  }

  getPropertyAsString(property: string): string {
    const propertyValue = requireDefined(this.properties[property], 'Property not found: ' + property).value;

    if (typeof propertyValue !== 'string') {
      throw new Error('Property must be string');
    }

    return propertyValue;
  }
}

export class VocabularyNode extends Node<VocabularyNodeType> {

  constructor(node: NodeExternal<VocabularyNodeType>, metas: Map<string, Map<string, NodeMeta>>,languages: string[], persistent: boolean) {
    super(node, metas, languages, persistent);
  }

  clone(): VocabularyNode {
    return super.clone<VocabularyNode>();
  }

  get label(): Localizable {
    return this.getPropertyAsLocalizable('prefLabel');
  }

  get description(): Localizable {
    return this.getPropertyAsLocalizable('description');
  }

  get publisher(): OrganizationNode {
    return requireSingle(this.references['publisher'].values) as OrganizationNode;
  }

  get group(): GroupNode {
    return requireSingle(this.references['inGroup'].values) as GroupNode;
  }

  hasGroup() {
    return !this.references['inGroup'].empty;
  }
}

export class ConceptNode extends Node<'Concept'> {

  constructor(node: NodeExternal<'Concept'>, metas: Map<string, Map<string, NodeMeta>>,languages: string[], persistent: boolean) {
    super(node, metas, languages, persistent);
  }

  clone(): ConceptNode {
    return super.clone<ConceptNode>();
  }

  get label(): Localizable {
    if (this.properties['prefLabel']) {
      return this.getPropertyAsLocalizable('prefLabel');
    } else if (this.references['prefLabelXl']) {
      return combineLocalizables(this.references['prefLabelXl'].values.map(term => term.getPropertyAsLocalizable('prefLabel')));
    } else {
      throw new Error('No label found');
    }
  }

  get definition(): Localizable {
    return this.getPropertyAsLocalizable('definition');
  }

  get vocabulary(): VocabularyNode {
    return requireSingle(this.references['inScheme'].values) as VocabularyNode;
  }

  set vocabulary(vocabulary: VocabularyNode) {
    this.references['inScheme'].values = [vocabulary];
  }

  get status(): string {
    return this.getPropertyAsString('status');
  }

  get terms(): TermNode[] {
    return normalizeAsArray(this.references['prefLabelXl'].values as TermNode[]);
  }

  findTermForLanguage(language: string): TermNode|undefined {
    return this.terms.find(term => term.language === language);
  }

  get relatedConcepts(): ConceptNode[] {
    return normalizeAsArray(this.references['related'].values as ConceptNode[]);
  }

  get broaderConcepts(): ConceptNode[] {
    return normalizeAsArray(this.references['broader'].values as ConceptNode[]);
  }

  get narrowerConcepts(): ConceptNode[] {
    return normalizeAsArray(this.referrers['broader'] as ConceptNode[]);
  }

  get partOfThisConcepts(): ConceptNode[] {
    return normalizeAsArray(this.referrers['isPartOf'] as ConceptNode[]);
  }
}

export class TermNode extends Node<'Term'> {

  constructor(node: NodeExternal<'Term'>, metas: Map<string, Map<string, NodeMeta>>,languages: string[], persistent: boolean) {
    super(node, metas, languages, persistent);
  }

  get empty() {
    return !this.value.trim();
  }

  get language(): string {
    return this.localization.lang;
  }

  get value() {
    return this.localization.value;
  }

  set value(value: string) {
    this.localization.value = value;
  }

  get localization(): Localization {
    return this.properties['prefLabel'].value[0] as Localization;
  }
}

export class CollectionNode extends Node<'Collection'> {

  constructor(node: NodeExternal<'Collection'>, metas: Map<string, Map<string, NodeMeta>>,languages: string[], persistent: boolean) {
    super(node, metas, languages, persistent);
  }

  clone(): CollectionNode {
    return super.clone<CollectionNode>();
  }

  findLocalizationForLanguage(language: string): Localization|undefined {
    return (this.properties['prefLabel'].value as Localization[]).find(localization => localization.lang === language);
  }

  anyLocalization(): Localization {
    return this.properties['prefLabel'].value[0] as Localization;
  }

  get label(): Localizable {
    return this.getPropertyAsLocalizable('prefLabel');
  }

  get definition(): Localizable {
    return this.getPropertyAsLocalizable('definition');
  }

  get members() {
    return normalizeAsArray(this.references['member'].values as ConceptNode[]);
  }
}

export class GroupNode extends Node<'Group'> {

  constructor(node: NodeExternal<'Group'>, metas: Map<string, Map<string, NodeMeta>>,languages: string[], persistent: boolean) {
    super(node, metas, languages, persistent);
  }

  get label(): Localizable {
    return this.getPropertyAsLocalizable('prefLabel');
  }
}

export class OrganizationNode extends Node<'Organization'> {

  constructor(node: NodeExternal<'Organization'>, metas: Map<string, Map<string, NodeMeta>>,languages: string[], persistent: boolean) {
    super(node, metas, languages, persistent);
  }

  get label(): Localizable {
    return this.getPropertyAsLocalizable('prefLabel');
  }
}
