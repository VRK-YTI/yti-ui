import generateFormData from './generate-form-data';

export const emptyFormReturned = generateFormData({ fi: 'demo' });

export const emptyFormExpected = {
  terms: [
    {
      changeNote: '',
      editorialNote: [],
      historyNote: '',
      id: emptyFormReturned.terms[0].id,
      language: 'fi',
      prefLabel: 'demo',
      scope: '',
      source: [],
      status: 'DRAFT',
      termConjugation: '',
      termEquivalency: '',
      termEquivalencyRelation: '',
      termFamily: '',
      termHomographNumber: '',
      termInfo: '',
      termStyle: '',
      termType: 'recommended-term',
      wordClass: '',
    },
  ],
  basicInformation: {
    identifier: '',
    definition: {},
    example: [],
    status: 'DRAFT',
    subject: '',
    note: [],
    diagramAndSource: {
      diagrams: [],
      sources: [],
    },
    orgInfo: {
      changeHistory: '',
      editorialNote: [],
      etymology: '',
    },
    otherInfo: {
      conceptClass: '',
    },
    relationalInfo: {
      broaderConcept: [],
      narrowerConcept: [],
      relatedConcept: [],
      isPartOfConcept: [],
      hasPartConcept: [],
      relatedConceptInOther: [],
      matchInOther: [],
      closeMatch: [],
      broadInOther: [],
      narrowInOther: [],
    },
  },
};

// --------------------------------------------

export const initialDataReturned = generateFormData(
  {},
  {
    identifier: 'concept-1',
    uri: 'https://iri.suomi.fi/terminology/test/concept-1',
    created: '',
    modified: '',
    creator: {
      id: '',
      name: '',
    },
    modifier: {
      id: '',
      name: '',
    },
    label: {
      fi: 'label',
    },
    definition: {
      fi: 'def',
    },
    notes: [{ language: 'fi', value: 'note' }],
    examples: [{ language: 'fi', value: 'example' }],
    subjectArea: 'subject',
    status: 'DRAFT',
    sources: ['concept source'],
    links: [],
    changeNote: 'change',
    historyNote: 'history',
    conceptClass: 'class',
    editorialNotes: ['editorial note'],
    recommendedTerms: [
      {
        language: 'fi',
        label: 'demo',
        scope: 'scope',
        sources: [],
        status: 'DRAFT',
        termConjugation: 'SINGULAR',
        termEquivalency: 'BROADER',
        termFamily: 'NEUTRAL',
        homographNumber: 2,
        termInfo: 'info',
        termStyle: 'style',
        wordClass: 'VERB',
        changeNote: 'term change',
        editorialNotes: ['term editorial'],
        historyNote: 'term history',
      },
    ],
    synonyms: [],
    notRecommendedTerms: [],
    searchTerms: [],
    broader: [
      {
        referenceURI: 'https://iri.suomi.fi/terminology/test/concept-100',
        identifier: 'concept-100',
        label: { fi: 'ref concept' },
        prefix: 'test',
        terminologyLabel: { fi: 'terminology label' },
      },
    ],
    narrower: [],
    isPartOf: [],
    hasPart: [],
    related: [],
    broadMatch: [],
    narrowMatch: [],
    exactMatch: [],
    closeMatch: [],
    relatedMatch: [],
    memberOf: [],
  }
);

export const initialDataExpected = {
  terms: [
    {
      changeNote: 'term change',
      editorialNote: [
        {
          id: initialDataReturned.terms[0].editorialNote[0].id,
          lang: '',
          value: 'term editorial',
        },
      ],
      historyNote: 'term history',
      id: initialDataReturned.terms[0].id,
      language: 'fi',
      prefLabel: 'demo',
      scope: 'scope',
      source: [],
      status: 'DRAFT',
      termConjugation: 'SINGULAR',
      termEquivalency: 'BROADER',
      termFamily: 'NEUTRAL',
      termHomographNumber: '2',
      termInfo: 'info',
      termStyle: 'style',
      termType: 'recommended-term',
      wordClass: 'VERB',
    },
  ],
  basicInformation: {
    identifier: 'concept-1',
    definition: { fi: 'def' },
    example: [
      {
        id: initialDataReturned.basicInformation.example[0].id,
        lang: 'fi',
        value: 'example',
      },
    ],
    status: 'DRAFT',
    subject: 'subject',
    note: [
      {
        id: initialDataReturned.basicInformation.note[0].id,
        lang: 'fi',
        value: 'note',
      },
    ],
    diagramAndSource: {
      diagrams: [],
      sources: [
        {
          id: initialDataReturned.basicInformation.diagramAndSource.sources[0]
            .id,
          lang: '',
          value: 'concept source',
        },
      ],
    },
    orgInfo: {
      changeHistory: 'change',
      editorialNote: [
        {
          id: initialDataReturned.basicInformation.orgInfo.editorialNote[0].id,
          lang: '',
          value: 'editorial note',
        },
      ],
      etymology: 'history',
    },
    otherInfo: {
      conceptClass: 'class',
    },
    relationalInfo: {
      broaderConcept: [
        {
          id: 'https://iri.suomi.fi/terminology/test/concept-100',
          label: {
            fi: 'ref concept',
          },
          terminologyId: 'test',
          terminologyLabel: { fi: 'terminology label' },
        },
      ],
      narrowerConcept: [],
      relatedConcept: [],
      isPartOfConcept: [],
      hasPartConcept: [],
      relatedConceptInOther: [],
      matchInOther: [],
      closeMatch: [],
      broadInOther: [],
      narrowInOther: [],
    },
  },
};
