import { asLocalizable, Localizable, combineLocalizables, isLocalization, Localization } from './localization';
import { requireDefined } from '../utils/object';
import { normalizeAsArray, filter } from '../utils/array';
import { NodeExternal, NodeType, Attribute, Identifier, NodeInternal } from './node-api';
import { PropertyMeta, ReferenceMeta, NodeMeta } from './meta';
import { Moment } from 'moment';
import * as moment from 'moment';

export class Property {

  value: string|Localization[];

  constructor(attributes: Attribute[], public meta: PropertyMeta) {

    if (this.localizable()) {
      this.value = filter(attributes, isLocalization);
    } else {
      // TODO: cardinality
      if (attributes.length > 0) {
        this.value = attributes[0].value;
      } else {
        this.value = '';
      }
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

  constructor(nodes: NodeExternal<any>[], public meta: ReferenceMeta, metas: Map<string, NodeMeta>) {
    this.values = nodes.map(node => new Node<any>(node, metas));
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
}

export class Node<T extends NodeType> {

  meta: NodeMeta;

  properties: { [key: string]: Property } = {};
  references: { [key: string]: Reference } = {};
  referrers: { [key: string]: Node<any>[] } = {};

  constructor(private node: NodeExternal<T>, private metas: Map<string, NodeMeta>) {

    this.meta = metas.get(node.type.id)!;

    for (const propertyMeta of this.meta.properties) {
      const property = normalizeAsArray(node.properties[propertyMeta.id]);
      this.properties[propertyMeta.id] = new Property(property, propertyMeta);
    }

    for (const referenceMeta of this.meta.references) {
      const reference = normalizeAsArray(node.references[referenceMeta.id]);
      this.references[referenceMeta.id] = new Reference(reference, referenceMeta, metas);
    }

    for (const [name, referrerNodes] of Object.entries(node.referrers)) {
      this.referrers[name] = normalizeAsArray(referrerNodes).map(referrerNode => new Node<any>(referrerNode, metas));
    }
  }

  toInternalNode(): NodeInternal<T> {
    // TODO: would be better to not send inlined objects as references but only id and type (Identifier)
    return this.node;
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

  get createdDate() {
    return moment(this.node.createdDate);
  }

  get lastModifiedDate() {
    return moment(this.node.lastModifiedDate);
  }

  set lastModifiedDate(date: Moment) {
    this.node.lastModifiedDate = date.toISOString();
  }

  clone() {
    return new Node<T>(JSON.parse(JSON.stringify(this.node)), this.metas);
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

  get definition(): Localizable {
    return this.getPropertyAsLocalizable('definition');
  }

  get status(): string {
    if (this.properties['term_status']) {
      return this.getPropertyAsString('term_status');
    } else if (this.properties['termStatus']) {
      return this.getPropertyAsString('termStatus');
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
