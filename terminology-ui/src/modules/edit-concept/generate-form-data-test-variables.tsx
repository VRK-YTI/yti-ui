import generateFormData from './generate-form-data';

export const emptyFormReturned = generateFormData({ fi: 'demo' });

export const emptyFormExpected = {
  terms: [
    {
      changeNote: '',
      draftComment: '',
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

export const simpleDataReturned = generateFormData(
  { fi: 'demo' },
  {
    identifier: '',
    uri: '',
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
    label: {},
    definition: {},
    notes: [],
    examples: [],
    subjectArea: '',
    status: 'DRAFT',
    sources: [],
    links: [],
    changeNote: '',
    historyNote: '',
    conceptClass: '',
    editorialNotes: [],
    recommendedTerms: [],
    synonyms: [],
    notRecommendedTerms: [],
    searchTerms: [],
    broader: [],
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

export const simpleDataExpected = {
  terms: [
    {
      changeNote: '',
      draftComment: '',
      editorialNote: [],
      historyNote: '',
      id: simpleDataReturned.terms[0].id,
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

export const extensiveDataReturned = generateFormData(
  { fi: 'demo' },
  //TODO:
  undefined
);

export const extensiveDataExpected = {
  terms: [
    {
      changeNote: 'muutoshistoria',
      draftComment: '',
      editorialNote: [
        {
          id: extensiveDataReturned.terms[0].editorialNote[0].id,
          lang: '',
          value: 'ylläpitäjän muistiinpano',
        },
      ],
      historyNote: 'käytön historiatieto',
      id: 'ae47e0e8-c44d-4199-b7b4-3b8c98cda1de',
      language: 'fi',
      prefLabel: 'synonyymi',
      scope: 'käyttöala',
      source: [
        {
          id: extensiveDataReturned.terms[0].source[0].id,
          lang: '',
          value: 'käyttöala',
        },
      ],
      status: 'DRAFT',
      termConjugation: 'monikko',
      termEquivalency: '~',
      termEquivalencyRelation: '',
      termFamily: 'feminiini',
      termHomographNumber: '1',
      termInfo: 'termin lisätieto',
      termStyle: 'puhekieli',
      termType: 'synonym',
      wordClass: 'adjective',
    },
    {
      changeNote: 'muutoshistoria',
      draftComment: '',
      editorialNote: [
        {
          id: extensiveDataReturned.terms[1].editorialNote[0].id,
          lang: '',
          value: 'ylläpitäjän muistiinpano',
        },
      ],
      historyNote: 'käytönhistoriatieto',
      id: 'aca34887-297a-4482-9514-1ffe45161d3e',
      language: 'fi',
      prefLabel: 'Hakusana',
      scope: 'käyttöala',
      source: [
        {
          id: extensiveDataReturned.terms[1].source[0].id,
          lang: '',
          value: 'käyttöala',
        },
      ],
      status: 'DRAFT',
      termConjugation: 'monikko',
      termEquivalency: '~',
      termEquivalencyRelation: '',
      termFamily: 'neutri',
      termHomographNumber: '',
      termInfo: 'termin lisätieto',
      termStyle: 'puhekieli',
      termType: 'search-term',
      wordClass: 'adjective',
    },
    {
      changeNote: 'muutoshistoria',
      draftComment: '',
      editorialNote: [
        {
          id: extensiveDataReturned.terms[2].editorialNote[0].id,
          lang: '',
          value: 'ylläpitäjän muistiinpano',
        },
      ],
      historyNote: 'käytön historiatieto',
      id: '87713416-0a6e-4831-afa0-21fc05e3d6cd',
      language: 'fi',
      prefLabel: 'demo',
      scope: 'käyttöala',
      source: [
        {
          id: extensiveDataReturned.terms[2].source[0].id,
          lang: '',
          value: 'käyttöala',
        },
      ],
      status: 'DRAFT',
      termConjugation: 'singular',
      termEquivalency: '',
      termEquivalencyRelation: '',
      termFamily: 'feminine',
      termHomographNumber: '1',
      termInfo: 'termin lisätieto',
      termStyle: 'spoken-form',
      termType: 'recommended-term',
      wordClass: 'adjective',
    },
    {
      changeNote: 'muutoshistoria',
      draftComment: '',
      editorialNote: [
        {
          id: extensiveDataReturned.terms[3].editorialNote[0].id,
          lang: '',
          value: 'ylläpitäjän muistiinpano',
        },
      ],
      historyNote: 'käytön historiatieto',
      id: '3aa3c3ca-bc58-4e83-97be-ef748ca907bd',
      language: 'fi',
      prefLabel: 'Ei-suositettava synonyymi',
      scope: 'käyttöala',
      source: [
        {
          id: extensiveDataReturned.terms[3].source[0].id,
          lang: '',
          value: 'käyttöala',
        },
      ],
      status: 'DRAFT',
      termConjugation: 'yksikkö',
      termEquivalency: '~',
      termEquivalencyRelation: '',
      termFamily: 'neutri',
      termHomographNumber: '1',
      termInfo: 'termin lisätieto',
      termStyle: 'puhekieli',
      termType: 'not-recommended-synonym',
      wordClass: 'adjective',
    },
  ],
  basicInformation: {
    definition: {
      fi: 'määritelmä',
      en: 'definition',
    },
    diagramAndSource: {
      diagrams: [],
      sources: [
        {
          id: extensiveDataReturned.basicInformation.diagramAndSource.sources[0]
            .id,
          lang: '',
          value: 'lähde',
        },
      ],
    },
    example: [
      {
        id: extensiveDataReturned.basicInformation.example[0].id,
        lang: 'fi',
        value: 'esimerkki',
      },
    ],
    note: [
      {
        id: extensiveDataReturned.basicInformation.note[0].id,
        lang: '',
        value: 'huomautus',
      },
    ],
    orgInfo: {
      changeHistory: 'muutoshistoria',
      editorialNote: [
        {
          id: extensiveDataReturned.basicInformation.orgInfo.editorialNote[0]
            .id,
          lang: '',
          value: 'ylläpitäjän muistiinpano',
        },
      ],
      etymology: 'historiatieto',
    },
    otherInfo: {
      conceptClass: 'käsitteen luokka',
      wordClass: 'adjective',
    },
    relationalInfo: {
      broaderConcept: [
        {
          id: '148ab016-36ee-486a-862a-87d6dde2f86f',
          label: {
            fi: 'emokäsite',
          },
          terminologyId: '987987-987-987987',
          terminologyLabel: {
            fi: 'keskeneräinen sanasto',
          },
        },
      ],
      hasPartConcept: [
        {
          id: '2a2b8b11-4dc9-4ddb-afde-812560a5b007',
          label: {
            fi: 'testi',
          },
          terminologyId: '987987-987-987987',
          terminologyLabel: {
            fi: 'keskeneräinen sanasto',
          },
        },
      ],
      isPartOfConcept: [
        {
          id: '2a2b8b11-4dc9-4ddb-afde-812560a5b007',
          label: {
            fi: 'testi',
          },
          terminologyId: '987987-987-987987',
          terminologyLabel: {
            fi: 'keskeneräinen sanasto',
          },
        },
      ],
      matchInOther: [
        {
          id: '8ee81e29-e0f1-4a23-b23b-28a976fcf87f',
          label: {
            fi: 'demo',
          },
          terminologyId: 'ec43f161-b85d-4786-a4b9-d0da52edfba1',
          terminologyLabel: {
            fi: 'testi',
            en: 'test',
          },
          targetId: '7b179ea2-b28c-497e-9e81-6ff254235ea1',
        },
      ],
      narrowerConcept: [
        {
          id: '6e00b816-c077-4747-8597-46047005584d',
          label: {
            fi: 'uusi käsite',
          },
          terminologyId: '987987-987-987987',
          terminologyLabel: {
            fi: 'keskeneräinen sanasto',
          },
        },
      ],
      relatedConcept: [
        {
          id: '2a2b8b11-4dc9-4ddb-afde-812560a5b007',
          label: {
            fi: 'testi',
          },
          terminologyId: '987987-987-987987',
          terminologyLabel: {
            fi: 'keskeneräinen sanasto',
          },
        },
      ],
      relatedConceptInOther: [
        {
          id: 'a87ae2c2-3c16-494a-9f82-928fc1840a1e',
          label: {
            fi: 'demo',
          },
          terminologyId: 'ec43f161-b85d-4786-a4b9-d0da52edfba1',
          terminologyLabel: {
            fi: 'testi',
            en: 'test',
          },
          targetId: '7b179ea2-b28c-497e-9e81-6ff254235ea1',
        },
      ],
      closeMatch: [
        {
          id: 'a87ae2c2-3c16-494a-9f82-928fc1840a1f',
          label: {
            fi: 'demo',
          },
          terminologyId: 'ec43f161-b85d-4786-a4b9-d0da52edfba1',
          terminologyLabel: {
            fi: 'testi',
            en: 'test',
          },
          targetId: '7b179ea2-b28c-497e-9e81-6ff254235ea1',
        },
      ],
      broadInOther: [
        {
          id: 'a87ae2c2-3c16-494a-9f82-928fc1840a1f',
          label: {
            fi: 'demo',
          },
          terminologyId: 'ec43f161-b85d-4786-a4b9-d0da52edfba1',
          terminologyLabel: {
            fi: 'testi',
            en: 'test',
          },
          targetId: '7b179ea2-b28c-497e-9e81-6ff254235ea1',
        },
      ],
      narrowInOther: [
        {
          id: 'a87ae2c2-3c16-494a-9f82-928fc1840a1f',
          label: {
            fi: 'demo',
          },
          terminologyId: 'ec43f161-b85d-4786-a4b9-d0da52edfba1',
          terminologyLabel: {
            fi: 'testi',
            en: 'test',
          },
          targetId: '7b179ea2-b28c-497e-9e81-6ff254235ea1',
        },
      ],
    },
    status: 'DRAFT',
    subject: 'aihealue',
  },
};
