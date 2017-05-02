import { asLocalizable, Localizable, combineLocalizables, Localization } from './localization';
import { requireDefined, assertNever } from '../utils/object';
import { normalizeAsArray, any, requireSingle, all, remove } from '../utils/array';
import { NodeExternal, NodeType, Attribute, Identifier, NodeInternal, VocabularyNodeType } from './node-api';
import {
  PropertyMeta, ReferenceMeta, NodeMeta, MetaModel, LocalizableProperty, StringProperty,
  StatusProperty
} from './meta';
import { Moment } from 'moment';
import * as moment from 'moment';
import { getOrCreate } from '../utils/map';

export type KnownNode = VocabularyNode
                      | ConceptNode
                      | TermNode
                      | CollectionNode
                      | GroupNode
                      | OrganizationNode;

export class Property {

  attributes: Attribute[];

  constructor(attributes: Attribute[], public meta: PropertyMeta, public languages: string[]) {

    const initializeLocalizable = (localizableProperty: LocalizableProperty) => {
      if (localizableProperty.cardinality === 'single') {
        this.attributes = languages.map(lang => attributes.find(a => a.lang === lang) || this.createLocalizedAttribute(lang, ''));
      } else {
        this.attributes = attributes;
      }
    };

    const initializeString = (stringProperty: StringProperty, defaultValue = '') => {

      if (stringProperty.cardinality === 'single') {
        switch (attributes.length) {
          case 0:
            this.attributes = [this.createLiteralAttribute(defaultValue)];
            break;
          case 1:
            this.attributes = attributes;
            break;
          default:
            throw new Error('Literal with multiple values: ' + attributes.map(a => a.value).join(','));
        }
      } else {
        this.attributes = attributes;
      }
    };

    const initializeStatus = (statusProperty: StatusProperty, defaultValue = 'Unstable') => {

      switch (attributes.length) {
        case 0:
          this.attributes = [this.createLiteralAttribute(defaultValue)];
          break;
        case 1:
          this.attributes = attributes[0].value ? attributes : [this.createLiteralAttribute(defaultValue)];
          break;
        default:
          throw new Error('Status with multiple values: ' + attributes.map(a => a.value).join(','));
      }
    };

    switch (meta.type.type) {
      case 'localizable':
        initializeLocalizable(meta.type);
        break;
      case 'status':
        initializeStatus(meta.type);
        break;
      case 'string':
        initializeString(meta.type);
        break;
      default:
        assertNever(meta.type, 'Unknown meta type: ' + meta.type);
    }
  }

  private createLiteralAttribute(value: string): Attribute {
    return { lang: '', value, regex: this.meta.regex };
  }

  private createLocalizedAttribute(lang: string, value: string): Attribute {
    return { lang, value, regex: this.meta.regex };
  }

  newLiteral(value: string = '') {
    this.attributes.push(this.createLiteralAttribute(value));
  }

  newLocalization(language: string, value = '') {
    this.attributes.push(this.createLocalizedAttribute(language, value));
  }

  remove(attribute: Attribute) {
    remove(this.attributes, attribute);
  }

  get singleLiteralValue() {
    return this.attributes[0].value;
  }

  set singleLiteralValue(value: string) {
    this.attributes[0].value = value;
  }

  asValues() {
    return this.attributes.map(attr => attr.value.trim()).filter(v => !!v);
  }

  asLocalizable() {
    return asLocalizable(this.attributes);
  }

  asString() {
    return this.asValues().join(',');
  }

  get empty() {
    return !any(this.attributes, localization => !!localization.value.trim());
  }

  get multiColumn() {
    return this.meta.multiColumn;
  }
}

export class Reference<N extends KnownNode | Node<any>> {

  values: N[];

  constructor(nodes: NodeExternal<any>[], public meta: ReferenceMeta, private metaModel: MetaModel, public languages: string[]) {
    if (this.type === 'PrimaryTerm') {

      this.values = [];
      const nodeMeta = metaModel.getNodeMeta(meta.graphId, meta.targetType);

      for (const language of languages) {

        const node = nodes.find(node => {
          const prefLabel = node.properties['prefLabel'];
          return prefLabel && prefLabel[0].lang === language
        });

        if (node) {
          this.values.push(Node.create(node, metaModel, [language], true) as N);
        } else {
          this.values.push(Node.create(nodeMeta.createEmptyNode(), metaModel, [language], false) as N);
        }
      }
    } else if (this.type === 'Synonym') {
      this.values = nodes.map(node => {
        const prefLabel = node.properties['prefLabel'];
        const nodeLang = prefLabel ? prefLabel.map(attr => attr.lang) : ['fi'];
        return Node.create(node, metaModel, nodeLang, true) as N;
      });
    } else {
      this.values = nodes.map(node => Node.create(node, metaModel, languages, true) as N);
    }
  }

  createNewReference(languages = this.languages) {
    const newReference = Node.create(this.targetMeta.createEmptyNode(), this.metaModel, languages, false) as N;
    this.values.push(newReference);
    return newReference;
  }

  removeReference(node: N) {
    remove(this.values, node);
  }

  get singleValue(): N|null {
    if (this.values.length === 0) {
      return null;
    } else if (this.values.length === 1) {
      return this.values[0];
    } else {
      throw new Error('Multiple values when single is required: ' + this.values.length);
    }
  }

  set singleValue(value: N|null) {
    this.values = value ? [value] : [];
  }

  get targetMeta() {
    return this.metaModel.getNodeMeta(this.meta.graphId, this.meta.targetType);
  }

  get type() {
    return this.meta.referenceType;
  }

  get term() {
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

export class Referrer<N extends KnownNode | Node<any>> {

  values: N[];
  valuesByMeta: { meta: ReferenceMeta, nodes: N[] }[] = [];

  constructor(referenceId: string, referrers: NodeExternal<any>[], metaModel: MetaModel, languages: string[]) {

    this.values = referrers.map(referrer => Node.create(referrer, metaModel, languages, true) as N);

    const references = new Map<ReferenceMeta, N[]>();

    for (const value of this.values) {
      const meta = value.meta.references.find(ref => ref.id === referenceId);
      getOrCreate(references, meta, () => []).push(value);
    }

    for (const [meta, nodes] of Array.from(references.entries())) {
      this.valuesByMeta.push({meta, nodes});
    }
  }

  get empty() {
    return this.values.length === 0;
  }
}

export class Node<T extends NodeType> {

  meta: NodeMeta;

  properties: { [key: string]: Property } = {};
  references: { [key: string]: Reference<any> } = {};
  referrers: { [key: string]: Referrer<Node<any>> } = {};

  protected constructor(protected node: NodeExternal<T>,
                        protected metaModel: MetaModel,
                        public readonly languages: string[],
                        public persistent: boolean) {

    this.meta = metaModel.getNodeMeta(this.graphId, this.type);

    for (const propertyMeta of this.meta.properties) {
      const property = normalizeAsArray(node.properties[propertyMeta.id]);
      this.properties[propertyMeta.id] = new Property(property, propertyMeta, languages);
    }

    for (const referenceMeta of this.meta.references) {
      const reference = normalizeAsArray(node.references[referenceMeta.id]);
      this.references[referenceMeta.id] = new Reference(reference, referenceMeta, metaModel, languages);
    }

    for (const [name, referrerNodes] of Object.entries(node.referrers)) {
      this.referrers[name] = new Referrer(name, normalizeAsArray(referrerNodes), metaModel, languages);
    }
  }

  static create(node: NodeExternal<any>, metaModel: MetaModel, languages: string[], persistent: boolean): KnownNode | Node<any> {
    switch (node.type.id) {
      case 'Vocabulary':
      case 'TerminologicalVocabulary':
        return new VocabularyNode(node, metaModel, languages, persistent);
      case 'Concept':
        return new ConceptNode(node, metaModel, languages, persistent);
      case 'Term':
        return new TermNode(node, metaModel, languages, persistent);
      case 'Collection':
        return new CollectionNode(node, metaModel, languages, persistent);
      case 'Group':
        return new GroupNode(node, metaModel, languages, persistent);
      case 'Organization':
        return new OrganizationNode(node, metaModel, languages, persistent);
      default:
        return new Node<any>(node, metaModel, languages, persistent);
    }
  }

  protected toNodeWithoutReferencesAndReferrers() {

    const serializeProperties = () => {

      const result: { [key: string]: Attribute[] } = {};

      for (const [key, property] of Object.entries(this.properties)) {
        result[key] = property.attributes;
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

    const cloned = Node.create(JSON.parse(JSON.stringify(this.toExternalNode())), this.metaModel, this.languages, this.persistent) as N;
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

      for (const [key, referrer] of Object.entries(this.referrers)) {
        result[key] = referrer.values.map(referrer => referrer.identifier);
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

  getNormalizedReferrer<N extends KnownNode | Node<any>>(referenceId: string): Referrer<N> {
    return this.referrers[referenceId] as Referrer<N> || new Referrer<N>(referenceId, [], this.metaModel, this.languages);
  }

  getProperty(property: string): Property {
    return requireDefined(this.properties[property], 'Property not found: ' + property);
  }

  getPropertyAsLocalizable(property: string): Localizable {
    return this.getProperty(property).asLocalizable();
  }

  getPropertyAsString(property: string): string {
    return this.getProperty(property).asString();
  }

  getPropertyAsValues(property: string): string[] {
    return this.getProperty(property).asValues();
  }
}

export class VocabularyNode extends Node<VocabularyNodeType> {

  constructor(node: NodeExternal<VocabularyNodeType>, metaModel: MetaModel,languages: string[], persistent: boolean) {
    super(node, metaModel, languages, persistent);
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

  hasPublisher() {
    return !this.references['publisher'].empty;
  }

  get group(): GroupNode {
    return requireSingle(this.references['inGroup'].values) as GroupNode;
  }

  hasGroup() {
    return !this.references['inGroup'].empty;
  }

  setPrimaryLabel(language: string, value: string) {
    const matchingLocalization = this.findLabelLocalizationForLanguage(language) || this.anyLabelLocalization() || this.createLabelLocalization(language);
    matchingLocalization.value = value;
  }

  private createLabelLocalization(language: string) {
    this.properties['prefLabel'].newLocalization(language);
    return this.anyLabelLocalization();
  }

  private findLabelLocalizationForLanguage(language: string): Localization|undefined {
    return (this.properties['prefLabel'].attributes).find(localization => localization.lang === language);
  }

  private anyLabelLocalization(): Localization {
    return this.properties['prefLabel'].attributes[0];
  }
}

export class ConceptNode extends Node<'Concept'> {

  constructor(node: NodeExternal<'Concept'>, metaModel: MetaModel, languages: string[], persistent: boolean) {
    super(node, metaModel, languages, persistent);
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

  hasVocabulary() {
    return this.meta.hasReference('inScheme');
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

  hasTerms() {
    return this.meta.hasReference('prefLabelXl');
  }

  get terms(): Reference<TermNode> {
    return this.references['prefLabelXl'];
  }

  setPrimaryLabel(language: string, value: string) {
    if (this.hasTerms()) {
      const matchingTerm = this.findTermForLanguage(language) || this.terms.values[0];
      matchingTerm.value = value;
    } else {
      const matchingLocalization = this.findLabelLocalizationForLanguage(language) || this.anyLabelLocalization() || this.createLabelLocalization(language);
      matchingLocalization.value = value;
    }
  }

  private findTermForLanguage(language: string): TermNode|undefined {
    return this.terms.values.find(term => term.language === language);
  }

  private findLabelLocalizationForLanguage(language: string): Localization|undefined {
    return (this.properties['prefLabel'].attributes as Localization[]).find(localization => localization.lang === language);
  }

  private createLabelLocalization(language: string) {
    this.properties['prefLabel'].newLocalization(language);
    return this.anyLabelLocalization();
  }

  private anyLabelLocalization(): Localization {
    return this.properties['prefLabel'].attributes[0] as Localization;
  }

  hasRelatedConcepts() {
    return this.meta.hasReference('related');
  }

  get relatedConcepts(): Reference<ConceptNode> {
    return this.references['related'];
  }

  hasBroaderConcepts() {
    return this.meta.hasReference('broader');
  }

  get broaderConcepts(): Reference<ConceptNode> {
    return this.references['broader'];
  }

  get narrowerConcepts(): Referrer<ConceptNode> {
    return this.getNormalizedReferrer<ConceptNode>('broader');
  }

  hasIsPartOfConcepts() {
    return this.meta.hasReference('isPartOf');
  }

  get isPartOfConcepts(): Reference<ConceptNode> {
    return this.references['isPartOf'];
  }

  get partOfThisConcepts(): Referrer<ConceptNode> {
    return this.getNormalizedReferrer<ConceptNode>('isPartOf');
  }
}

export class TermNode extends Node<'Term'> {

  constructor(node: NodeExternal<'Term'>, metaModel: MetaModel, languages: string[], persistent: boolean) {
    super(node, metaModel, languages, persistent);
  }

  get empty() {
    return !this.value.trim();
  }

  get language(): string {
    return this.localization.lang;
  }

  set language(value: string) {
    this.localization.lang = value;
  }

  get value() {
    return this.localization.value;
  }

  set value(value: string) {
    this.localization.value = value;
  }

  get localization(): Localization {
    return this.properties['prefLabel'].attributes[0] as Localization;
  }
}

export class CollectionNode extends Node<'Collection'> {

  constructor(node: NodeExternal<'Collection'>, metaModel: MetaModel, languages: string[], persistent: boolean) {
    super(node, metaModel, languages, persistent);
  }

  clone(): CollectionNode {
    return super.clone<CollectionNode>();
  }

  setPrimaryLabel(language: string, value: string) {
    const matchingLocalization = this.findLabelLocalizationForLanguage(language) || this.anyLabelLocalization() || this.createLabelLocalization(language);
    matchingLocalization.value = value;
  }

  private findLabelLocalizationForLanguage(language: string): Localization|undefined {
    return (this.properties['prefLabel'].attributes).find(localization => localization.lang === language);
  }

  private anyLabelLocalization(): Localization {
    return this.properties['prefLabel'].attributes[0];
  }

  private createLabelLocalization(language: string) {
    this.properties['prefLabel'].newLocalization(language);
    return this.anyLabelLocalization();
  }

  get label(): Localizable {
    return this.getPropertyAsLocalizable('prefLabel');
  }

  get definition(): Localizable {
    return this.getPropertyAsLocalizable('definition');
  }

  get memberConcepts(): Reference<ConceptNode> {
    return this.references['member'];
  }

  hasBroaderConcepts() {
    return this.meta.hasReference('broader');
  }
  get broaderConcepts(): Reference<ConceptNode> {
    return this.references['broader'];
  }
}

export class GroupNode extends Node<'Group'> {

  constructor(node: NodeExternal<'Group'>, metaModel: MetaModel, languages: string[], persistent: boolean) {
    super(node, metaModel, languages, persistent);
  }

  get label(): Localizable {
    return this.getPropertyAsLocalizable('prefLabel');
  }
}

export class OrganizationNode extends Node<'Organization'> {

  constructor(node: NodeExternal<'Organization'>, metaModel: MetaModel, languages: string[], persistent: boolean) {
    super(node, metaModel, languages, persistent);
  }

  get label(): Localizable {
    return this.getPropertyAsLocalizable('prefLabel');
  }
}
