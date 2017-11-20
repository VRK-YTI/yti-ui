import { asLocalizable, Localizable, Localization } from './localization';
import { requireDefined, isDefined } from '../utils/object';
import { normalizeAsArray, requireSingle, remove, firstMatching, flatten } from '../utils/array';
import { NodeExternal, NodeType, Attribute, Identifier, NodeInternal, VocabularyNodeType } from './node-api';
import {
  PropertyMeta, ReferenceMeta, NodeMeta, MetaModel
} from './meta';
import { Moment } from 'moment';
import * as moment from 'moment';
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

  getSingle(): Attribute {
    return requireSingle(this.attributes);
  }

  remove(attribute: Attribute) {
    remove(this.attributes, attribute);
  }

  asValues() {
    return this.attributes.map(attr => attr.value.trim()).filter(v => !!v);
  }

  asLocalizations() {
    return this.attributes as Localization[];
  }

  asLocalizable(ignoreConflicts = false) {
    return asLocalizable(this.attributes, ignoreConflicts);
  }

  setLocalizable(localizable: Localizable) {
    this.setLocalizations(Object.entries(localizable).map(([lang, value]) => ({ lang, value })));
  }

  setLocalizations(localizations: Localization[]) {
    this.attributes = localizations.map(({lang, value}) => ({ lang, value, regex: this.meta.regex }));
  }

  setValues(values: string[]) {
    this.attributes = values.map(value => ({ lang: '', value, regex: this.meta.regex }));
  }

  asString() {
    return this.asValues().join(',');
  }

  get literalValue() {
    if (this.attributes.length > 0) {
      return this.attributes[0].value;
    } else {
      return '';
    }
  }

  set literalValue(value: string) {
    this.attributes = [{ lang: '', value, regex: this.meta.regex }];
  }
}

export class Reference<N extends KnownNode | Node<any>> {

  values: N[];

  constructor(nodes: NodeExternal<any>[], public meta: ReferenceMeta, private metaModel: MetaModel) {
    this.values = nodes.map(node => Node.create(node, metaModel, true) as N);
  }

  addNewReference(): N {
    const value = Node.create(this.targetMeta.createEmptyNode(), this.metaModel, false) as N;
    this.values.push(value);
    return value;
  }

  getSingle(): N {
    return requireSingle(this.values);
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

export class Referrer {

  constructor(public referenceId: string, public values: NodeExternal<any>[]) {
  }
}

export class Node<T extends NodeType> {

  meta: NodeMeta;

  private properties: { [key: string]: Property } = {};
  private references: { [key: string]: Reference<any> } = {};
  private referrers: { [key: string]: Referrer } = {};

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
      this.referrers[name] = new Referrer(name, normalizeAsArray(referrerNodes));
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

  private toNodeWithoutReferencesAndReferrers() {

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
        result[key] = referrer.values.map(ref => ({
          id: ref.id,
          type: ref.type
        }));
      }

      return result;
    };

    return Object.assign(this.toNodeWithoutReferencesAndReferrers(), {
      referrers: extractReferrers(),
      references: extractReferences()
    });
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

  getAllProperties(): Property[] {
    return Object.values(this.properties);
  }

  getAllReferences(): Reference<any>[] {
    return Object.values(this.references);
  }

  getAllReferrers(): Referrer[] {
    return Object.values(this.referrers);
  }

  getNormalizedReferrer<N extends NodeType>(referenceId: string): Referrer {
    return this.referrers[referenceId] || new Referrer(referenceId, []);
  }

  getReference<N extends KnownNode | Node<any>>(referenceId: string): Reference<N> {
    return requireDefined(this.findReference<N>(referenceId), 'Reference not found: ' + referenceId);
  }

  findReference<N extends KnownNode | Node<any>>(referenceId: string): Reference<N>|null {
    return this.references[referenceId] || null;
  }

  getProperty(propertyName: string): Property {
    return requireDefined(this.findProperty(propertyName), 'Property not found: ' + propertyName);
  }

  findProperty(propertyName: string): Property|null {
    return this.properties[propertyName] || null;
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
    return asLocalizable(this.prefLabel);
  }

  get description(): Localizable {
    // FIXME: How to handle multiple descriptions?
    return this.getProperty('description').asLocalizable(true);
  }

  set prefLabel(value: Localization[]) {
    this.getProperty('prefLabel').setLocalizations(value);
  }

  get prefLabel(): Localization[] {
    return this.getProperty('prefLabel').asLocalizations();
  }

  get publishers(): OrganizationNode[] {
    return this.getReference<OrganizationNode>('publisher').values;
  }

  hasLanguage() {
    return this.meta.hasProperty('language')
  }

  get languages(): string[] {
    if (this.meta.hasProperty('language')) {
      const languages = this.getProperty('language').asValues();
      return languages.length > 0 ? languages : defaultLanguages;
    } else {
      return defaultLanguages;
    }
  }

  set languages(value: string[]) {
    this.getProperty('language').setValues(value);
  }

  get groups(): GroupNode[] {
    return this.getReference<GroupNode>('inGroup').values;
  }

  hasGroup() {
    return !this.getReference('inGroup').empty;
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
    return asLocalizable(this.prefLabel);
  }

  get prefLabel(): Localization[] {
    return this.getTermOrPropertyLabel('prefLabelXl', 'prefLabel');
  }

  set prefLabel(localizations: Localization[]) {
    this.setTermOrPropertyLabel('prefLabelXl', 'prefLabel', localizations);
  }

  get altLabel(): Localization[] {
    return this.getTermOrPropertyLabel('altLabelXl', 'altLabel');
  }

  set altLabel(value: Localization[]) {
    this.setTermOrPropertyLabel('altLabelXl', 'altLabel', value);
  }

  get example(): Localization[] {
    return this.getProperty('example').asLocalizations();
  }

  set example(value: Localization[]) {
    this.getProperty('example').setLocalizations(value);
  }

  get note(): Localization[] {
    return this.getProperty('note').asLocalizations();
  }

  set note(value: Localization[]) {
    this.getProperty('note').setLocalizations(value);
  }

  private getTermOrPropertyLabel(termName: string, propertyName: string) {

    const labelProperty = this.findProperty(propertyName);
    const termReference = this.findReference<TermNode>(termName);

    if (labelProperty) {
      return labelProperty.asLocalizations();
    } else if (termReference) {
      return flatten(termReference.values.map(term => term.getProperty('prefLabel').asLocalizations()));
    } else {
      throw new Error('No label found');
    }
  }

  private setTermOrPropertyLabel(termName: string, propertyName: string, localizations: Localization[]) {

    const labelProperty = this.findProperty(propertyName);
    const termReference = this.findReference<TermNode>(termName);

    if (labelProperty) {
      labelProperty.setLocalizations(localizations);
    } else if (termReference) {

      for (const {lang, value} of localizations) {
        const term = firstMatching(termReference.values, t => t.language === lang) || termReference.addNewReference();
        term.prefLabel = { [lang]: value };
      }
    }
  }

  get definition(): Localization[] {
    return this.getProperty('definition').asLocalizations();
  }

  get definitionAsLocalizable(): Localizable {
    return asLocalizable(this.definition);
  }

  set definition(value: Localization[]) {
    this.getProperty('definition').setLocalizations(value);
  }

  isTargetOfLink(link: string) {
    // FIXME: proper mapping
    return (isDefined(this.code) && (link.indexOf(this.code) !== -1)) || link.indexOf(this.id) !== -1;
  }

  hasVocabulary() {
    return this.meta.hasReference('inScheme');
  }

  get vocabulary(): VocabularyNode {
    return this.getReference<VocabularyNode>('inScheme').getSingle();
  }

  set vocabulary(vocabulary: VocabularyNode) {
    this.getReference<VocabularyNode>('inScheme').values = [vocabulary];
  }

  get status(): string {
    return this.getProperty('status').asString();
  }

  hasRelatedConcepts() {
    return this.meta.hasReference('related');
  }

  get relatedConcepts(): Reference<ConceptNode> {
    return this.getReference<ConceptNode>('related');
  }

  hasBroaderConcepts() {
    return this.meta.hasReference('broader');
  }

  get broaderConcepts(): Reference<ConceptNode> {
    return this.getReference<ConceptNode>('broader');
  }

  get narrowerConcepts(): Referrer {
    return this.getNormalizedReferrer<'Concept'>('broader');
  }

  hasIsPartOfConcepts() {
    return this.meta.hasReference('isPartOf');
  }

  get isPartOfConcepts(): Reference<ConceptNode> {
    return this.getReference<ConceptNode>('isPartOf');
  }

  get partOfThisConcepts(): Referrer {
    return this.getNormalizedReferrer<'Concept'>('isPartOf');
  }
}

export class TermNode extends Node<'Term'> {

  constructor(node: NodeExternal<'Term'>, metaModel: MetaModel, persistent: boolean) {
    super(node, metaModel, persistent);
  }

  get language(): string {

    const attribute = this.getProperty('prefLabel').getSingle();

    if (attribute.lang.trim() === '') {
      throw new Error('Cannot determine language');
    }

    return attribute.lang;
  }

  isValid() {
    const prefLabel = this.findProperty('prefLabel');
    return prefLabel && prefLabel.attributes.length === 1 && prefLabel.getSingle().lang !== '';
  }

  get prefLabel(): Localizable {
    return this.getProperty('prefLabel').asLocalizable();
  }

  set prefLabel(value: Localizable) {
    this.getProperty('prefLabel').setLocalizable(value);
  }
}

export class ConceptLinkNode extends Node<'ConceptLink'> {

  constructor(node: NodeExternal<'ConceptLink'>, metaModel: MetaModel, persistent: boolean) {
    super(node, metaModel, persistent);
  }

  get label(): Localizable {
    return asLocalizable(this.prefLabel);
  }

  get prefLabel(): Localization[] {
    return this.getProperty('prefLabel').asLocalizations();
  }

  set prefLabel(value: Localization[]) {
    this.getProperty('prefLabel').setLocalizations(value);
  }

  get vocabularyMetaLabel(): Localizable {
    return this.getProperty('vocabularyLabel').meta.label;
  }

  get vocabularyLabel(): Localizable {
    return this.getProperty('vocabularyLabel').asLocalizable();
  }

  set vocabularyLabel(value: Localizable) {
    this.getProperty('vocabularyLabel').setLocalizable(value);
  }

  get targetGraph(): string {
    return this.getProperty('targetGraph').literalValue;
  }

  set targetGraph(value: string) {
    this.getProperty('targetGraph').literalValue = value;
  }

  get targetId(): string {
    return this.getProperty('targetId').literalValue;
  }

  set targetId(value: string) {
    this.getProperty('targetId').literalValue = value;
  }
}

export class CollectionNode extends Node<'Collection'> {

  constructor(node: NodeExternal<'Collection'>, metaModel: MetaModel, persistent: boolean) {
    super(node, metaModel, persistent);
  }

  clone(): CollectionNode {
    return super.clone<CollectionNode>();
  }

  get label(): Localizable {
    return asLocalizable(this.prefLabel);
  }

  get prefLabel(): Localization[] {
    return this.getProperty('prefLabel').asLocalizations();
  }

  set prefLabel(value: Localization[]) {
    this.getProperty('prefLabel').setLocalizations(value);
  }

  get definition(): Localization[] {
    return this.getProperty('definition').asLocalizations();
  }

  set definition(value: Localization[]) {
    this.getProperty('definition').setLocalizations(value);
  }

  get memberConcepts(): Reference<ConceptNode> {
    return this.getReference<ConceptNode>('member');
  }

  hasBroaderConcepts() {
    return this.meta.hasReference('broader');
  }

  get broaderConcepts(): Reference<ConceptNode> {
    return this.getReference<ConceptNode>('broader')
  }
}

export class GroupNode extends Node<'Group'> {

  constructor(node: NodeExternal<'Group'>, metaModel: MetaModel, persistent: boolean) {
    super(node, metaModel, persistent);
  }

  get label(): Localizable {
    return this.getProperty('prefLabel').asLocalizable();
  }
}

export class OrganizationNode extends Node<'Organization'> {

  constructor(node: NodeExternal<'Organization'>, metaModel: MetaModel, persistent: boolean) {
    super(node, metaModel, persistent);
  }

  get label(): Localizable {
    return this.getProperty('prefLabel').asLocalizable();
  }
}
