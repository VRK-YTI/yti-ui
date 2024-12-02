import { ConceptInfo } from '@app/common/interfaces/interfaces-v2';
import { getBlockData } from './utils';

describe('order concept data', () => {
  it('should order terms', () => {
    const x = '';

    const data = getBlockData(
      jest.fn((x) => x),
      concept
    );
    const termLabels = data.terms.map((t) => t.term.label);
    const defintions = Object.values(data.definitions);
    const notes = data.notes.map((note) => note.value);

    const expectedTermOrder = [
      'finnish pref term',
      'zzz finnish synonym',
      'aaa finnish synonym',
      'bbb finnish not recommended',
      'zzz finnish not recommended',
      'aaa finnish not recommended',
      'swedish pref term',
      'swedish synonym',
      'german pref term',
    ];

    const expectedDefinitionOrder = [
      'finnish definition',
      'swedish definition',
    ];

    const expectedNoteOrder = ['newest note', 'newer note', 'first note'];

    expect(JSON.stringify(termLabels)).toBe(JSON.stringify(expectedTermOrder));
    expect(JSON.stringify(defintions)).toBe(
      JSON.stringify(expectedDefinitionOrder)
    );
    expect(JSON.stringify(notes)).toBe(JSON.stringify(expectedNoteOrder));
  });
});

const concept = {
  identifier: 'concept-1',
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
  definition: {
    fi: 'finnish definition',
    sv: 'swedish definition',
  },
  notes: [
    { language: 'fi', value: 'first note' },
    { language: 'fi', value: 'newer note' },
    { language: 'fi', value: 'newest note' },
  ],
  examples: [],
  subjectArea: '',
  status: 'DRAFT',
  sources: [],
  links: [],
  changeNote: '',
  historyNote: '',
  conceptClass: '',
  editorialNotes: [],
  recommendedTerms: [
    {
      language: 'fi',
      label: 'finnish pref term',
    },
    {
      language: 'de',
      label: 'german pref term',
    },
    {
      language: 'sv',
      label: 'swedish pref term',
    },
  ],
  synonyms: [
    {
      language: 'fi',
      label: 'zzz finnish synonym',
    },
    {
      language: 'fi',
      label: 'aaa finnish synonym',
    },
    {
      language: 'sv',
      label: 'swedish synonym',
    },
  ],
  notRecommendedTerms: [
    {
      language: 'fi',
      label: 'bbb finnish not recommended',
    },
    {
      language: 'fi',
      label: 'zzz finnish not recommended',
    },
    {
      language: 'fi',
      label: 'aaa finnish not recommended',
    },
  ],
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
} as ConceptInfo;
