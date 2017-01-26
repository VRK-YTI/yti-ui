import { Identifier } from '../identifier';
import { Attribute } from '../attribute';

export interface NodeExternal<T> extends Identifier<T> {

  code: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  uri: string;

  properties: { [key: string]: Attribute[] };
  references: { [key: string]: NodeExternal<any>[] };
  referrers: { [key: string]: NodeExternal<any>[] };
}
