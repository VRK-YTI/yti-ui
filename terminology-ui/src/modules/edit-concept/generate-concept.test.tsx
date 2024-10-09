import { Concept } from '@app/common/interfaces/interfaces-v2';
import generateConceptPayload from './generate-concept';

function getReference(id: string) {
  return {
    id: `https://iri.suomi.fi/terminology/test/${id}`,
    label: { fi: 'test reference' },
    terminologyId: 'test',
    terminologyLabel: { fi: 'terminology label' },
  };
}

const input = {
  terms: [
    {
      changeNote: 'term change',
      editorialNote: [
        {
          id: '',
          value: 'editorial note',
        },
      ],
      historyNote: 'term history',
      id: '0',
      language: 'fi',
      prefLabel: 'pref label',
      scope: 'scope',
      source: [
        {
          id: '',
          value: 'term source',
        },
      ],
      status: 'DRAFT',
      termConjugation: 'SINGULAR',
      termEquivalency: 'BROADER',
      termFamily: 'NEUTER',
      termHomographNumber: '2',
      termInfo: 'info',
      termStyle: 'term style',
      termType: 'recommended-term',
      wordClass: 'ADJECTIVE',
    },
    {
      changeNote: '',
      editorialNote: [],
      historyNote: '',
      id: '0',
      language: 'fi',
      prefLabel: 'synonym',
      scope: '',
      source: [],
      status: 'DRAFT',
      termConjugation: '',
      termEquivalency: '',
      termFamily: '',
      termHomographNumber: '',
      termInfo: '',
      termStyle: '',
      termType: 'synonym',
      wordClass: '',
    },
  ],
  basicInformation: {
    identifier: 'concept-1',
    definition: {
      fi: 'definition',
    },
    example: [
      {
        id: '',
        lang: 'fi',
        value: 'example',
      },
    ],
    status: 'DRAFT',
    subject: 'subject',
    note: [
      { id: '', lang: 'fi', value: 'note 1' },
      { id: '', lang: 'fi', value: 'note 2' },
    ],
    diagramAndSource: {
      diagrams: [],
      sources: [
        {
          id: '',
          lang: 'fi',
          value: 'concept source',
        },
      ],
    },
    orgInfo: {
      changeHistory: 'change concept',
      editorialNote: [
        {
          id: '',
          lang: 'fi',
          value: 'concept editorial note',
        },
      ],
      etymology: 'etymology',
    },
    otherInfo: {
      conceptClass: 'class',
    },
    relationalInfo: {
      broaderConcept: [getReference('broader-1'), getReference('broader-2')],
      narrowerConcept: [getReference('narrower-1')],
      relatedConcept: [getReference('related-1')],
      isPartOfConcept: [getReference('part-of-1')],
      hasPartConcept: [getReference('has-part-1')],
      relatedConceptInOther: [getReference('related-match-1')],
      matchInOther: [getReference('exact-match-1')],
      closeMatch: [getReference('close-match-1')],
      broadInOther: [getReference('broad-match-1')],
      narrowInOther: [getReference('narrow-match-1')],
    },
  },
};

const expected = {
  identifier: 'concept-1',
  definition: {
    fi: 'definition',
  },
  notes: [
    { language: 'fi', value: 'note 1' },
    { language: 'fi', value: 'note 2' },
  ],
  examples: [{ language: 'fi', value: 'example' }],
  subjectArea: 'subject',
  sources: ['concept source'],
  links: [],
  changeNote: 'change concept',
  historyNote: 'etymology',
  conceptClass: 'class',
  editorialNotes: ['concept editorial note'],
  status: 'DRAFT',
  recommendedTerms: [
    {
      language: 'fi',
      label: 'pref label',
      homographNumber: 2,
      status: 'DRAFT',
      termInfo: 'info',
      scope: 'scope',
      historyNote: 'term history',
      changeNote: 'term change',
      termStyle: 'term style',
      termFamily: 'NEUTER',
      termConjugation: 'SINGULAR',
      termEquivalency: 'BROADER',
      wordClass: 'ADJECTIVE',
      sources: ['term source'],
      editorialNotes: ['editorial note'],
    },
  ],
  synonyms: [
    {
      language: 'fi',
      label: 'synonym',
      status: 'DRAFT',
      homographNumber: 0,
      termInfo: '',
      scope: '',
      historyNote: '',
      changeNote: '',
      termStyle: '',
      termFamily: undefined,
      termConjugation: undefined,
      termEquivalency: undefined,
      wordClass: undefined,
      sources: [],
      editorialNotes: [],
    },
  ],
  notRecommendedTerms: [],
  searchTerms: [],
  broader: [
    'https://iri.suomi.fi/terminology/test/broader-1',
    'https://iri.suomi.fi/terminology/test/broader-2',
  ],
  narrower: ['https://iri.suomi.fi/terminology/test/narrower-1'],
  related: ['https://iri.suomi.fi/terminology/test/related-1'],
  isPartOf: ['https://iri.suomi.fi/terminology/test/part-of-1'],
  hasPart: ['https://iri.suomi.fi/terminology/test/has-part-1'],
  exactMatch: ['https://iri.suomi.fi/terminology/test/exact-match-1'],
  closeMatch: ['https://iri.suomi.fi/terminology/test/close-match-1'],
  relatedMatch: ['https://iri.suomi.fi/terminology/test/related-match-1'],
  narrowMatch: ['https://iri.suomi.fi/terminology/test/narrow-match-1'],
  broadMatch: ['https://iri.suomi.fi/terminology/test/broad-match-1'],
} as Concept;

describe('generate-concept', () => {
  it('should generate concept payload for creation', () => {
    const returned = generateConceptPayload({
      data: input,
      isEdit: false,
    });

    expect(returned).toStrictEqual(expected);
  });

  it('should generate concept payload for edit', () => {
    const returned = generateConceptPayload({
      data: input,
      isEdit: true,
    });

    // edit payload should not have concept identifier set
    const editPayload = Object.assign({}, expected);
    delete editPayload.identifier;
    expect(returned).toStrictEqual(editPayload);
  });
});
