import { Identifier } from './identifier';

export interface Node<T> extends Identifier<T> {

  code: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  uri: string;

  properties: { [key: string]: Attribute[] };
  references: { [key: string]: Identifier<string>[] };
  referrers: { [key: string]: Identifier<string>[] };
}

export interface Attribute {

  lang: string;
  regex: string;
  value: string;
}
