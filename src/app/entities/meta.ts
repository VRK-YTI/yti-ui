import { ReferenceAttributeInternal, TextAttributeInternal, NodeMetaInternal } from './meta-api';
import { comparingNumber } from '../utils/comparator';
import { normalizeAsArray } from '../utils/array';
import { asLocalizable, Localizable } from './localization';
import { NodeType } from './node-api';

export type PropertyType = 'localizable' | 'translation-key' | 'string';

export class PropertyMeta {

  id: string;
  label: Localizable;
  regex?: string;
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
      case 'term_status':
      case 'termStatus':
        return 'translation-key';
      default:
        return 'string';
    }
  }
}

export class ReferenceMeta {

  id: string;
  label: Localizable;
  targetType: NodeType;
  index: number;

  constructor(referenceAttribute: ReferenceAttributeInternal) {

    this.id = referenceAttribute.id;
    this.label = asLocalizable(referenceAttribute.properties.prefLabel);
    this.targetType = referenceAttribute.range.id;
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

  constructor(metaNode: NodeMetaInternal) {

    this.label = asLocalizable(metaNode.properties.prefLabel);
    this.type = metaNode.id;

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
}
