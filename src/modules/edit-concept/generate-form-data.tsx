import { Concept } from '@app/common/interfaces/concept.interface';
import { Term } from '@app/common/interfaces/term.interface';
import { Property } from '@app/common/interfaces/termed-data-types.interface';
import { v4 } from 'uuid';
import { ConceptTermType, EditConceptType } from './new-concept.types';

export default function generateFormData(
  preferredTerms: {
    lang: string;
    value: string;
    regex: string;
  }[],
  conceptData?: Concept,
  terminologyLabel?: Property[]
): EditConceptType {
  if (!conceptData) {
    return {
      terms: preferredTerms.map((term) => ({
        changeNote: '',
        draftComment: '',
        editorialNote: [],
        historyNote: '',
        id: v4(),
        language: term.lang,
        prefLabel: term.value,
        scope: '',
        source: '',
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
      })),
      basicInformation: {
        definition: {},
        example: [],
        subject: '',
        note: [],
        diagramAndSource: {
          diagram: [],
          sources: '',
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
  }

  const definition = new Map();
  conceptData.properties.definition?.map((d) => {
    definition.set(d.lang, d.value);
  }) ?? {};

  const retVal: EditConceptType = {
    terms: [],
    basicInformation: {
      definition: Object.fromEntries(definition),
      diagramAndSource: {
        diagram: [],
        sources: conceptData.properties.source?.[0].value ?? '',
      },
      example:
        conceptData.properties.example?.map((e) => ({
          id: v4(),
          lang: e.lang,
          value: e.value,
        })) ?? [],
      note:
        conceptData.properties.note?.map((n) => ({
          id: v4(),
          lang: n.lang,
          value: n.value,
        })) ?? [],
      orgInfo: {
        changeHistory: conceptData.properties.changeNote?.[0].value ?? '',
        editorialNote:
          conceptData.properties.editorialNote?.map((en) => ({
            id: v4(),
            lang: '',
            value: en.value,
          })) ?? [],
        etymology: conceptData.properties.historyNote?.[0].value ?? '',
      },
      otherInfo: {
        conceptClass: conceptData.properties.conceptClass?.[0]?.value ?? '',
        wordClass: conceptData.properties.wordClass?.[0]?.value ?? '',
      },
      relationalInfo: {
        broaderConcept:
          conceptData.references.broader?.map((broad) => {
            {
              return {
                id: broad.id,
                label:
                  broad.references.prefLabelXl
                    ?.map((label) => {
                      return (
                        label.properties.prefLabel
                          ?.map((l) => ({
                            [l.lang]: l.value,
                          }))
                          .reduce((l) => l) ?? {}
                      );
                    })
                    .reduce((l) => l) ?? {},
                terminologyId: broad.type.graph.id,
                terminologyLabel:
                  terminologyLabel
                    ?.map((l) => ({ [l.lang]: l.value }))
                    .reduce((l) => l) ?? {},
              };
            }
          }) ?? [],
        hasPartConcept:
          conceptData.references.hasPart?.map((part) => {
            {
              return {
                id: part.id,
                label:
                  part.references?.prefLabelXl
                    ?.map((label) => {
                      return (
                        label.properties.prefLabel
                          ?.map((l) => ({
                            [l.lang]: l.value,
                          }))
                          .reduce((l) => l) ?? {}
                      );
                    })
                    .reduce((l) => l) ?? {},
                terminologyId: part.type.graph.id,
                terminologyLabel:
                  terminologyLabel
                    ?.map((l) => ({ [l.lang]: l.value }))
                    .reduce((l) => l) ?? {},
              };
            }
          }) ?? [],
        isPartOfConcept:
          conceptData.references?.isPartOf?.map((part) => {
            {
              return {
                id: part.id,
                label:
                  part.references.prefLabelXl
                    ?.map((label) => {
                      return (
                        label.properties.prefLabel
                          ?.map((l) => ({
                            [l.lang]: l.value,
                          }))
                          .reduce((l) => l) ?? {}
                      );
                    })
                    .reduce((l) => l) ?? {},
                terminologyId: part.type.graph.id,
                terminologyLabel:
                  terminologyLabel
                    ?.map((l) => ({ [l.lang]: l.value }))
                    .reduce((l) => l) ?? {},
              };
            }
          }) ?? [],
        matchInOther:
          conceptData.references.exactMatch?.map((r) => {
            const terminologyLabel = new Map();
            r.properties.vocabularyLabel?.forEach((l) => {
              terminologyLabel.set(l.lang, l.value);
            });

            {
              return {
                id: r.properties?.targetId?.[0]?.value ?? '',
                label:
                  r.properties?.prefLabel
                    ?.map((l) => {
                      return { [l.lang]: l.value };
                    })
                    .reduce((l) => l) ?? {},
                terminologyId: r.properties.targetGraph?.[0].value ?? '',
                terminologyLabel: terminologyLabel
                  ? Object.fromEntries(terminologyLabel)
                  : {},
              };
            }
          }) ?? [],
        narrowerConcept:
          conceptData.references?.narrower?.map((narrow) => {
            {
              return {
                id: narrow.id,
                label:
                  narrow.references?.prefLabelXl
                    ?.map((label) => {
                      return (
                        label.properties.prefLabel
                          ?.map((l) => ({
                            [l.lang]: l.value,
                          }))
                          .reduce((l) => l) ?? {}
                      );
                    })
                    .reduce((l) => l) ?? {},
                terminologyId: narrow.type.graph.id,
                terminologyLabel:
                  terminologyLabel
                    ?.map((l) => ({ [l.lang]: l.value }))
                    .reduce((l) => l) ?? {},
              };
            }
          }) ?? [],
        relatedConcept:
          conceptData.references.related?.map((r) => {
            {
              return {
                id: r.id,
                label:
                  r.references?.prefLabelXl
                    ?.map((label) => {
                      return (
                        label.properties.prefLabel
                          ?.map((l) => ({
                            [l.lang]: l.value,
                          }))
                          .reduce((l) => l) ?? {}
                      );
                    })
                    .reduce((l) => l) ?? {},
                terminologyId: r.type.graph.id,
                terminologyLabel:
                  terminologyLabel
                    ?.map((l) => ({ [l.lang]: l.value }))
                    .reduce((l) => l) ?? {},
              };
            }
          }) ?? [],
        relatedConceptInOther:
          conceptData.references.relatedMatch?.map((r) => {
            const terminologyLabel = new Map();
            r.properties.vocabularyLabel?.forEach((l) => {
              terminologyLabel.set(l.lang, l.value);
            });

            {
              return {
                id: r.properties?.targetId?.[0]?.value ?? '',
                label:
                  r.properties?.prefLabel
                    ?.map((l) => ({ [l.lang]: l.value }))
                    .reduce((l) => l) ?? {},
                terminologyId: r.properties.targetGraph?.[0].value ?? '',
                terminologyLabel: terminologyLabel
                  ? Object.fromEntries(terminologyLabel)
                  : {},
              };
            }
          }) ?? [],
      },
      subject: conceptData.properties.subjectArea?.[0].value ?? '',
    },
  };

  const termKeys = [
    'altLabelXl',
    'notRecommendedSynonym',
    'prefLabelXl',
    'searchTerm',
  ];

  const terms = Object.keys(conceptData.references)
    .filter((key) => termKeys.includes(key))
    ?.map((key) =>
      conceptData.references[key as keyof Concept['references']]?.map(
        (reference) => {
          const r = reference as Term;
          let termType = '';

          switch (key) {
            case 'altLabelXl': {
              termType = 'synonym';
              break;
            }
            case 'notRecommendedSynonym': {
              termType = 'not-recommended-synonym';
              break;
            }
            case 'prefLabelXl': {
              termType = 'recommended-term';
              break;
            }
            case 'searchTerm': {
              termType = 'search-term';
              break;
            }
          }

          return {
            changeNote: r.properties.changeNote?.[0].value ?? '',
            draftComment: '',
            editorialNote:
              r.properties.editorialNote?.map((note) => ({
                id: v4(),
                lang: note.lang,
                value: note.value,
              })) ?? [],
            historyNote: r.properties.historyNote?.[0].value ?? '',
            id: r.id,
            language: r.properties.prefLabel?.[0].lang ?? '',
            prefLabel: r.properties.prefLabel?.[0].value ?? '',
            scope: r.properties.scope?.[0].value ?? '',
            source: r.properties.source?.[0].value ?? '',
            status: r.properties.status?.[0].value ?? '',
            termConjugation: r.properties.termConjugation?.[0].value ?? '',
            termEquivalency: r.properties.termEquivalency?.[0].value ?? '',
            termEquivalencyRelation:
              r.properties.termEquivalencyRelation?.[0].value ?? '',
            termFamily: r.properties.termFamily?.[0].value ?? '',
            termHomographNumber:
              r.properties.termHomographNumber?.[0].value ?? '',
            termInfo: r.properties.termInfo?.[0].value ?? '',
            termStyle: r.properties.termStyle?.[0].value ?? '',
            termType: termType,
            wordClass: r.properties.wordClass?.[0].value ?? '',
          };
        }
      )
    )
    .flat()
    .filter((term) => term) as ConceptTermType[];

  return {
    ...retVal,
    terms: terms,
  };
}
