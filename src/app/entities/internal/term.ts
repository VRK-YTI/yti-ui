import { NodeInternal } from './node';
import { Identifier } from '../identifier';
import { Attribute } from '../attribute';

export interface TermInternal extends NodeInternal<'Term'> {

  properties: {
    orderingNumber: Attribute[];
    prefLabel: Attribute[];
  }

  referrers: {
    prefLabelXl: Identifier<'Term'>[];
  }
}
