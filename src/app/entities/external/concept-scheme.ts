import { NodeExternal } from './node';
import { Localization } from '../localization';

export interface ConceptSchemeNode extends NodeExternal<'ConceptScheme'> {

  properties: {
    prefLabel: Localization[]
  };

  referrers: {};
  references: {};
}

export interface ConceptSchemeListNode extends NodeExternal<'ConceptScheme'> {

  properties: {
    prefLabel: Localization[]
  };

  referrers: {};
  references: {};
}
