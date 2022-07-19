import { v4 } from 'uuid';

export default function generateConcept(data: any) {
  const regex = '(?s)^.*$';

  console.log('data', data);

  const now = new Date();
  // const id = v4();

  const terms = data.terms.map((term) => ({
    createdBy: '',
    createdDate: now.toISOString(),
    id: term.id,
    lastModifiedBy: '',
    lastModifiedDate: now.toISOString(),
    properties: {
      changeNote: [
        {
          lang: '',
          regex: regex,
          value: term.changeNote,
        },
      ],
      draftComment: [
        {
          lang: '',
          regex: regex,
          value: '',
        },
      ],
      editorialNote: term.editorialNote
        ? term.editorialNote.map((note) => ({
          lang: '',
          regex: regex,
          value: note.value,
        }))
        : [],
      historyNote: [
        {
          lang: '',
          regex: regex,
          value: term.historyNote,
        },
      ],
      prefLabel: [
        {
          lang: term.language,
          regex: regex,
          value: term.prefLabel,
        },
      ],
      scope: [
        {
          lang: '',
          regex: regex,
          value: term.scope,
        },
      ],
      source: term.source
        ? [{
          lang: '',
          regex: regex,
          value: term.scope
        }]
        : [],
      status: [
        {
          lang: '',
          regex: regex,
          value: term.status.toUpperCase(),
        },
      ],
      termConjugation: [
        {
          lang: '',
          regex: regex,
          value: term.termConjugation,
        },
      ],
      termEquivalency: [
        {
          lang: '',
          regex: regex,
          value: term.termEquivalency,
        },
      ],
      termEquivalencyRelation: [
        {
          lang: '',
          regex: regex,
          value: term.termEquivalencyRelation,
        },
      ],
      termFamily: [
        {
          lang: '',
          regex: regex,
          value: term.termFamily,
        },
      ],
      termHomographNumber: [
        {
          lang: '',
          regex: regex,
          value: term.termHomographNumber,
        },
      ],
      termInfo: [
        {
          lang: '',
          regex: regex,
          value: term.termInfo,
        },
      ],
      termStyle: [
        {
          lang: '',
          regex: regex,
          value: term.termStyle,
        },
      ],
      wordClass: [
        {
          lang: '',
          regex: regex,
          value: term.wordClass,
        },
      ],
    },
    references: {},
    referrers: {},
    type: {
      graph: {
        id: '747340b9-8ab6-4aa4-b4e6-5327813505e5',
      },
      id: 'Term',
      uri: 'http://www.w3.org/2008/05/skos-xl#Label',
    },
  }));

  return [
    ...terms,
    {
      createdBy: '',
      createdDate: now.toISOString(),
      id: v4(),
      lastModifiedBy: '',
      lastModifiedDate: now.toISOString(),
      properties: {
        changeNote: [
          {
            lang: '',
            regex: regex,
            value: data.basicInformation.orgInfo.changeHistory ?? '',
          },
        ],
        conceptClass: [
          {
            lang: '',
            regex: regex,
            value: data.basicInformation.otherInfo.conceptClass ?? '',
          },
        ],
        conceptScope: [{
          lang: '',
          regex: regex,
          value: ''
        }],
        definition: data.basicInformation.definition
          ? Object.keys(data.basicInformation.definition).map((lang) => ({
            lang: lang,
            regex: regex,
            value: data.basicInformation.definition[lang] ?? '',
          }))
          : [{
            lang: '',
            regex: regex,
            value: ''
          }],
        editorialNote: [],
        example: data.basicInformation.example?.map((ex) => ({
          lang: ex.lang,
          regex: regex,
          value: ex.value ?? '',
        })),
        externalLink: [{
          lang: '',
          regex: regex,
          value: ''
        }],
        historyNote: [
          {
            lang: '',
            regex: regex,
            value: data.basicInformation.orgInfo?.etymology ?? '',
          },
        ],
        notation: [{
          lang: '',
          regex: regex,
          value: ''
        }],
        note: data.basicInformation.note?.map((n) => ({
          lang: n.lang,
          regex: regex,
          value: n.value ?? '',
        })),
        source: [],
        status: [
          {
            lang: '',
            regex: regex,
            value: 'DRAFT',
          },
        ],
        subjectArea: [
          {
            lang: '',
            regex: regex,
            value: data.basicInformation.subject ?? '',
          },
        ],
        wordClass: [
          {
            lang: '',
            regex: regex,
            value: data.basicInformation.otherInfo.wordClass ?? '',
          },
        ],
      },
      references: {
        altLabelXl: [],
        broader: [],
        closeMatch: [],
        exactMatch: [],
        hasPart: [],
        hiddenTerm: [],
        isPartOf: [],
        narrower: [],
        notRecommendedSynonym: [],
        // Kaikki suositettavat termit listana
        prefLabelXl: data.terms
          .filter(term => term.termType === 'recommended-term')
          .map(term => ({
            id: term.id,
            type: {
              graph: {
                id: '747340b9-8ab6-4aa4-b4e6-5327813505e5'
              },
              id: 'Term',
              uri: 'http://www.w3.org/2008/05/skos-xl#Label'
            }
          })),
        related: [],
        relatedMatch: [],
        searchTerm: [],
      },
      referrers: {},
      type: {
        graph: {
          id: '747340b9-8ab6-4aa4-b4e6-5327813505e5',
        },
        id: 'Concept',
        uri: 'http://www.w3.org/2004/02/skos/core#Concept',
      },
    },
  ];
}
