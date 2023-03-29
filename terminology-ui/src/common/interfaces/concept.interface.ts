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
    externalLink?: Property[];
    editorialNote?: Property[];
    example?: Property[];
    historyNote?: Property[];
    notation?: Property[];
    note?: Property[];
    source?: Property[];
    status?: Property[];
    subjectArea?: Property[];
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
    relatedMatch?: ConceptLink[];
    searchTerm?: Term[];
    broadMatch?: ConceptLink[];
    narrowMatch?: ConceptLink[];
  };

  referrers: {
    broader?: BaseEntity<string>[]; // Concept[]?
    member?: Collection[];
    narrower?: BaseEntity<string>[]; // Concept[]?
    prefLabelXl?: Concept[];
    related?: BaseEntity<string>[]; // Concept[]?
  };
}

export function getConceptMock(prefLabel: Property): Concept {
  return {
    code: '001',
    createdBy: 'Admin User',
    createdDate: '1970-01-01T00:00:00.000+00:00',
    id: '001',
    identifier: {
      id: '',
      type: {
        id: 'Concept',
        graph: {
          id: '',
        },
        uri: '',
      },
    },
    lastModifiedBy: 'Admin User',
    lastModifiedDate: '1970-01-01T00:00:00.000+00:00',
    number: 1,
    properties: {},
    references: {
      prefLabelXl: [
        {
          code: '001',
          createdBy: 'Admin User',
          createdDate: '1970-01-01T00:00:00.000+00:00',
          id: '001',
          identifier: {
            id: '',
            type: {
              id: 'Term',
              graph: {
                id: '',
              },
              uri: '',
            },
          },
          lastModifiedBy: 'Admin User',
          lastModifiedDate: '1970-01-01T00:00:00.000+00:00',
          number: 1,
          properties: {
            prefLabel: [prefLabel],
          },
          references: {},
          referrers: {},
          type: {
            id: 'Term',
            graph: {
              id: '',
            },
            uri: '',
          },
          uri: '',
        },
      ],
    },
    referrers: {},
    type: {
      id: 'Concept',
      graph: {
        id: '',
      },
      uri: '',
    },
    uri: '',
  };
}
