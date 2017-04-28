import { Localization } from './localization';
import { Attribute, NodeType } from './node-api';

export interface NodeMetaInternal {

  id: NodeType;
  uri: string;
  index: number;
  graph: { id: string };
  permissions: {};
  properties: {
    prefLabel: Localization[]
  };
  textAttributes: TextAttributeInternal[];
  referenceAttributes: ReferenceAttributeInternal[];
}

export interface TextAttributeInternal {

  regex: string;
  id: string;
  uri: string;
  index: number;
  domain: { id: NodeType, graph: { id: string } };
  permissions: {};
  properties: {
    prefLabel: Localization[],
    type: Attribute[]
  };
}

export interface ReferenceAttributeInternal {

  range: { id: NodeType, graph: { id: string } };
  id: string;
  uri: string;
  index: number;
  domain: { id: NodeType, graph: { id: string } };
  permissions: {};
  properties: {
    prefLabel: Localization[]
  };
}
