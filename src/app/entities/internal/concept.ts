import { NodeInternal } from './node';
import { Identifier } from '../identifier';
import { Attribute } from '../attribute';

export interface ConceptInternal extends NodeInternal<'Concept'> {

  properties: {
    definition: Attribute[];
    term_status: Attribute[];
  };

  references: {
    inScheme: Identifier<'ConceptScheme'>[],
    prefLabelXl: Identifier<'Term'>[],
    related: Identifier<'Concept'>[]
  };

  referrers: {
    hasTopConcept: Identifier<'Concept'>[],
    member: Identifier<'Collection'>[],
    related: Identifier<'Concept'>[]
  };
}
