import { Localization } from '../localization';

export interface MetaModel {

  id: string;
  uri: string;
  index: number;
  graph: { id: string };
  permissions: any[];
  properties: {
    prefLabel: Localization[]
  },
  textAttributes: TextAttribute[],
  referenceAttributes: ReferenceAttribute[]
}

export interface TextAttribute {

  regex: string;
  id: string;
  uri: string;
  index: number;
  domain: { id: string, graph: { id: string } },
  permissions: any[],
  properties: {
    prefLabel: Localization[]
  }
}

export interface ReferenceAttribute {

  range: { id: string, graph: { id: string } },
  id: string,
  uri: string,
  index: number,
  domain: { id: string, graph: { id: string } },
  permissions: any[],
  properties: {
    prefLabel: Localization[]
  }
}
