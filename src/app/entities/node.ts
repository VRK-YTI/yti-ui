import { asLocalizable, Localizable, combineLocalizables, isLocalization, Localization } from './localization';
import { requireDefined } from '../utils/object';
import { normalizeAsArray, filter } from '../utils/array';
import { NodeExternal, NodeType, Attribute } from './node-api';
import { PropertyMeta, ReferenceMeta, NodeMeta } from './meta';
import { Moment } from 'moment';
import * as moment from 'moment';

export class Property {

  value: string|Localization[];

  constructor(attributes: Attribute[], public meta: PropertyMeta) {

    if (meta.type === 'localizable') {
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
}

export class Node<T extends NodeType> {

  id: string;
  code: string;
  uri: string;
  meta: NodeMeta;

  graphId: string;

  createdDate: Moment;
  lastModifiedDate: Moment;

  properties: { [key: string]: Property } = {};
  references: { [key: string]: Reference } = {};

  constructor(node: NodeExternal<T>, metas: Map<string, NodeMeta>) {

    this.meta = metas.get(node.type.id)!;

    this.id = node.id;
    this.code = node.code;
    this.graphId = node.type.graph.id;

    for (const propertyMeta of this.meta.properties) {
      const property = normalizeAsArray(node.properties[propertyMeta.id]);
      this.properties[propertyMeta.id] = new Property(property, propertyMeta);
    }

    for (const referenceMeta of this.meta.references) {
      const reference = normalizeAsArray(node.references[referenceMeta.id]);
      this.references[referenceMeta.id] = new Reference(reference, referenceMeta, metas);
    }

    this.uri = node.uri;
    this.createdDate = moment(node.createdDate);
    this.lastModifiedDate = moment(node.lastModifiedDate);
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
