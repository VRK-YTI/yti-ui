import { asLocalizable, Localizable, combineLocalizables, Localization } from './localization';
import { requireDefined, assertNever } from '../utils/object';
import { normalizeAsArray, any, requireSingle } from '../utils/array';
import { NodeExternal, NodeType, Attribute, Identifier, NodeInternal } from './node-api';
import { PropertyMeta, ReferenceMeta, NodeMeta } from './meta';
import { Moment } from 'moment';
import * as moment from 'moment';

export class Property {

  value: string|Localization[];

  constructor(attributes: Attribute[], public meta: PropertyMeta, private languages: string[]) {

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

export class Reference {

  values: Node<any>[];

  constructor(nodes: NodeExternal<any>[], public meta: ReferenceMeta, metas: Map<string, Map<string, NodeMeta>>, languages: string[]) {
    if (this.term) {

      this.values = [];
      const nodeMeta = requireDefined(requireDefined(metas.get(meta.graphId)).get(meta.targetType));

      for (const language of languages) {

        const node = nodes.find(node => {
          const prefLabel = node.properties['prefLabel'];
          return prefLabel && prefLabel[0].lang === language
        });

        if (node) {
          this.values.push(new Node<any>(node, metas, [language]));
        } else {
          this.values.push(new Node<any>(nodeMeta.createEmptyNode(), metas, [language]));
        }
      }
    } else {
      this.values = nodes.map(node => new Node<any>(node, metas, languages));
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
      return !any(this.values, term => !!(term.properties['prefLabel'].value as Localization[])[0].value.trim());
    } else {
      return this.values.length === 0;
    }
  }
}

export class Node<T extends NodeType> {

  meta: NodeMeta;

  properties: { [key: string]: Property } = {};
  references: { [key: string]: Reference } = {};
  referrers: { [key: string]: Node<any>[] } = {};

  constructor(private node: NodeExternal<T>, private metas: Map<string, Map<string, NodeMeta>>, private languages: string[]) {

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
      this.referrers[name] = normalizeAsArray(referrerNodes).map(referrerNode => new Node<any>(referrerNode, metas, languages));
    }
  }

  private toNode() {

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

  toExternalNode(): NodeExternal<T> {

    const extractReferences = () => {
      const result: { [key: string]: NodeExternal<any>[] } = {};

      for (const [key, reference] of Object.entries(this.references)) {
        result[key] = reference.values.map(node => node.toExternalNode());
      }

      return result;
    };

    return Object.assign(this.toNode(), {
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

    return Object.assign(this.toNode(), {
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

  clone() {
    return new Node<T>(JSON.parse(JSON.stringify(this.toExternalNode())), this.metas, this.languages);
  }

  get concept(): boolean {
    return this.meta.concept;
  }

  get term(): boolean {
    return this.meta.term;
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

  get description(): Localizable {
    return this.getPropertyAsLocalizable('description');
  }

  get publisher(): Node<any> {
    return requireSingle(this.references['publisher'].values);
  }

  get group(): Node<any> {
    return requireSingle(this.references['inGroup'].values);
  }

  get typeLabel(): Localizable {
    return this.meta.label;
  }

  get status(): string {
    if (this.properties['status']) {
      return this.getPropertyAsString('status');
    } else {
      throw new Error('Status not found');
    }
  }

  getPropertyAsLocalizable(property: string): Localizable {
    const propertyValue = requireDefined(this.properties[property]).value;

    if (typeof propertyValue === 'string') {
      throw new Error('Property must be localizable');
    }

    return asLocalizable(propertyValue);
  }

  getPropertyAsString(property: string): string {
    const propertyValue = requireDefined(this.properties[property]).value;

    if (typeof propertyValue !== 'string') {
      throw new Error('Property must be string');
    }

    return propertyValue;
  }
}
