import { asLocalizable, Localizable, combineLocalizables, isLocalization, Localization } from './localization';
import { requireDefined } from '../utils/object';
import { normalizeAsArray, filter } from '../utils/array';
import { NodeExternal, NodeType, Attribute } from './node-api';
import { PropertyMeta, ReferenceMeta, NodeMeta } from './meta';

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
    return this.meta.targetType === 'Term';
  }
}

export class Node<T extends NodeType> {

  id: string;
  uri: string;
  meta: NodeMeta;

  graphId: string;

  createdDate: string;
  lastModifiedDate: string;

  properties: { [key: string]: Property } = {};
  references: { [key: string]: Reference } = {};

  constructor(node: NodeExternal<T>, metas: Map<string, NodeMeta>) {

    this.meta = metas.get(node.type.id)!;

    this.id = node.id;
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
    this.createdDate = node.createdDate;
    this.lastModifiedDate = node.lastModifiedDate;
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

  getPropertyAsLocalizable(property: string): Localizable {
    const propertyValue = requireDefined(this.properties[property]).value;

    if (typeof propertyValue === 'string') {
      throw new Error('Property must be localizable');
    }

    return asLocalizable(propertyValue);
  }
}
