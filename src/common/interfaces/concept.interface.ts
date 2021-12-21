import { Collection } from './collection.interface';
import { ConceptLink } from './concept-link.interface';
import { Term } from './term.interface';
import { BaseEntity, Property } from './termed-data-types.interface';

export interface Concept extends BaseEntity<'Concept'> {
  properties: {
    changeNote?: Property[];
    conceptClass?: Property[];
    conceptScope?: Property[];
    definition?: Property[];
    editorialNote?: Property[];
    example?: Property[];
    historyNote?: Property[];
    notation?: Property[];
    note?: Property[];
    source?: Property[];
    status?: Property[];
    wordClass?: Property[];
  };

  references: {
    altLabelXl?: Term[];
    broader?: Concept[];
    closeMatch?: ConceptLink[];
    exactMatch?: ConceptLink[];
    hasPart?: Concept[];
    hiddenTerm?: Term[];
    isPartOf?: Concept[];
    narrower?: Concept[];
    notRecommendedSynonym?: Term[];
    prefLabelXl?: Term[];
    related?: Concept[];
    relatedMatch: ConceptLink[];
    searchTerm?: Term[];
  };

  referrers: {
    broader?: BaseEntity<string>[]; // Concept[]?
    member?: Collection[];
    narrower?: BaseEntity<string>[]; // Concept[]?
    prefLabelXl?: Concept[];
    related?: BaseEntity<string>[]; // Concept[]?
  };
};
