import { asLocalizable, Localizable, combineLocalizables, Localization } from './localization';
import { requireDefined, isDefined } from '../utils/object';
import { normalizeAsArray, requireSingle, remove } from '../utils/array';
import { NodeExternal, NodeType, Attribute, Identifier, NodeInternal, VocabularyNodeType } from './node-api';
import {
  PropertyMeta, ReferenceMeta, NodeMeta, MetaModel
} from './meta';
import { Moment } from 'moment';
import * as moment from 'moment';
import { getOrCreate } from '../utils/map';
import { defaultLanguages } from '../utils/language';

export type KnownNode = VocabularyNode
                      | ConceptNode
                      | TermNode
                      | CollectionNode
                      | GroupNode
                      | OrganizationNode;

export class Property {

  constructor(public attributes: Attribute[], public meta: PropertyMeta) {
  }

  remove(attribute: Attribute) {
    remove(this.attributes, attribute);
  }

  asValues() {
    return this.attributes.map(attr => attr.value.trim()).filter(v => !!v);
  }

  asLocalizable() {
    return asLocalizable(this.attributes);
  }

  setLocalizable(localizable: Localizable) {
    this.attributes = Object.entries(localizable).map(([lang, value]) => ({ lang, value, regex: this.meta.regex }));
  }

  setLiteralValue(value: string) {
    this.attributes = [{ lang: '', value, regex: this.meta.regex }];
  }

  setValues(values: string[]) {
    this.attributes = values.map(value => ({ lang: '', value, regex: this.meta.regex }));
  }

  asString() {
    return this.asValues().join(',');
  }

  newLocalization(lang: string, value = '') {
    this.attributes.push({ lang, value, regex: this.meta.regex });
  }

  get literalValue() {
    if (this.attributes.length > 0) {
      return this.attributes[0].value;
    } else {
      return '';
    }
  }
}

export class Reference<N extends KnownNode | Node<any>> {

  values: N[];

  constructor(nodes: NodeExternal<any>[], public meta: ReferenceMeta, private metaModel: MetaModel) {
    this.values = nodes.map(node => Node.create(node, metaModel, true) as N);
  }

  createNewReference() {
    return Node.create(this.targetMeta.createEmptyNode(), this.metaModel, false) as N;
  }

  get targetMeta() {
    return this.metaModel.getNodeMeta(this.meta.graphId, this.meta.targetType);
  }

  get type() {
    return this.meta.referenceType;
  }

  get term(): boolean {
    return this.meta.term;
  }

  get conceptLink(): boolean {
    return this.meta.conceptLink;
  }

  get concept(): boolean {
    return this.meta.concept;
  }

  get inline(): boolean {
    return this.term || this.conceptLink;
  }

  toIdentifiers(): Identifier<any>[] {
    return this.values.map(node => node.identifier);
  }

  get empty() {
    return this.values.length === 0;
  }
}

export class Referrer<N extends KnownNode | Node<any>> {

  values: N[];
  valuesByMeta: { meta: ReferenceMeta, nodes: N[] }[] = [];

  constructor(referenceId: string, referrers: NodeExternal<any>[], metaModel: MetaModel) {

    this.values = referrers.map(referrer => Node.create(referrer, metaModel, true) as N);

    const references = new Map<ReferenceMeta, N[]>();

    for (const value of this.values) {
      const meta = value.meta.references.find(ref => ref.id === referenceId);
      getOrCreate(references, meta, () => []).push(value);
    }

    for (const [meta, nodes] of Array.from(references.entries())) {
      this.valuesByMeta.push({meta, nodes});
    }
  }
}

export class Node<T extends NodeType> {

  meta: NodeMeta;

  properties: { [key: string]: Property } = {};
  references: { [key: string]: Reference<any> } = {};
  referrers: { [key: string]: Referrer<Node<any>> } = {};

  protected constructor(protected node: NodeExternal<T>,
                        protected metaModel: MetaModel,
                        public persistent: boolean) {

    this.meta = metaModel.getNodeMeta(this.graphId, this.type);

    for (const propertyMeta of this.meta.properties) {
      const property = normalizeAsArray(node.properties[propertyMeta.id]);
      this.properties[propertyMeta.id] = new Property(property, propertyMeta);
    }

    for (const referenceMeta of this.meta.references) {
      const reference = normalizeAsArray(node.references[referenceMeta.id]);
      this.references[referenceMeta.id] = new Reference(reference, referenceMeta, metaModel);
    }

    for (const [name, referrerNodes] of Object.entries(node.referrers)) {
      this.referrers[name] = new Referrer(name, normalizeAsArray(referrerNodes), metaModel);
    }
  }

  static create(node: NodeExternal<any>, metaModel: MetaModel, persistent: boolean): KnownNode | Node<any> {
    switch (node.type.id) {
      case 'Vocabulary':
      case 'TerminologicalVocabulary':
        return new VocabularyNode(node, metaModel, persistent);
      case 'Concept':
        return new ConceptNode(node, metaModel, persistent);
      case 'ConceptLink':
        return new ConceptLinkNode(node, metaModel, persistent);
      case 'Term':
        return new TermNode(node, metaModel, persistent);
      case 'Collection':
        return new CollectionNode(node, metaModel, persistent);
      case 'Group':
        return new GroupNode(node, metaModel, persistent);
      case 'Organization':
        return new OrganizationNode(node, metaModel, persistent);
      default:
        return new Node<any>(node, metaModel, persistent);
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

    const cloned = Node.create(JSON.parse(JSON.stringify(this.toExternalNode())), this.metaModel, this.persistent) as N;
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
    return this.referrers[referenceId] as Referrer<N> || new Referrer<N>(referenceId, [], this.metaModel);
  }

  getProperty(propertyName: string): Property {
    return requireDefined(this.properties[propertyName], 'Property not found: ' + propertyName);
  }

  getPropertyAsLocalizable(propertyName: string): Localizable {
    return this.getProperty(propertyName).asLocalizable();
  }

  setPropertyAsLocalizable(propertyName: string, localizable: Localizable) {
    this.getProperty(propertyName).setLocalizable(localizable);
  }

  getPropertyAsString(property: string): string {
    return this.getProperty(property).asString();
  }

  setPropertyAsLiteral(property: string, value: string) {
    this.getProperty(property).setLiteralValue(value);
  }

  getPropertyAsValues(property: string): string[] {
    return this.getProperty(property).asValues();
  }

  setPropertyAsValues(property: string, values: string[]) {
    this.getProperty(property).setValues(values);
  }
}

export class VocabularyNode extends Node<VocabularyNodeType> {

  constructor(node: NodeExternal<VocabularyNodeType>, metaModel: MetaModel, persistent: boolean) {
    super(node, metaModel, persistent);
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

  get languages(): string[] {
    if (this.meta.hasProperty('language')) {
      return this.getPropertyAsValues('language');
    } else {
      return defaultLanguages;
    }
  }

  set languages(value: string[]) {
    this.setPropertyAsValues('language', value);
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

  constructor(node: NodeExternal<'Concept'>, metaModel: MetaModel, persistent: boolean) {
    super(node, metaModel, persistent);
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

  isTargetOfLink(link: string) {
    // FIXME: proper mapping
    return (isDefined(this.code) && (link.indexOf(this.code) !== -1)) || link.indexOf(this.id) !== -1;
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

  hasPrimaryTerm() {
    return this.meta.hasReference('prefLabelXl');
  }

  get primaryTerm(): Reference<TermNode> {
    return this.references['prefLabelXl'];
  }

  setPrimaryLabel(language: string, value: string) {
    if (this.hasPrimaryTerm()) {
      const matchingTerm = this.findPrimaryTermForLanguage(language) || this.primaryTerm.values[0];
      matchingTerm.setLocalization(language, value);
    } else {
      const matchingLocalization = this.findLabelLocalizationForLanguage(language) || this.anyLabelLocalization() || this.createLabelLocalization(language);
      matchingLocalization.value = value;
    }
  }

  private findPrimaryTermForLanguage(language: string): TermNode|undefined {
    return this.primaryTerm.values.find(term => term.language === language);
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
}

export class TermNode extends Node<'Term'> {

  constructor(node: NodeExternal<'Term'>, metaModel: MetaModel, persistent: boolean) {
    super(node, metaModel, persistent);
  }

  setLocalization(language: string, value: string) {
    this.setPropertyAsLocalizable('prefLabel', { [language]: value });
  }

  hasLocalization() {
    const prefLabel = this.properties['prefLabel'];
    return prefLabel && prefLabel.attributes.length > 0 && prefLabel.attributes[0].lang.trim() !== '';
  }

  get language(): string {

    if (!this.hasLocalization()) {
      throw new Error('Term has no localization');
    }

    return this.properties['prefLabel'].attributes[0].lang;
  }

  get localization(): string {

    if (!this.hasLocalization()) {
      throw new Error('Term has no localization');
    }

    return this.properties['prefLabel'].attributes[0].value || '';
  }
}

export class ConceptLinkNode extends Node<'ConceptLink'> {

  constructor(node: NodeExternal<'ConceptLink'>, metaModel: MetaModel, persistent: boolean) {
    super(node, metaModel, persistent);
  }

  get label(): Localizable {
    return this.getPropertyAsLocalizable('prefLabel');
  }

  set label(value: Localizable) {
    this.setPropertyAsLocalizable('prefLabel', value);
  }

  get vocabularyLabel(): Localizable {
    return this.getPropertyAsLocalizable('vocabularyLabel');
  }

  set vocabularyLabel(value: Localizable) {
    this.setPropertyAsLocalizable('vocabularyLabel', value);
  }

  get targetGraph(): string {
    return this.getPropertyAsString('targetGraph');
  }

  set targetGraph(value: string) {
    this.setPropertyAsLiteral('targetGraph', value);
  }

  get targetId(): string {
    return this.getPropertyAsString('targetId');
  }

  set targetId(value: string) {
    this.setPropertyAsLiteral('targetId', value);
  }
}

export class CollectionNode extends Node<'Collection'> {

  constructor(node: NodeExternal<'Collection'>, metaModel: MetaModel, persistent: boolean) {
    super(node, metaModel, persistent);
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

  constructor(node: NodeExternal<'Group'>, metaModel: MetaModel, persistent: boolean) {
    super(node, metaModel, persistent);
  }

  get label(): Localizable {
    return this.getPropertyAsLocalizable('prefLabel');
  }
}

export class OrganizationNode extends Node<'Organization'> {

  constructor(node: NodeExternal<'Organization'>, metaModel: MetaModel, persistent: boolean) {
    super(node, metaModel, persistent);
  }

  get label(): Localizable {
    return this.getPropertyAsLocalizable('prefLabel');
  }
}
