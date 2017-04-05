import { ReferenceAttributeInternal, TextAttributeInternal, NodeMetaInternal } from './meta-api';
import { comparingNumber } from '../utils/comparator';
import { normalizeAsArray } from '../utils/array';
import { asLocalizable, Localizable } from './localization';
import { NodeType, NodeExternal } from './node-api';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';

export type PropertyType = 'localizable' | 'status' | 'string';

export class PropertyMeta {

  id: string;
  label: Localizable;
  regex: string;
  index: number;

  constructor(textAttribute: TextAttributeInternal) {
    this.id = textAttribute.id;
    this.label = asLocalizable(textAttribute.properties.prefLabel);
    this.regex = textAttribute.regex;
    this.index = textAttribute.index;
  }

  get type(): PropertyType {

    switch(this.id) {
      case 'prefLabel':
      case 'definition':
      case 'description':
      case 'note':
        return 'localizable';
      case 'status':
        return 'status';
      default:
        return 'string';
    }
  }

  get area() {
    switch(this.id) {
      case 'definition':
      case 'description':
      case 'note':
        return true;
      default:
        return false;
    }
  }
}

export class ReferenceMeta {

  id: string;
  label: Localizable;
  targetType: NodeType;
  index: number;
  graphId: string;

  constructor(referenceAttribute: ReferenceAttributeInternal) {

    this.id = referenceAttribute.id;
    this.label = asLocalizable(referenceAttribute.properties.prefLabel);
    this.targetType = referenceAttribute.range.id;
    this.graphId = referenceAttribute.range.graph.id;
    this.index = referenceAttribute.index;
  }

  get term(): boolean {
    return this.targetType === 'Term';
  }

  get concept(): boolean {
    return this.targetType === 'Concept';
  }
}

export class NodeMeta {

  label: Localizable;
  properties: PropertyMeta[];
  references: ReferenceMeta[];
  type: NodeType;
  graphId: string;
  uri: string;

  constructor(metaNode: NodeMetaInternal) {

    this.label = asLocalizable(metaNode.properties.prefLabel);
    this.type = metaNode.id;
    this.graphId = metaNode.graph.id;
    this.uri = metaNode.uri;

    this.properties = normalizeAsArray(metaNode.textAttributes)
      .sort(comparingNumber<TextAttributeInternal>(x => x.index))
      .map(x => new PropertyMeta(x));

    this.references = normalizeAsArray(metaNode.referenceAttributes)
      .sort(comparingNumber<ReferenceAttributeInternal>(x => x.index))
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
      code: '',
      createdBy: '',
      createdDate: moment().toISOString(),
      lastModifiedBy: '',
      lastModifiedDate: moment().toISOString(),
      uri: '',
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
}
