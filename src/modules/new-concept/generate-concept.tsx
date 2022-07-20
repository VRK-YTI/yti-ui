import { v4 } from 'uuid';
import { ConceptTermType } from './concept-terms-block/concept-term-block-types';
import { BasicInfoType } from './basic-information/concept-basic-information-types';

interface generateConceptProps {
  terms: ConceptTermType[];
  basicInformation: BasicInfoType;
}

export default function generateConcept(data: generateConceptProps) {
  const regex = '(?s)^.*$';

  console.log('data', data);

  const now = new Date();
  let matchingIds: string[] = [];
  let relatedMatchIds: string[] = [];

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
        ? [
          {
            lang: '',
            regex: regex,
            value: term.scope,
          },
        ]
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

  let externalTerms =
    data.basicInformation.relationalInfo.matchInOther?.map((match) => {
      const id = v4();
      matchingIds = [...matchingIds, id];

      return {
        createdBy: '',
        createdDate: now.toISOString(),
        id: id,
        lastModifiedBy: '',
        lastModifiedDate: now.toISOString(),
        properties: {
          prefLabel: Object.keys(match.label).map((key) => ({
            lang: key,
            regex: regex,
            value: match.label[key],
          })),
          targetGraph: [
            {
              lang: '',
              regex: regex,
              value: match.terminology.id,
            },
          ],
          targetId: [
            {
              lang: '',
              regex: regex,
              value: match.id,
            },
          ],
          vocabularyLabel: Object.keys(match.terminology.label).map((key) => ({
            lang: key,
            regex: regex,
            value: match.terminology.label[key],
          })),
        },
        references: {},
        referrers: {},
        type: {
          graph: {
            id: match.id,
          },
          id: 'ConceptLink',
          uri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Resource',
        },
      };
    }) ?? [];

  if (data.basicInformation.relationalInfo.relatedConceptInOther) {
    externalTerms = [
      ...externalTerms,
      ...data.basicInformation.relationalInfo.relatedConceptInOther.map(
        (related) => {
          const id = v4();
          relatedMatchIds = [...relatedMatchIds, id];

          return {
            createdBy: '',
            createdDate: now.toISOString(),
            id: id,
            lastModifiedBy: '',
            lastModifiedDate: now.toISOString(),
            properties: {
              prefLabel: Object.keys(related.label).map((key) => ({
                lang: key,
                regex: regex,
                value: related.label[key],
              })),
              targetGraph: [
                {
                  lang: '',
                  regex: regex,
                  value: related.terminology.id,
                },
              ],
              targetId: [
                {
                  lang: '',
                  regex: regex,
                  value: related.id,
                },
              ],
              vocabularyLabel: Object.keys(related.terminology.label).map(
                (key) => ({
                  lang: key,
                  regex: regex,
                  value: related.terminology.label[key],
                })
              ),
            },
            references: {},
            referrers: {},
            type: {
              graph: {
                id: related.id,
              },
              id: 'ConceptLink',
              uri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Resource',
            },
          };
        }
      ),
    ] ?? [];
  }

  return [
    ...terms,
    ...externalTerms,
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
        conceptScope: [
          {
            lang: '',
            regex: regex,
            value: '',
          },
        ],
        definition: data.basicInformation.definition
          ? Object.keys(data.basicInformation.definition).map((lang) => ({
            lang: lang,
            regex: regex,
            value: data.basicInformation.definition[lang] ?? '',
          }))
          : [
            {
              lang: '',
              regex: regex,
              value: '',
            },
          ],
        editorialNote: data.basicInformation.orgInfo.editorialNote.map(
          (note) => ({
            lang: '',
            regex: regex,
            value: note.value,
          })
        ),
        example: data.basicInformation.example.map((ex) => ({
          lang: ex.lang,
          regex: regex,
          value: ex.value ?? '',
        })),
        externalLink: [
          {
            lang: '',
            regex: regex,
            value: '',
          },
        ],
        historyNote: [
          {
            lang: '',
            regex: regex,
            value: data.basicInformation.orgInfo?.etymology ?? '',
          },
        ],
        notation: [
          {
            lang: '',
            regex: regex,
            value: '',
          },
        ],
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
        altLabelXl: data.terms
          .filter(term => term.termType === 'synonym')
          .map(term => (
            {
              id: term.id,
              type: {
                graph: {
                  id: '747340b9-8ab6-4aa4-b4e6-5327813505e5',
                },
                id: 'Term',
                uri: 'http://www.w3.org/2008/05/skos-xl#Label'
              }
            }
          )),
        broader: data.basicInformation.relationalInfo.broaderConcept.map(
          (basic) => ({
            id: basic.id,
            type: {
              graph: {
                id: 'ec43f161-b85d-4786-a4b9-d0da52edfba1',
              },
              id: 'Concept',
              uri: '',
            },
          })
        ),
        closeMatch: [],
        exactMatch: matchingIds.map((id) => ({
          id: id,
          type: {
            graph: {
              id: 'ec43f161-b85d-4786-a4b9-d0da52edfba1',
            },
            id: 'ConceptLink',
            uri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Resource',
          },
        })),
        hasPart: data.basicInformation.relationalInfo.hasPartConcept.map((part) => ({
          id: part.id,
          type: {
            graph: {
              id: 'ec43f161-b85d-4786-a4b9-d0da52edfba1',
            },
            id: 'Concept',
            uri: '',
          },
        })),
        hiddenTerm: [],
        isPartOf: data.basicInformation.relationalInfo.isPartOfConcept.map(
          (part) => ({
            id: part.id,
            type: {
              graph: {
                id: 'ec43f161-b85d-4786-a4b9-d0da52edfba1',
              },
              id: 'Concept',
              uri: '',
            },
          })
        ),
        narrower: data.basicInformation.relationalInfo.narrowerConcept
          ? data.basicInformation.relationalInfo.narrowerConcept.map(
            (narrow) => ({
              id: narrow.id,
              type: {
                graph: {
                  id: 'ec43f161-b85d-4786-a4b9-d0da52edfba1',
                },
                id: 'Concept',
                uri: '',
              },
            })
          )
          : [],
        notRecommendedSynonym: data.terms
          .filter(term => term.termType === 'not-recommended-synonym')
          .map(term => (
            {
              id: term.id,
              type: {
                graph: {
                  id: '747340b9-8ab6-4aa4-b4e6-5327813505e5',
                },
                id: 'Term',
                uri: 'http://www.w3.org/2008/05/skos-xl#Label'
              }
            }
          )),
        prefLabelXl: data.terms
          .filter((term) => term.termType === 'recommended-term')
          .map((term) => ({
            id: term.id,
            type: {
              graph: {
                id: '747340b9-8ab6-4aa4-b4e6-5327813505e5',
              },
              id: 'Term',
              uri: 'http://www.w3.org/2008/05/skos-xl#Label',
            },
          })),
        related: data.basicInformation.relationalInfo.relatedConcept.map(
          (related) => ({
            id: related.id,
            type: {
              graph: {
                id: 'ec43f161-b85d-4786-a4b9-d0da52edfba1',
              },
              id: 'Concept',
              uri: '',
            },
          })
        ),
        relatedMatch: relatedMatchIds.map((id) => ({
          id: id,
          type: {
            graph: {
              id: 'ec43f161-b85d-4786-a4b9-d0da52edfba1',
            },
            id: 'ConceptLink',
            uri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Resource',
          },
        })),
        searchTerm: data.terms
          .filter(term => term.termType === 'search-term')
          .map(term => (
            {
              id: term.id,
              type: {
                graph: {
                  id: '747340b9-8ab6-4aa4-b4e6-5327813505e5',
                },
                id: 'Term',
                uri: 'http://www.w3.org/2008/05/skos-xl#Label'
              }
            }
          )),
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
