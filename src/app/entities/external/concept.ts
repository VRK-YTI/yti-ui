import { NodeExternal } from './node';
import { Attribute } from '../attribute';
import { Localization } from '../localization';

export interface ConceptListNode extends NodeExternal<'Concept'> {

  properties: {
    definition: Attribute[];
    term_status: Attribute[];
  };

  references: {
    prefLabelXl: ConceptListTermNode[]
  };

  referrers: {};
}

export interface ConceptDetailsNode extends NodeExternal<'Concept'> {

  properties: {
    definition: Localization[];
    term_status: Attribute[];
  };

  references: {
    inScheme: NodeExternal<'ConceptScheme'>[],
    prefLabelXl: ConceptDetailsTermNode[],
    related: NodeExternal<'Concept'>[]
  };

  referrers: {
    hasTopConcept: NodeExternal<'Concept'>[],
    member: NodeExternal<'Collection'>[],
    related: NodeExternal<'Concept'>[]
  };
}

export interface ConceptListTermNode extends NodeExternal<'Term'> {

  properties: {
    prefLabel: Localization[];
  };
}

export interface ConceptDetailsTermNode extends NodeExternal<'Term'> {

  properties: {
    prefLabel: Localization[];
  };
}
