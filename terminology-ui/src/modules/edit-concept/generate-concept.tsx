import { Concept } from '@app/common/interfaces/concept.interface';
import { Term } from '@app/common/interfaces/term.interface';
import toUri from '@app/common/utils/to-uri';
import { v4 } from 'uuid';
import { EditConceptType, RelationInfoType } from './new-concept.types';

interface generateConceptProps {
  data: EditConceptType;
  terminologyId: string;
  initialValue?: Concept;
  lastModifiedBy?: string;
}

const regex = '(?s)^.*$';

export default function generateConcept({
  data,
  terminologyId,
  initialValue,
  lastModifiedBy,
}: generateConceptProps) {
  const now = new Date();
  let matchingIds: string[] = [];
  let relatedMatchIds: string[] = [];
  let closeMatchIds: string[] = [];
  let broadMatchIds: string[] = [];
  let narrowMatchIds: string[] = [];

  let referrers: object;
  if (initialValue && initialValue.referrers) {
    const temp = new Map();

    Object.keys(initialValue.referrers).forEach((key) => {
      if (
        typeof initialValue.referrers[key as keyof Concept['referrers']] !==
        'string'
      ) {
        const obj = initialValue.referrers[
          key as keyof Concept['referrers']
        ]?.map((referrer) => ({
          id: referrer.id,
          type: {
            graph: {
              id: terminologyId,
            },
            id: 'Collection',
            uri: '',
          },
        }));

        temp.set(key, obj);
      }
    });

    referrers = Object.fromEntries(temp);
  } else {
    referrers = {};
  }

  const terms = data.terms.map((term) => {
    const initialTerm = initialValue
      ? getInitialTerm(term.id, initialValue.references)
      : null;

    const obj: any = {
      createdBy: initialValue ? initialTerm?.createdBy ?? '' : '',
      createdDate: initialValue
        ? initialTerm?.createdDate ?? ''
        : now.toISOString(),
      id: term.id,
      lastModifiedBy: initialValue ? lastModifiedBy ?? '' : '',
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
          ? term.source.map((note) => ({
              lang: '',
              regex: regex,
              value: note.value,
            }))
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
      referrers:
        initialValue && term.termType === 'recommended-term'
          ? {
              prefLabelXl: [
                {
                  id: initialValue.id,
                  type: {
                    graph: {
                      id: terminologyId,
                    },
                    id: 'Concept',
                    uri: '',
                  },
                },
              ],
            }
          : {},
      type: {
        graph: {
          id: terminologyId,
        },
        id: 'Term',
        uri: initialValue ? '' : 'http://www.w3.org/2008/05/skos-xl#Label',
      },
    };

    if (initialTerm) {
      obj.code = initialTerm.code;
      obj.uri = initialTerm.uri;
    }

    return obj;
  });

  const exactMatch = getExternalReference(
    data.basicInformation.relationalInfo.matchInOther,
    'exactMatch',
    initialValue,
    terminologyId
  );

  let externalTerms = exactMatch;

  matchingIds = [...matchingIds, ...exactMatch.map((match) => match.id)];

  if (data.basicInformation.relationalInfo.relatedConceptInOther) {
    const relatedMatch = getExternalReference(
      data.basicInformation.relationalInfo.relatedConceptInOther,
      'relatedMatch',
      initialValue,
      terminologyId
    );
    relatedMatchIds = [
      ...relatedMatchIds,
      ...relatedMatch.map((match) => match.id),
    ];
    externalTerms = [...externalTerms, ...relatedMatch];
  }

  if (data.basicInformation.relationalInfo.closeMatch) {
    const closeMatch = getExternalReference(
      data.basicInformation.relationalInfo.closeMatch,
      'closeMatch',
      initialValue,
      terminologyId
    );
    closeMatchIds = [...closeMatchIds, ...closeMatch.map((match) => match.id)];
    externalTerms = [...externalTerms, ...closeMatch];
  }

  if (data.basicInformation.relationalInfo.broadInOther) {
    const broadMatch = getExternalReference(
      data.basicInformation.relationalInfo.broadInOther,
      'broadMatch',
      initialValue,
      terminologyId
    );
    broadMatchIds = [...narrowMatchIds, ...broadMatch.map((match) => match.id)];
    externalTerms = [...externalTerms, ...broadMatch];
  }

  if (data.basicInformation.relationalInfo.narrowInOther) {
    const narrowMatch = getExternalReference(
      data.basicInformation.relationalInfo.narrowInOther,
      'narrowMatch',
      initialValue,
      terminologyId
    );
    narrowMatchIds = [
      ...narrowMatchIds,
      ...narrowMatch.map((match) => match.id),
    ];
    externalTerms = [...externalTerms, ...narrowMatch];
  }

  const retVal = [
    ...terms,
    ...externalTerms,
    {
      createdBy: initialValue ? initialValue.createdBy : '',
      createdDate: now.toISOString(),
      id: initialValue ? initialValue.id : v4(),
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
        externalLink:
          data.basicInformation.diagramAndSource.diagrams?.length > 0
            ? data.basicInformation.diagramAndSource.diagrams?.map(
                (diagram) => ({
                  lang: '',
                  regex: regex,
                  value: `"{"name":"${diagram.name ?? ''}","url":"${
                    diagram.url ? toUri(diagram.url) : ''
                  }","description":"${diagram.description ?? ''}"}"`,
                })
              )
            : [{ lang: '', regex: regex, value: '' }],
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
        source:
          data.basicInformation.diagramAndSource.sources?.length > 0
            ? data.basicInformation.diagramAndSource.sources.map((source) => ({
                lang: '',
                regex: regex,
                value: source.value ?? '',
              }))
            : [{ lang: '', regex: regex, value: '' }],
        status: [
          {
            lang: '',
            regex: regex,
            value: data.basicInformation.status,
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
            value: '',
          },
        ],
      },
      references: {
        altLabelXl: data.terms
          .filter((term) => term.termType === 'synonym')
          .map((term) => ({
            id: term.id,
            type: {
              graph: {
                id: terminologyId,
              },
              id: 'Term',
              uri: initialValue
                ? ''
                : 'http://www.w3.org/2008/05/skos-xl#Label',
            },
          })),
        broader: data.basicInformation.relationalInfo.broaderConcept.map(
          (basic) => ({
            id: basic.id,
            type: {
              graph: {
                id: terminologyId,
              },
              id: 'Concept',
              uri: '',
            },
          })
        ),
        closeMatch: closeMatchIds.map((id) => ({
          id: id,
          type: {
            graph: {
              id: terminologyId,
            },
            id: 'ConceptLink',
            uri: initialValue
              ? ''
              : 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Resource',
          },
        })),
        exactMatch: matchingIds.map((id) => ({
          id: id,
          type: {
            graph: {
              id: terminologyId,
            },
            id: 'ConceptLink',
            uri: initialValue
              ? ''
              : 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Resource',
          },
        })),
        hasPart: data.basicInformation.relationalInfo.hasPartConcept.map(
          (part) => ({
            id: part.id,
            type: {
              graph: {
                id: terminologyId,
              },
              id: 'Concept',
              uri: '',
            },
          })
        ),
        hiddenTerm: [],
        isPartOf: data.basicInformation.relationalInfo.isPartOfConcept.map(
          (part) => ({
            id: part.id,
            type: {
              graph: {
                id: terminologyId,
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
                    id: terminologyId,
                  },
                  id: 'Concept',
                  uri: '',
                },
              })
            )
          : [],
        notRecommendedSynonym: data.terms
          .filter((term) => term.termType === 'not-recommended-synonym')
          .map((term) => ({
            id: term.id,
            type: {
              graph: {
                id: terminologyId,
              },
              id: 'Term',
              uri: initialValue
                ? ''
                : 'http://www.w3.org/2008/05/skos-xl#Label',
            },
          })),
        prefLabelXl: data.terms
          .filter((term) => term.termType === 'recommended-term')
          .map((term) => ({
            id: term.id,
            type: {
              graph: {
                id: terminologyId,
              },
              id: 'Term',
              uri: initialValue
                ? ''
                : 'http://www.w3.org/2008/05/skos-xl#Label',
            },
          })),
        related: data.basicInformation.relationalInfo.relatedConcept.map(
          (related) => ({
            id: related.id,
            type: {
              graph: {
                id: terminologyId,
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
              id: terminologyId,
            },
            id: 'ConceptLink',
            uri: initialValue
              ? ''
              : 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Resource',
          },
        })),
        broadMatch: broadMatchIds.map((id) => ({
          id: id,
          type: {
            graph: {
              id: terminologyId,
            },
            id: 'ConceptLink',
            uri: initialValue
              ? ''
              : 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Resource',
          },
        })),
        narrowMatch: narrowMatchIds.map((id) => ({
          id: id,
          type: {
            graph: {
              id: terminologyId,
            },
            id: 'ConceptLink',
            uri: initialValue
              ? ''
              : 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Resource',
          },
        })),
        searchTerm: data.terms
          .filter((term) => term.termType === 'search-term')
          .map((term) => ({
            id: term.id,
            type: {
              graph: {
                id: terminologyId,
              },
              id: 'Term',
              uri: initialValue
                ? ''
                : 'http://www.w3.org/2008/05/skos-xl#Label',
            },
          })),
      },
      referrers: referrers,
      type: {
        graph: {
          id: terminologyId,
        },
        id: 'Concept',
        uri: initialValue ? '' : 'http://www.w3.org/2004/02/skos/core#Concept',
      },
    },
  ];

  if (initialValue) {
    retVal[retVal.length - 1].code = initialValue.code ?? '';
    retVal[retVal.length - 1].uri = initialValue.uri ?? '';
  }

  const initialTermIds: string[] = initialValue
    ? Object.keys(initialValue?.references).flatMap((key) => {
        if (
          [
            'broader',
            'closeMatch',
            'exactMatch',
            'hasPart',
            'isPartOf',
            'narrower',
            'related',
            'relatedMatch',
            'broadMatch',
            'narrowMatch',
          ].includes(key)
        ) {
          return [];
        }
        return (
          initialValue?.references[key as keyof Concept['references']]?.map(
            (val) => val.id
          ) ?? []
        );
      })
    : [];

  let initialInOtherIds: string[] = initialValue
    ? initialValue.references.exactMatch
        ?.map((match) => match.id ?? '')
        .filter((val) => val) ?? []
    : [];

  initialInOtherIds = initialValue
    ? [
        ...initialInOtherIds,
        ...(initialValue.references.relatedMatch
          ?.map((match) => match.id ?? '')
          .filter((val) => val) ?? []),
      ]
    : initialInOtherIds;

  initialInOtherIds = initialValue
    ? [
        ...initialInOtherIds,
        ...(initialValue.references.closeMatch
          ?.map((match) => match.id ?? '')
          .filter((val) => val) ?? []),
      ]
    : initialInOtherIds;

  initialInOtherIds = initialValue
    ? [
        ...initialInOtherIds,
        ...(initialValue.references.broadMatch
          ?.map((match) => match.id ?? '')
          .filter((val) => val) ?? []),
      ]
    : initialInOtherIds;

  initialInOtherIds = initialValue
    ? [
        ...initialInOtherIds,
        ...(initialValue.references.narrowMatch
          ?.map((match) => match.id ?? '')
          .filter((val) => val) ?? []),
      ]
    : initialInOtherIds;

  const newTermIds = data.terms.map((term) => term.id);
  const inOtherIds = [
    ...data.basicInformation.relationalInfo.matchInOther.map(
      (match) => match.id
    ),
    ...data.basicInformation.relationalInfo.relatedConceptInOther.map(
      (related) => related.id
    ),
    ...data.basicInformation.relationalInfo.closeMatch.map((close) => close.id),
    ...data.basicInformation.relationalInfo.broadInOther.map(
      (broad) => broad.id
    ),
    ...data.basicInformation.relationalInfo.narrowInOther.map(
      (narrow) => narrow.id
    ),
  ];

  let deleteVal =
    initialTermIds.length > 0
      ? initialTermIds
          .filter((initId) => !newTermIds.includes(initId))
          .map((id) => ({
            id: id,
            type: {
              graph: {
                id: terminologyId,
              },
              id: 'Term',
              uri: '',
            },
          }))
      : [];

  deleteVal =
    initialInOtherIds.length > 0
      ? [
          ...deleteVal,
          ...initialInOtherIds
            .filter((id) => !inOtherIds.includes(id))
            .map((id) => ({
              id: id,
              type: {
                graph: {
                  id: terminologyId,
                },
                id: 'ConceptLink',
                uri: '',
              },
            })),
        ]
      : deleteVal;

  return {
    delete: deleteVal,
    save: retVal,
  };
}

function getInitialTerm(id: string, terms: Concept['references']): Term | null {
  let retVal = null;

  for (const [, values] of Object.entries(terms)) {
    values.forEach((value) => {
      if (value.id === id) {
        retVal = value;
      }
    });

    if (retVal !== null) {
      break;
    }
  }

  return retVal;
}

function getExternalReference(
  relations: RelationInfoType[],
  key:
    | 'exactMatch'
    | 'closeMatch'
    | 'relatedMatch'
    | 'narrowMatch'
    | 'broadMatch',
  initialValue: Concept | undefined,
  terminologyId: string
) {
  return (
    relations?.map((match) => {
      const initialTerm = initialValue?.references[key]?.find(
        (m) => m.id === match.id
      );
      const id = initialTerm?.id ?? v4();

      return {
        code: initialTerm?.code,
        createdBy: initialTerm?.createdBy ?? '',
        createdDate: initialTerm?.createdDate ?? '',
        id: id,
        lastModifiedBy: initialTerm?.lastModifiedBy ?? '',
        lastModifiedDate: initialTerm?.lastModifiedDate ?? '',
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
              value: match.terminologyId,
            },
          ],
          targetId: [
            {
              lang: '',
              regex: regex,
              value: match.targetId ?? '',
            },
          ],
          vocabularyLabel: Object.keys(match.terminologyLabel).map((key) => ({
            lang: key,
            regex: regex,
            value: match.terminologyLabel[key],
          })),
        },
        references: {},
        referrers: {},
        type: {
          graph: {
            id: terminologyId,
          },
          id: 'ConceptLink',
          uri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Resource',
        },
        uri: initialTerm?.uri,
      };
    }) ?? []
  );
}
