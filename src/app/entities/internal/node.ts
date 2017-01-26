import { Identifier } from '../identifier';
import { Attribute } from '../attribute';

export interface NodeInternal<T> extends Identifier<T> {

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
