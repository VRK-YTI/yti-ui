import generateFormData from './generate-form-data';

export const emptyFormReturned = generateFormData([
  { lang: 'fi', value: 'demo', regex: '' },
]);

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
      wordClass: '',
    },
    relationalInfo: {
      broaderConcept: [],
      narrowerConcept: [],
      relatedConcept: [],
      isPartOfConcept: [],
      hasPartConcept: [],
      relatedConceptInOther: [],
      matchInOther: [],
    },
  },
};

// --------------------------------------------

export const simpleDataReturned = generateFormData(
  [{ lang: 'fi', value: 'demo', regex: '' }],
  {
    code: 'concept-1000',
    createdBy: 'User',
    createdDate: '1970-01-01T00:00:00.000Z',
    id: '123123-123-123123',
    identifier: {
      id: '123123-123-123123',
      type: {
        graph: {
          id: '987987-987-987987',
        },
        id: 'Concept',
        uri: '',
      },
    },
    lastModifiedBy: 'User',
    lastModifiedDate: '1970-01-01T00:00:00.000Z',
    number: 0,
    properties: {
      status: [
        {
          lang: '',
          value: 'DRAFT',
          regex: '(?s)^.*$',
        },
      ],
    },
    references: {
      prefLabelXl: [
        {
          code: 'term-1000',
          createdBy: 'User',
          createdDate: '1970-01-01T00:00:00.000Z',
          id: '456456-456-456456',
          identifier: {
            id: '456456-456-456456',
            type: {
              graph: {
                id: '987987-987-987987',
              },
              id: 'Term',
              uri: '',
            },
          },
          lastModifiedBy: 'User',
          lastModifiedDate: '1970-01-01T00:00:00.000Z',
          number: 0,
          properties: {
            prefLabel: [
              {
                lang: 'fi',
                regex: '(?s)^.*$',
                value: 'demo',
              },
            ],
            status: [
              {
                lang: '',
                regex: '(?s)^.*$',
                value: 'DRAFT',
              },
            ],
          },
          references: {},
          referrers: {
            prefLabelXl: [
              {
                code: 'concept-1000',
                createdBy: 'User',
                createdDate: '1970-01-01T00:00:00.000Z',
                id: '321321-321-321321',
                identifier: {
                  id: '321321-321-321321',
                  type: {
                    graph: {
                      id: '987987-987-987987',
                    },
                    id: 'Concept',
                    uri: '',
                  },
                },
                lastModifiedBy: 'User',
                lastModifiedDate: '1970-01-01T00:00:00.000Z',
                number: 0,
                properties: {
                  status: [
                    {
                      lang: '',
                      regex: '(?s)^.*$',
                      value: 'DRAFT',
                    },
                  ],
                },
                references: {},
                referrers: {},
                type: {
                  graph: {
                    id: '987987-987-987987',
                  },
                  id: 'Concept',
                  uri: '',
                },
                uri: 'uri.suomi.fi/terminology/sanasto/concept-1000',
              },
            ],
          },
          type: {
            graph: {
              id: '987987-987-987987',
            },
            id: 'Term',
            uri: '',
          },
          uri: 'uri.suomi.fi/terminology/sanasto/term-1000',
        },
      ],
    },
    referrers: {},
    type: {
      graph: {
        id: '987987-987-987987',
      },
      id: 'Concept',
      uri: '',
    },
    uri: 'uri.suomi.fi/terminology/sanasto/concept-1000',
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
      wordClass: '',
    },
    relationalInfo: {
      broaderConcept: [],
      narrowerConcept: [],
      relatedConcept: [],
      isPartOfConcept: [],
      hasPartConcept: [],
      relatedConceptInOther: [],
      matchInOther: [],
    },
  },
};

// --------------------------------------------

export const extensiveDataReturned = generateFormData(
  [{ lang: 'fi', value: 'demo', regex: '' }],
  {
    code: 'concept-1000',
    createdBy: 'User',
    createdDate: '1970-01-01T00:00:00.000Z',
    id: '123123-123-123123',
    identifier: {
      id: '123123-123-123123',
      type: {
        graph: {
          id: '987987-987-987987',
        },
        id: 'Concept',
        uri: '',
      },
    },
    lastModifiedBy: 'User',
    lastModifiedDate: '1970-01-01T00:00:00.000Z',
    number: 0,
    properties: {
      changeNote: [
        {
          lang: '',
          value: 'muutoshistoria',
          regex: '(?s)^.*$',
        },
      ],
      conceptClass: [
        {
          lang: '',
          value: 'käsitteen luokka',
          regex: '(?s)^.*$',
        },
      ],
      definition: [
        {
          lang: 'fi',
          value: 'määritelmä',
          regex: '(?s)^.*$',
        },
        {
          lang: 'en',
          value: 'definition',
          regex: '(?s)^.*$',
        },
      ],
      editorialNote: [
        {
          lang: '',
          value: 'ylläpitäjän muistiinpano',
          regex: '(?s)^.*$',
        },
      ],
      example: [
        {
          lang: 'fi',
          value: 'esimerkki',
          regex: '(?s)^.*$',
        },
      ],
      historyNote: [
        {
          lang: '',
          value: 'historiatieto',
          regex: '(?s)^.*$',
        },
      ],
      note: [
        {
          lang: '',
          value: 'huomautus',
          regex: '(?s)^.*$',
        },
      ],
      source: [
        {
          lang: '',
          value: 'lähde',
          regex: '(?s)^.*$',
        },
      ],
      status: [
        {
          lang: '',
          value: 'DRAFT',
          regex: '(?s)^.*$',
        },
      ],
      subjectArea: [
        {
          lang: '',
          value: 'aihealue',
          regex: '(?s)^.*$',
        },
      ],
      wordClass: [
        {
          lang: '',
          value: 'adjective',
          regex: '(?s)^.*$',
        },
      ],
    },
    references: {
      altLabelXl: [
        {
          id: 'ae47e0e8-c44d-4199-b7b4-3b8c98cda1de',
          code: 'term-4001',
          uri: 'http://uri.suomi.fi/terminology/sanasto/term-4001',
          number: 0,
          createdBy: 'Admin User',
          createdDate: '1970-01-01T00:00:00.000Z',
          lastModifiedBy: 'Admin User',
          lastModifiedDate: '1970-01-01T00:00:00.000Z',
          type: {
            id: 'Term',
            graph: {
              id: '987987-987-987987',
            },
            uri: '',
          },
          properties: {
            changeNote: [
              {
                lang: '',
                value: 'muutoshistoria',
                regex: '(?s)^.*$',
              },
            ],
            editorialNote: [
              {
                lang: '',
                value: 'ylläpitäjän muistiinpano',
                regex: '(?s)^.*$',
              },
            ],
            historyNote: [
              {
                lang: '',
                value: 'käytön historiatieto',
                regex: '(?s)^.*$',
              },
            ],
            prefLabel: [
              {
                lang: 'fi',
                value: 'synonyymi',
                regex: '(?s)^.*$',
              },
            ],
            scope: [
              {
                lang: '',
                value: 'käyttöala',
                regex: '(?s)^.*$',
              },
            ],
            source: [
              {
                lang: '',
                value: 'käyttöala',
                regex: '(?s)^.*$',
              },
            ],
            status: [
              {
                lang: '',
                value: 'DRAFT',
                regex: '(?s)^.*$',
              },
            ],
            termConjugation: [
              {
                lang: '',
                value: 'monikko',
                regex: '(?s)^.*$',
              },
            ],
            termEquivalency: [
              {
                lang: '',
                value: '~',
                regex: '(?s)^.*$',
              },
            ],
            termFamily: [
              {
                lang: '',
                value: 'feminiini',
                regex: '(?s)^.*$',
              },
            ],
            termHomographNumber: [
              {
                lang: '',
                value: '1',
                regex: '(?s)^.*$',
              },
            ],
            termInfo: [
              {
                lang: '',
                value: 'termin lisätieto',
                regex: '(?s)^.*$',
              },
            ],
            termStyle: [
              {
                lang: '',
                value: 'puhekieli',
                regex: '(?s)^.*$',
              },
            ],
            wordClass: [
              {
                lang: '',
                value: 'adjektiivi',
                regex: '(?s)^.*$',
              },
            ],
          },
          references: {},
          referrers: {},
          identifier: {
            id: 'ae47e0e8-c44d-4199-b7b4-3b8c98cda1de',
            type: {
              id: 'Term',
              graph: {
                id: '987987-987-987987',
              },
              uri: '',
            },
          },
        },
      ],
      exactMatch: [
        {
          id: '8ee81e29-e0f1-4a23-b23b-28a976fcf87f',
          code: 'concept-link-1001',
          uri: 'http://uri.suomi.fi/terminology/sanasto/concept-link-1001',
          number: 0,
          createdBy: 'Admin User',
          createdDate: '1970-01-01T00:00:00.000Z',
          lastModifiedBy: 'Admin User',
          lastModifiedDate: '1970-01-01T00:00:00.000Z',
          type: {
            id: 'ConceptLink',
            graph: {
              id: '987987-987-987987',
            },
            uri: '',
          },
          properties: {
            prefLabel: [
              {
                lang: 'fi',
                value: 'demo',
                regex: '(?s)^.*$',
              },
            ],
            vocabularyLabel: [
              {
                lang: 'fi',
                value: 'testi',
                regex: '(?s)^.*$',
              },
              {
                lang: 'en',
                value: 'test',
                regex: '(?s)^.*$',
              },
            ],
            targetId: [
              {
                lang: '',
                value: '7b179ea2-b28c-497e-9e81-6ff254235ea1',
                regex: '(?s)^.*$',
              },
            ],
            targetGraph: [
              {
                lang: '',
                value: 'ec43f161-b85d-4786-a4b9-d0da52edfba1',
                regex: '(?s)^.*$',
              },
            ],
          },
          references: {},
          referrers: {},
          identifier: {
            id: '8ee81e29-e0f1-4a23-b23b-28a976fcf87f',
            type: {
              id: 'ConceptLink',
              graph: {
                id: '987987-987-987987',
              },
              uri: '',
            },
          },
        },
      ],
      searchTerm: [
        {
          id: 'aca34887-297a-4482-9514-1ffe45161d3e',
          code: 'term-4003',
          uri: 'http://uri.suomi.fi/terminology/sanasto/term-4003',
          number: 0,
          createdBy: 'Admin User',
          createdDate: '1970-01-01T00:00:00.000Z',
          lastModifiedBy: 'Admin User',
          lastModifiedDate: '1970-01-01T00:00:00.000Z',
          type: {
            id: 'Term',
            graph: {
              id: '987987-987-987987',
            },
            uri: '',
          },
          properties: {
            changeNote: [
              {
                lang: '',
                value: 'muutoshistoria',
                regex: '(?s)^.*$',
              },
            ],
            editorialNote: [
              {
                lang: '',
                value: 'ylläpitäjän muistiinpano',
                regex: '(?s)^.*$',
              },
            ],
            historyNote: [
              {
                lang: '',
                value: 'käytönhistoriatieto',
                regex: '(?s)^.*$',
              },
            ],
            prefLabel: [
              {
                lang: 'fi',
                value: 'Hakusana',
                regex: '(?s)^.*$',
              },
            ],
            scope: [
              {
                lang: '',
                value: 'käyttöala',
                regex: '(?s)^.*$',
              },
            ],
            source: [
              {
                lang: '',
                value: 'käyttöala',
                regex: '(?s)^.*$',
              },
            ],
            status: [
              {
                lang: '',
                value: 'DRAFT',
                regex: '(?s)^.*$',
              },
            ],
            termConjugation: [
              {
                lang: '',
                value: 'monikko',
                regex: '(?s)^.*$',
              },
            ],
            termEquivalency: [
              {
                lang: '',
                value: '~',
                regex: '(?s)^.*$',
              },
            ],
            termFamily: [
              {
                lang: '',
                value: 'neutri',
                regex: '(?s)^.*$',
              },
            ],
            termInfo: [
              {
                lang: '',
                value: 'termin lisätieto',
                regex: '(?s)^.*$',
              },
            ],
            termStyle: [
              {
                lang: '',
                value: 'puhekieli',
                regex: '(?s)^.*$',
              },
            ],
            wordClass: [
              {
                lang: '',
                value: 'adjektiivi',
                regex: '(?s)^.*$',
              },
            ],
          },
          references: {},
          referrers: {},
          identifier: {
            id: 'aca34887-297a-4482-9514-1ffe45161d3e',
            type: {
              id: 'Term',
              graph: {
                id: '987987-987-987987',
              },
              uri: '',
            },
          },
        },
      ],
      related: [
        {
          id: '2a2b8b11-4dc9-4ddb-afde-812560a5b007',
          code: '',
          uri: '',
          number: 0,
          createdBy: 'Admin User',
          createdDate: '1970-01-01T00:00:00.000Z',
          lastModifiedBy: 'Admin User',
          lastModifiedDate: '1970-01-01T00:00:00.000Z',
          type: {
            id: 'Concept',
            graph: {
              id: '987987-987-987987',
            },
            uri: '',
          },
          properties: {
            definition: [
              {
                lang: 'fi',
                value: 'Määritelmä, suomi FI',
                regex: '(?s)^.*$',
              },
              {
                lang: 'en',
                value: 'Määritelmä, englanti EN',
                regex: '(?s)^.*$',
              },
            ],
            historyNote: [
              {
                lang: '',
                value: 'Käytön historiatieto "etymologia"',
                regex: '(?s)^.*$',
              },
            ],
            conceptClass: [
              {
                lang: '',
                value: 'Käsitteen luokka',
                regex: '(?s)^.*$',
              },
            ],
            wordClass: [
              {
                lang: '',
                value: 'adjective',
                regex: '(?s)^.*$',
              },
            ],
            status: [
              {
                lang: '',
                value: 'DRAFT',
                regex: '(?s)^.*$',
              },
            ],
            example: [
              {
                lang: 'fi',
                value: 'esimerkki',
                regex: '(?s)^.*$',
              },
              {
                lang: 'en',
                value: 'example',
                regex: '(?s)^.*$',
              },
            ],
            note: [
              {
                lang: 'fi',
                value: 'Huomautus',
                regex: '(?s)^.*$',
              },
              {
                lang: 'en',
                value: 'Huomautus',
                regex: '(?s)^.*$',
              },
            ],
            changeNote: [
              {
                lang: '',
                value: 'Muutoshistoria',
                regex: '(?s)^.*$',
              },
            ],
            subjectArea: [
              {
                lang: '',
                value: 'aihealue',
                regex: '(?s)^.*$',
              },
            ],
          },
          references: {
            prefLabelXl: [
              {
                id: '7a7b337a-8e13-42fb-be87-2ba0371981f1',
                code: '',
                uri: '',
                number: 0,
                createdBy: 'Admin User',
                createdDate: '1970-01-01T00:00:00.000Z',
                lastModifiedBy: 'Admin User',
                lastModifiedDate: '1970-01-01T00:00:00.000Z',
                type: {
                  id: 'Term',
                  graph: {
                    id: '987987-987-987987',
                  },
                  uri: '',
                },
                properties: {
                  prefLabel: [
                    {
                      lang: 'fi',
                      value: 'testi',
                      regex: '(?s)^.*$',
                    },
                  ],
                  status: [
                    {
                      lang: '',
                      value: 'DRAFT',
                      regex: '(?s)^.*$',
                    },
                  ],
                  termInfo: [
                    {
                      lang: '',
                      value: 'termin lisätieto',
                      regex: '(?s)^.*$',
                    },
                  ],
                  wordClass: [
                    {
                      lang: '',
                      value: 'adjective',
                      regex: '(?s)^.*$',
                    },
                  ],
                  termConjugation: [
                    {
                      lang: '',
                      value: 'singular',
                      regex: '(?s)^.*$',
                    },
                  ],
                  editorialNote: [
                    {
                      lang: '',
                      value: 'Ylläpitäjän muistiinpano',
                      regex: '(?s)^.*$',
                    },
                  ],
                  changeNote: [
                    {
                      lang: '',
                      value: 'Muutoshistoria',
                      regex: '(?s)^.*$',
                    },
                  ],
                  historyNote: [
                    {
                      lang: '',
                      value: 'Käytön historiatieto "etymologia"',
                      regex: '(?s)^.*$',
                    },
                  ],
                  termStyle: [
                    {
                      lang: '',
                      value: 'spoken-form',
                      regex: '(?s)^.*$',
                    },
                  ],
                  source: [
                    {
                      lang: '',
                      value: 'lähteet',
                      regex: '(?s)^.*$',
                    },
                  ],
                  scope: [
                    {
                      lang: '',
                      value: 'käyttöala',
                      regex: '(?s)^.*$',
                    },
                  ],
                  termFamily: [
                    {
                      lang: '',
                      value: 'neutral',
                      regex: '(?s)^.*$',
                    },
                  ],
                },
                references: {},
                referrers: {},
                identifier: {
                  id: '7a7b337a-8e13-42fb-be87-2ba0371981f1',
                  type: {
                    id: 'Term',
                    graph: {
                      id: '987987-987-987987',
                    },
                    uri: '',
                  },
                },
              },
            ],
          },
          referrers: {},
          identifier: {
            id: '2a2b8b11-4dc9-4ddb-afde-812560a5b007',
            type: {
              id: 'Concept',
              graph: {
                id: '987987-987-987987',
              },
              uri: '',
            },
          },
        },
      ],
      hasPart: [
        {
          id: '2a2b8b11-4dc9-4ddb-afde-812560a5b007',
          code: '',
          uri: '',
          number: 0,
          createdBy: 'Admin User',
          createdDate: '1970-01-01T00:00:00.000Z',
          lastModifiedBy: 'Admin User',
          lastModifiedDate: '1970-01-01T00:00:00.000Z',
          type: {
            id: 'Concept',
            graph: {
              id: '987987-987-987987',
            },
            uri: '',
          },
          properties: {
            definition: [
              {
                lang: 'fi',
                value: 'Määritelmä, suomi FI',
                regex: '(?s)^.*$',
              },
              {
                lang: 'en',
                value: 'Määritelmä, englanti EN',
                regex: '(?s)^.*$',
              },
            ],
            historyNote: [
              {
                lang: '',
                value: 'Käytön historiatieto "etymologia"',
                regex: '(?s)^.*$',
              },
            ],
            conceptClass: [
              {
                lang: '',
                value: 'Käsitteen luokka',
                regex: '(?s)^.*$',
              },
            ],
            wordClass: [
              {
                lang: '',
                value: 'adjective',
                regex: '(?s)^.*$',
              },
            ],
            status: [
              {
                lang: '',
                value: 'DRAFT',
                regex: '(?s)^.*$',
              },
            ],
            example: [
              {
                lang: 'fi',
                value: 'esimerkki',
                regex: '(?s)^.*$',
              },
              {
                lang: 'en',
                value: 'example',
                regex: '(?s)^.*$',
              },
            ],
            note: [
              {
                lang: 'fi',
                value: 'Huomautus',
                regex: '(?s)^.*$',
              },
              {
                lang: 'en',
                value: 'Huomautus',
                regex: '(?s)^.*$',
              },
            ],
            changeNote: [
              {
                lang: '',
                value: 'Muutoshistoria',
                regex: '(?s)^.*$',
              },
            ],
            subjectArea: [
              {
                lang: '',
                value: 'aihealue',
                regex: '(?s)^.*$',
              },
            ],
          },
          references: {
            prefLabelXl: [
              {
                id: '7a7b337a-8e13-42fb-be87-2ba0371981f1',
                code: '',
                uri: '',
                number: 0,
                createdBy: 'Admin User',
                createdDate: '1970-01-01T00:00:00.000Z',
                lastModifiedBy: 'Admin User',
                lastModifiedDate: '1970-01-01T00:00:00.000Z',
                type: {
                  id: 'Term',
                  graph: {
                    id: '987987-987-987987',
                  },
                  uri: '',
                },
                properties: {
                  prefLabel: [
                    {
                      lang: 'fi',
                      value: 'testi',
                      regex: '(?s)^.*$',
                    },
                  ],
                  status: [
                    {
                      lang: '',
                      value: 'DRAFT',
                      regex: '(?s)^.*$',
                    },
                  ],
                  termInfo: [
                    {
                      lang: '',
                      value: 'termin lisätieto',
                      regex: '(?s)^.*$',
                    },
                  ],
                  wordClass: [
                    {
                      lang: '',
                      value: 'adjective',
                      regex: '(?s)^.*$',
                    },
                  ],
                  termConjugation: [
                    {
                      lang: '',
                      value: 'singular',
                      regex: '(?s)^.*$',
                    },
                  ],
                  editorialNote: [
                    {
                      lang: '',
                      value: 'Ylläpitäjän muistiinpano',
                      regex: '(?s)^.*$',
                    },
                  ],
                  changeNote: [
                    {
                      lang: '',
                      value: 'Muutoshistoria',
                      regex: '(?s)^.*$',
                    },
                  ],
                  historyNote: [
                    {
                      lang: '',
                      value: 'Käytön historiatieto "etymologia"',
                      regex: '(?s)^.*$',
                    },
                  ],
                  termStyle: [
                    {
                      lang: '',
                      value: 'spoken-form',
                      regex: '(?s)^.*$',
                    },
                  ],
                  source: [
                    {
                      lang: '',
                      value: 'lähteet',
                      regex: '(?s)^.*$',
                    },
                  ],
                  scope: [
                    {
                      lang: '',
                      value: 'käyttöala',
                      regex: '(?s)^.*$',
                    },
                  ],
                  termFamily: [
                    {
                      lang: '',
                      value: 'neutral',
                      regex: '(?s)^.*$',
                    },
                  ],
                },
                references: {},
                referrers: {},
                identifier: {
                  id: '7a7b337a-8e13-42fb-be87-2ba0371981f1',
                  type: {
                    id: 'Term',
                    graph: {
                      id: '987987-987-987987',
                    },
                    uri: '',
                  },
                },
              },
            ],
          },
          referrers: {},
          identifier: {
            id: '2a2b8b11-4dc9-4ddb-afde-812560a5b007',
            type: {
              id: 'Concept',
              graph: {
                id: '987987-987-987987',
              },
              uri: '',
            },
          },
        },
      ],
      relatedMatch: [
        {
          id: 'a87ae2c2-3c16-494a-9f82-928fc1840a1e',
          code: 'concept-link-1000',
          uri: 'http://uri.suomi.fi/terminology/sanasto/concept-link-1000',
          number: 0,
          createdBy: 'Admin User',
          createdDate: '1970-01-01T00:00:00.000Z',
          lastModifiedBy: 'Admin User',
          lastModifiedDate: '1970-01-01T00:00:00.000Z',
          type: {
            id: 'ConceptLink',
            graph: {
              id: '987987-987-987987',
            },
            uri: '',
          },
          properties: {
            prefLabel: [
              {
                lang: 'fi',
                value: 'demo',
                regex: '(?s)^.*$',
              },
            ],
            vocabularyLabel: [
              {
                lang: 'fi',
                value: 'testi',
                regex: '(?s)^.*$',
              },
              {
                lang: 'en',
                value: 'test',
                regex: '(?s)^.*$',
              },
            ],
            targetId: [
              {
                lang: '',
                value: '7b179ea2-b28c-497e-9e81-6ff254235ea1',
                regex: '(?s)^.*$',
              },
            ],
            targetGraph: [
              {
                lang: '',
                value: 'ec43f161-b85d-4786-a4b9-d0da52edfba1',
                regex: '(?s)^.*$',
              },
            ],
          },
          references: {},
          referrers: {},
          identifier: {
            id: 'a87ae2c2-3c16-494a-9f82-928fc1840a1e',
            type: {
              id: 'ConceptLink',
              graph: {
                id: '987987-987-987987',
              },
              uri: '',
            },
          },
        },
      ],
      narrower: [
        {
          id: '6e00b816-c077-4747-8597-46047005584d',
          code: 'concept-3005',
          uri: 'http://uri.suomi.fi/terminology/sanasto/concept-3005',
          number: 0,
          createdBy: 'Admin User',
          createdDate: '1970-01-01T00:00:00.000Z',
          lastModifiedBy: 'Admin User',
          lastModifiedDate: '1970-01-01T00:00:00.000Z',
          type: {
            id: 'Concept',
            graph: {
              id: '987987-987-987987',
            },
            uri: '',
          },
          properties: {
            definition: [
              {
                lang: 'fi',
                value: ' määritelmä',
                regex: '(?s)^.*$',
              },
            ],
            note: [
              {
                lang: 'fi',
                value: ' huomautu',
                regex: '(?s)^.*$',
              },
            ],
            editorialNote: [
              {
                lang: '',
                value: 'ylläpitäjän muistiinpano',
                regex: '(?s)^.*$',
              },
            ],
            example: [
              {
                lang: 'fi',
                value: 'käyttöesimerkki',
                regex: '(?s)^.*$',
              },
            ],
            conceptScope: [
              {
                lang: '',
                value: 'käyttöala',
                regex: '(?s)^.*$',
              },
            ],
            conceptClass: [
              {
                lang: '',
                value: 'käsitteen luokka',
                regex: '(?s)^.*$',
              },
            ],
            wordClass: [
              {
                lang: '',
                value: 'sanaluokka',
                regex: '(?s)^.*$',
              },
            ],
            changeNote: [
              {
                lang: '',
                value: 'muutoshistoriatieto',
                regex: '(?s)^.*$',
              },
            ],
            historyNote: [
              {
                lang: '',
                value: 'käytön historiatieto',
                regex: '(?s)^.*$',
              },
            ],
            status: [
              {
                lang: '',
                value: 'DRAFT',
                regex: '(?s)^.*$',
              },
            ],
            notation: [
              {
                lang: '',
                value: 'systemaattinen merkintätapa',
                regex: '(?s)^.*$',
              },
            ],
            source: [
              {
                lang: '',
                value: 'lähde',
                regex: '(?s)^.*$',
              },
            ],
            subjectArea: [
              {
                lang: '',
                value: 'aihealue',
                regex: '(?s)^.*$',
              },
            ],
          },
          references: {
            prefLabelXl: [
              {
                id: 'fe220ad1-6874-48e0-945c-1f79fbb4d1d0',
                code: 'term-3005',
                uri: 'http://uri.suomi.fi/terminology/sanasto/term-3005',
                number: 0,
                createdBy: 'Admin User',
                createdDate: '1970-01-01T00:00:00.000Z',
                lastModifiedBy: 'Admin User',
                lastModifiedDate: '1970-01-01T00:00:00.000Z',
                type: {
                  id: 'Term',
                  graph: {
                    id: '987987-987-987987',
                  },
                  uri: '',
                },
                properties: {
                  prefLabel: [
                    {
                      lang: 'fi',
                      value: 'uusi käsite',
                      regex: '(?s)^.*$',
                    },
                  ],
                  source: [
                    {
                      lang: '',
                      value: 'lähde',
                      regex: '(?s)^.*$',
                    },
                  ],
                  scope: [
                    {
                      lang: '',
                      value: 'käyttöala',
                      regex: '(?s)^.*$',
                    },
                  ],
                  termStyle: [
                    {
                      lang: '',
                      value: 'termin tyyli',
                      regex: '(?s)^.*$',
                    },
                  ],
                  termFamily: [
                    {
                      lang: '',
                      value: 'termin suku',
                      regex: '(?s)^.*$',
                    },
                  ],
                  termConjugation: [
                    {
                      lang: '',
                      value: 'termin luku',
                      regex: '(?s)^.*$',
                    },
                  ],
                  termEquivalency: [
                    {
                      lang: '',
                      value: 'termin vastaavuus',
                      regex: '(?s)^.*$',
                    },
                  ],
                  termInfo: [
                    {
                      lang: '',
                      value: 'termin lisätieto',
                      regex: '(?s)^.*$',
                    },
                  ],
                  wordClass: [
                    {
                      lang: '',
                      value: 'sanaluokka',
                      regex: '(?s)^.*$',
                    },
                  ],
                  termHomographNumber: [
                    {
                      lang: '',
                      value: '1',
                      regex: '(?s)^.*$',
                    },
                  ],
                  editorialNote: [
                    {
                      lang: '',
                      value: 'ylläpitäjän muistiinpano',
                      regex: '(?s)^.*$',
                    },
                  ],
                  draftComment: [
                    {
                      lang: '',
                      value: 'luonnosvaiheen kommentti',
                      regex: '(?s)^.*$',
                    },
                  ],
                  historyNote: [
                    {
                      lang: '',
                      value: 'käytön historiatieto',
                      regex: '(?s)^.*$',
                    },
                  ],
                  changeNote: [
                    {
                      lang: '',
                      value: 'muutoshistoriatieto',
                      regex: '(?s)^.*$',
                    },
                  ],
                  status: [
                    {
                      lang: '',
                      value: 'DRAFT',
                      regex: '(?s)^.*$',
                    },
                  ],
                  termEquivalencyRelation: [
                    {
                      lang: '',
                      value: 'termin, johon vastaavuus liitty',
                      regex: '(?s)^.*$',
                    },
                  ],
                },
                references: {},
                referrers: {},
                identifier: {
                  id: 'fe220ad1-6874-48e0-945c-1f79fbb4d1d0',
                  type: {
                    id: 'Term',
                    graph: {
                      id: '987987-987-987987',
                    },
                    uri: '',
                  },
                },
              },
              {
                id: 'd2bdd425-7e7e-44d5-8121-b370267febf9',
                code: 'term-5000',
                uri: 'http://uri.suomi.fi/terminology/sanasto/term-5000',
                number: 0,
                createdBy: 'Admin User',
                createdDate: '1970-01-01T00:00:00.000Z',
                lastModifiedBy: 'Admin User',
                lastModifiedDate: '1970-01-01T00:00:00.000Z',
                type: {
                  id: 'Term',
                  graph: {
                    id: '987987-987-987987',
                  },
                  uri: '',
                },
                properties: {
                  prefLabel: [
                    {
                      lang: 'en',
                      value: 'new concept',
                      regex: '(?s)^.*$',
                    },
                  ],
                  status: [
                    {
                      lang: '',
                      value: 'DRAFT',
                      regex: '(?s)^.*$',
                    },
                  ],
                },
                references: {},
                referrers: {},
                identifier: {
                  id: 'd2bdd425-7e7e-44d5-8121-b370267febf9',
                  type: {
                    id: 'Term',
                    graph: {
                      id: '987987-987-987987',
                    },
                    uri: '',
                  },
                },
              },
            ],
          },
          referrers: {},
          identifier: {
            id: '6e00b816-c077-4747-8597-46047005584d',
            type: {
              id: 'Concept',
              graph: {
                id: '987987-987-987987',
              },
              uri: '',
            },
          },
        },
      ],
      broader: [
        {
          id: '148ab016-36ee-486a-862a-87d6dde2f86f',
          code: 'concept-3001',
          uri: 'http://uri.suomi.fi/terminology/sanasto/concept-3001',
          number: 0,
          createdBy: 'Admin User',
          createdDate: '1970-01-01T00:00:00.000Z',
          lastModifiedBy: 'Admin User',
          lastModifiedDate: '1970-01-01T00:00:00.000Z',
          type: {
            id: 'Concept',
            graph: {
              id: '987987-987-987987',
            },
            uri: '',
          },
          properties: {
            status: [
              {
                lang: '',
                value: 'DRAFT',
                regex: '(?s)^.*$',
              },
            ],
          },
          references: {
            prefLabelXl: [
              {
                id: '25633b86-6d29-478d-ae28-f3040d84ebc5',
                code: 'term-3001',
                uri: 'http://uri.suomi.fi/terminology/sanasto/term-3001',
                number: 0,
                createdBy: 'Admin User',
                createdDate: '1970-01-01T00:00:00.000Z',
                lastModifiedBy: 'Admin User',
                lastModifiedDate: '1970-01-01T00:00:00.000Z',
                type: {
                  id: 'Term',
                  graph: {
                    id: '987987-987-987987',
                  },
                  uri: '',
                },
                properties: {
                  prefLabel: [
                    {
                      lang: 'fi',
                      value: 'emokäsite',
                      regex: '(?s)^.*$',
                    },
                  ],
                  status: [
                    {
                      lang: '',
                      value: 'DRAFT',
                      regex: '(?s)^.*$',
                    },
                  ],
                },
                references: {},
                referrers: {},
                identifier: {
                  id: '25633b86-6d29-478d-ae28-f3040d84ebc5',
                  type: {
                    id: 'Term',
                    graph: {
                      id: '987987-987-987987',
                    },
                    uri: '',
                  },
                },
              },
            ],
          },
          referrers: {},
          identifier: {
            id: '148ab016-36ee-486a-862a-87d6dde2f86f',
            type: {
              id: 'Concept',
              graph: {
                id: '987987-987-987987',
              },
              uri: '',
            },
          },
        },
      ],
      prefLabelXl: [
        {
          id: '87713416-0a6e-4831-afa0-21fc05e3d6cd',
          code: 'term-4000',
          uri: 'http://uri.suomi.fi/terminology/sanasto/term-4000',
          number: 0,
          createdBy: 'Admin User',
          createdDate: '1970-01-01T00:00:00.000Z',
          lastModifiedBy: 'Admin User',
          lastModifiedDate: '1970-01-01T00:00:00.000Z',
          type: {
            id: 'Term',
            graph: {
              id: '987987-987-987987',
            },
            uri: '',
          },
          properties: {
            changeNote: [
              {
                lang: '',
                value: 'muutoshistoria',
                regex: '(?s)^.*$',
              },
            ],
            editorialNote: [
              {
                lang: '',
                value: 'ylläpitäjän muistiinpano',
                regex: '(?s)^.*$',
              },
            ],
            historyNote: [
              {
                lang: '',
                value: 'käytön historiatieto',
                regex: '(?s)^.*$',
              },
            ],
            prefLabel: [
              {
                lang: 'fi',
                value: 'demo',
                regex: '(?s)^.*$',
              },
            ],
            scope: [
              {
                lang: '',
                value: 'käyttöala',
                regex: '(?s)^.*$',
              },
            ],
            source: [
              {
                lang: '',
                value: 'käyttöala',
                regex: '(?s)^.*$',
              },
            ],
            status: [
              {
                lang: '',
                value: 'DRAFT',
                regex: '(?s)^.*$',
              },
            ],
            termConjugation: [
              {
                lang: '',
                value: 'singular',
                regex: '(?s)^.*$',
              },
            ],
            termFamily: [
              {
                lang: '',
                value: 'feminine',
                regex: '(?s)^.*$',
              },
            ],
            termHomographNumber: [
              {
                lang: '',
                value: '1',
                regex: '(?s)^.*$',
              },
            ],
            termInfo: [
              {
                lang: '',
                value: 'termin lisätieto',
                regex: '(?s)^.*$',
              },
            ],
            termStyle: [
              {
                lang: '',
                value: 'spoken-form',
                regex: '(?s)^.*$',
              },
            ],
            wordClass: [
              {
                lang: '',
                value: 'adjective',
                regex: '(?s)^.*$',
              },
            ],
          },
          references: {},
          referrers: {
            prefLabelXl: [
              {
                id: 'c1207701-de9c-4759-ae45-8e278e08b0c1',
                code: 'concept-4000',
                uri: 'http://uri.suomi.fi/terminology/sanasto/concept-4000',
                number: 0,
                createdBy: 'Admin User',
                createdDate: '1970-01-01T00:00:00.000Z',
                lastModifiedBy: 'Admin User',
                lastModifiedDate: '1970-01-01T00:00:00.000Z',
                type: {
                  id: 'Concept',
                  graph: {
                    id: '987987-987-987987',
                  },
                  uri: '',
                },
                properties: {
                  wordClass: [
                    {
                      lang: '',
                      value: 'adjective',
                      regex: '(?s)^.*$',
                    },
                  ],
                  source: [
                    {
                      lang: '',
                      value: 'lähde',
                      regex: '(?s)^.*$',
                    },
                  ],
                  changeNote: [
                    {
                      lang: '',
                      value: 'muutoshistoria',
                      regex: '(?s)^.*$',
                    },
                  ],
                  conceptClass: [
                    {
                      lang: '',
                      value: 'käsitteen luokka',
                      regex: '(?s)^.*$',
                    },
                  ],
                  definition: [
                    {
                      lang: 'fi',
                      value: 'määritelmä',
                      regex: '(?s)^.*$',
                    },
                    {
                      lang: 'en',
                      value: 'definition ',
                      regex: '(?s)^.*$',
                    },
                  ],
                  editorialNote: [
                    {
                      lang: '',
                      value: 'ylläpitäjän muistiinpano',
                      regex: '(?s)^.*$',
                    },
                  ],
                  example: [
                    {
                      lang: 'fi',
                      value: 'käyttöesimerkki',
                      regex: '(?s)^.*$',
                    },
                  ],
                  historyNote: [
                    {
                      lang: '',
                      value: 'käytön historiatieto',
                      regex: '(?s)^.*$',
                    },
                  ],
                  note: [
                    {
                      lang: 'fi',
                      value: 'huomautus',
                      regex: '(?s)^.*$',
                    },
                  ],
                  status: [
                    {
                      lang: '',
                      value: 'DRAFT',
                      regex: '(?s)^.*$',
                    },
                  ],
                  subjectArea: [
                    {
                      lang: '',
                      value: 'aihealue',
                      regex: '(?s)^.*$',
                    },
                  ],
                },
                references: {},
                referrers: {},
                identifier: {
                  id: 'c1207701-de9c-4759-ae45-8e278e08b0c1',
                  type: {
                    id: 'Concept',
                    graph: {
                      id: '987987-987-987987',
                    },
                    uri: '',
                  },
                },
              },
            ],
          },
          identifier: {
            id: '87713416-0a6e-4831-afa0-21fc05e3d6cd',
            type: {
              id: 'Term',
              graph: {
                id: '987987-987-987987',
              },
              uri: '',
            },
          },
        },
      ],
      isPartOf: [
        {
          id: '2a2b8b11-4dc9-4ddb-afde-812560a5b007',
          code: '',
          uri: '',
          number: 0,
          createdBy: 'Admin User',
          createdDate: '1970-01-01T00:00:00.000Z',
          lastModifiedBy: 'Admin User',
          lastModifiedDate: '1970-01-01T00:00:00.000Z',
          type: {
            id: 'Concept',
            graph: {
              id: '987987-987-987987',
            },
            uri: '',
          },
          properties: {
            definition: [
              {
                lang: 'fi',
                value: 'Määritelmä, suomi FI',
                regex: '(?s)^.*$',
              },
              {
                lang: 'en',
                value: 'Määritelmä, englanti EN',
                regex: '(?s)^.*$',
              },
            ],
            historyNote: [
              {
                lang: '',
                value: 'Käytön historiatieto "etymologia"',
                regex: '(?s)^.*$',
              },
            ],
            conceptClass: [
              {
                lang: '',
                value: 'Käsitteen luokka',
                regex: '(?s)^.*$',
              },
            ],
            wordClass: [
              {
                lang: '',
                value: 'adjective',
                regex: '(?s)^.*$',
              },
            ],
            status: [
              {
                lang: '',
                value: 'DRAFT',
                regex: '(?s)^.*$',
              },
            ],
            example: [
              {
                lang: 'fi',
                value: 'Käyttöesimerkki',
                regex: '(?s)^.*$',
              },
              {
                lang: 'en',
                value: 'Käyttöesimerkki',
                regex: '(?s)^.*$',
              },
            ],
            note: [
              {
                lang: 'fi',
                value: 'Huomautus',
                regex: '(?s)^.*$',
              },
              {
                lang: 'en',
                value: 'Huomautus',
                regex: '(?s)^.*$',
              },
            ],
            changeNote: [
              {
                lang: '',
                value: 'Muutoshistoria',
                regex: '(?s)^.*$',
              },
            ],
            subjectArea: [
              {
                lang: '',
                value: 'aihealue',
                regex: '(?s)^.*$',
              },
            ],
          },
          references: {
            prefLabelXl: [
              {
                id: '7a7b337a-8e13-42fb-be87-2ba0371981f1',
                code: '',
                uri: '',
                number: 0,
                createdBy: 'Admin User',
                createdDate: '1970-01-01T00:00:00.000Z',
                lastModifiedBy: 'Admin User',
                lastModifiedDate: '1970-01-01T00:00:00.000Z',
                type: {
                  id: 'Term',
                  graph: {
                    id: '987987-987-987987',
                  },
                  uri: '',
                },
                properties: {
                  prefLabel: [
                    {
                      lang: 'fi',
                      value: 'testi',
                      regex: '(?s)^.*$',
                    },
                  ],
                  status: [
                    {
                      lang: '',
                      value: 'DRAFT',
                      regex: '(?s)^.*$',
                    },
                  ],
                  termInfo: [
                    {
                      lang: '',
                      value: 'termin lisätieto',
                      regex: '(?s)^.*$',
                    },
                  ],
                  wordClass: [
                    {
                      lang: '',
                      value: 'adjective',
                      regex: '(?s)^.*$',
                    },
                  ],
                  termConjugation: [
                    {
                      lang: '',
                      value: 'singular',
                      regex: '(?s)^.*$',
                    },
                  ],
                  editorialNote: [
                    {
                      lang: '',
                      value: 'Ylläpitäjän muistiinpano',
                      regex: '(?s)^.*$',
                    },
                  ],
                  changeNote: [
                    {
                      lang: '',
                      value: 'Muutoshistoria',
                      regex: '(?s)^.*$',
                    },
                  ],
                  historyNote: [
                    {
                      lang: '',
                      value: 'Käytön historiatieto "etymologia"',
                      regex: '(?s)^.*$',
                    },
                  ],
                  termStyle: [
                    {
                      lang: '',
                      value: 'spoken-form',
                      regex: '(?s)^.*$',
                    },
                  ],
                  source: [
                    {
                      lang: '',
                      value: 'lähteet',
                      regex: '(?s)^.*$',
                    },
                  ],
                  scope: [
                    {
                      lang: '',
                      value: 'käyttöala',
                      regex: '(?s)^.*$',
                    },
                  ],
                  termFamily: [
                    {
                      lang: '',
                      value: 'neutral',
                      regex: '(?s)^.*$',
                    },
                  ],
                },
                references: {},
                referrers: {},
                identifier: {
                  id: '7a7b337a-8e13-42fb-be87-2ba0371981f1',
                  type: {
                    id: 'Term',
                    graph: {
                      id: '987987-987-987987',
                    },
                    uri: '',
                  },
                },
              },
            ],
          },
          referrers: {},
          identifier: {
            id: '2a2b8b11-4dc9-4ddb-afde-812560a5b007',
            type: {
              id: 'Concept',
              graph: {
                id: '987987-987-987987',
              },
              uri: '',
            },
          },
        },
      ],
      notRecommendedSynonym: [
        {
          id: '3aa3c3ca-bc58-4e83-97be-ef748ca907bd',
          code: 'term-4002',
          uri: 'http://uri.suomi.fi/terminology/sanasto/term-4002',
          number: 0,
          createdBy: 'Admin User',
          createdDate: '1970-01-01T00:00:00.000Z',
          lastModifiedBy: 'Admin User',
          lastModifiedDate: '1970-01-01T00:00:00.000Z',
          type: {
            id: 'Term',
            graph: {
              id: '987987-987-987987',
            },
            uri: '',
          },
          properties: {
            changeNote: [
              {
                lang: '',
                value: 'muutoshistoria',
                regex: '(?s)^.*$',
              },
            ],
            editorialNote: [
              {
                lang: '',
                value: 'ylläpitäjän muistiinpano',
                regex: '(?s)^.*$',
              },
            ],
            historyNote: [
              {
                lang: '',
                value: 'käytön historiatieto',
                regex: '(?s)^.*$',
              },
            ],
            prefLabel: [
              {
                lang: 'fi',
                value: 'Ei-suositettava synonyymi',
                regex: '(?s)^.*$',
              },
            ],
            scope: [
              {
                lang: '',
                value: 'käyttöala',
                regex: '(?s)^.*$',
              },
            ],
            source: [
              {
                lang: '',
                value: 'käyttöala',
                regex: '(?s)^.*$',
              },
            ],
            status: [
              {
                lang: '',
                value: 'DRAFT',
                regex: '(?s)^.*$',
              },
            ],
            termConjugation: [
              {
                lang: '',
                value: 'yksikkö',
                regex: '(?s)^.*$',
              },
            ],
            termEquivalency: [
              {
                lang: '',
                value: '~',
                regex: '(?s)^.*$',
              },
            ],
            termFamily: [
              {
                lang: '',
                value: 'neutri',
                regex: '(?s)^.*$',
              },
            ],
            termHomographNumber: [
              {
                lang: '',
                value: '1',
                regex: '(?s)^.*$',
              },
            ],
            termInfo: [
              {
                lang: '',
                value: 'termin lisätieto',
                regex: '(?s)^.*$',
              },
            ],
            termStyle: [
              {
                lang: '',
                value: 'puhekieli',
                regex: '(?s)^.*$',
              },
            ],
            wordClass: [
              {
                lang: '',
                value: 'adjektiivi',
                regex: '(?s)^.*$',
              },
            ],
          },
          references: {},
          referrers: {},
          identifier: {
            id: '3aa3c3ca-bc58-4e83-97be-ef748ca907bd',
            type: {
              id: 'Term',
              graph: {
                id: '987987-987-987987',
              },
              uri: '',
            },
          },
        },
      ],
    },
    referrers: {},
    type: {
      graph: {
        id: '987987-987-987987',
      },
      id: 'Concept',
      uri: '',
    },
    uri: 'uri.suomi.fi/terminology/sanasto/concept-1000',
  },
  [{ lang: 'fi', value: 'keskeneräinen sanasto', regex: '(?s)^.*$)' }]
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
      wordClass: 'adjektiivi',
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
      wordClass: 'adjektiivi',
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
      wordClass: 'adjektiivi',
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
          id: '7b179ea2-b28c-497e-9e81-6ff254235ea1',
          label: {
            fi: 'demo',
          },
          terminologyId: 'ec43f161-b85d-4786-a4b9-d0da52edfba1',
          terminologyLabel: {
            fi: 'testi',
            en: 'test',
          },
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
          id: '7b179ea2-b28c-497e-9e81-6ff254235ea1',
          label: {
            fi: 'demo',
          },
          terminologyId: 'ec43f161-b85d-4786-a4b9-d0da52edfba1',
          terminologyLabel: {
            fi: 'testi',
            en: 'test',
          },
        },
      ],
    },
    status: 'DRAFT',
    subject: 'aihealue',
  },
};
