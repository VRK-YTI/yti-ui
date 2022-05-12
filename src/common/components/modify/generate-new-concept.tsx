import { v4 } from 'uuid';

export default function generateNewConcept(conceptInfo: any, terminologyId: string) {
  if (!conceptInfo.terms.preferredTerm || conceptInfo.terms.preferredTerm.length < 1) {
    return null;
  }

  const now = new Date();
  const regex = '(?s)^.*$';
  let preferredTermIds: string[] = [];

  const terms = conceptInfo.terms?.preferredTerm?.map(term => {
    const UUID = v4();
    preferredTermIds = [...preferredTermIds, UUID];

    return (
      {
        createdBy: '',
        createdDate: now.toISOString(),
        id: UUID, // Need to check what goes here
        lastModifiedBy: '',
        lastModifiedDate: now.toISOString(),
        properties: {
          changeNote: [{
            lang: '',
            regex: regex,
            value: term.changeNote ?? ''
          }],
          draftComment: [{
            lang: '',
            regex: regex,
            value: term.draftComment ?? ''
          }],
          editorialNote: term.editorialNote
            ?
            [{
              lang: '',
              regex: regex,
              value: term.editorialNote
            }]
            :
            [],
          historyNote: [{
            lang: '',
            regex: regex,
            value: term.historyNote ?? ''
          }],
          prefLabel: [{
            lang: term.lang,
            regex: regex,
            value: term.prefLabel ?? ''
          }],
          scope: [{
            lang: '',
            regex: regex,
            value: term.scope ?? ''
          }],
          source: term.source
            ?
            [{
              lang: '',
              regex: regex,
              value: term.source
            }]
            :
            [],
          status: [{
            lang: '',
            regex: regex,
            value: 'DRAFT'
          }],
          termConjugation: [{
            lang: '',
            regex: regex,
            value: term.termConjugation ?? ''
          }],
          termEquivalency: [{
            lang: '',
            regex: regex,
            value: term.termEquivalency ?? ''
          }],
          termEquivalencyRelation: [{
            lang: '',
            regex: regex,
            value: term.termEquivalencyRelation ?? ''
          }],
          termFamily: [{
            lang: '',
            regex: regex,
            value: term.termFamily ?? ''
          }],
          termHomographNumber: [{
            lang: '',
            regex: regex,
            value: term.termHomographNumber ?? ''
          }],
          termInfo: [{
            lang: '',
            regex: regex,
            value: term.termInfo ?? ''
          }],
          termStyle: [{
            lang: '',
            regex: regex,
            value: term.termStyle ?? ''
          }],
          wordClass: [{
            lang: '',
            regex: regex,
            value: term.wordClass ?? ''
          }]
        },
        references: {},
        referrers: {},
        type: {
          graph: {
            id: terminologyId
          },
          id: 'Term',
          uri: 'http://www.w3.org/2008/05/skos-xl#Label'
        }
      }
    );
  }) ?? [];

  const temp = {
    delete: [],
    save: [
      ...terms,
      {
        createdBy: '',
        createdDate: now.toISOString(),
        id: v4(), // This can be random, only referenced here
        lastModifiedBy: '',
        lastModifiedDate: now.toISOString(),
        properties: {
          changeNote: [{
            lang: '',
            regex: regex,
            value: ''
          }],
          conceptClass: [{
            lang: '',
            regex: regex,
            value: ''
          }],
          conceptScope: [{
            lang: '',
            regex: regex,
            value: ''
          }],
          definition: conceptInfo.definition && Object.keys(conceptInfo.definition).map(lang => {
            return ({
              lang: lang,
              regex: regex,
              value: conceptInfo.definition[lang],
            });
          }).filter(item => item.value),
          editorialNote: [],
          example: conceptInfo.example && conceptInfo.example.map(e => {
            return ({
              lang: e.lang,
              regex: regex,
              value: e.value
            });
          }).filter(item => item.value),
          externalLink: [{
            lang: '',
            regex: regex,
            value: ''
          }],
          historyNote: [{
            lang: '',
            regex: regex,
            value: ''
          }],
          notation: [{
            lang: '',
            regex: regex,
            value: ''
          }],
          note: conceptInfo.note && conceptInfo.note.map(n => {
            return ({
              lang: n.lang,
              regex: regex,
              value: n.value
            });
          }).filter(item => item.value),
          source: [],
          status: [{
            lang: '',
            regex: regex,
            value: 'DRAFT'
          }],
          subjectArea: [{
            lang: '',
            regex: regex,
            value: conceptInfo.subject
          }],
          wordClass: [{
            lang: '',
            regex: regex,
            value: ''
          }]
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
          prefLabelXl: preferredTermIds.map(id => {
            return (
              {
                id: id,
                type: {
                  graph: {
                    id: terminologyId
                  },
                  id: 'Term',
                  uri: 'http://www.w3.org/2008/05/skos-xl#Label'
                }
              }
            );
          }),
          related: [],
          relatedMatch: [],
          searchTerm: []
        },
        referrers: {},
        type: {
          graph: {
            id: terminologyId
          },
          id: 'Concept',
          uri: 'http://www.w3.org/2004/02/skos/core#Concept'
        }
      }
    ]
  };

  console.log(temp);

  return temp;
}
