import { getBlockData } from './utils';

describe('order concept data', () => {
  it('should order terms', () => {
    const x = '';

    const data = getBlockData(
      jest.fn((x) => x),
      concept
    );
    const termLabels = data.terms.map(
      (t) => t.term.properties.prefLabel?.[0].value
    );
    const defintions = data.definitions.map((def) => def.value);
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
  id: '123',
  properties: {
    definition: [
      {
        lang: 'sv',
        value: 'swedish definition',
      },
      {
        lang: 'fi',
        value: 'finnish definition',
      },
    ],
    note: [
      {
        lang: 'fi',
        value: 'first note',
      },
      {
        lang: 'fi',
        value: 'newer note',
      },
      {
        lang: 'fi',
        value: 'newest note',
      },
    ],
  },
  referrers: {},
  references: {
    altLabelXl: [
      {
        properties: {
          prefLabel: [
            {
              lang: 'fi',
              value: 'zzz finnish synonym',
              regex: '(?s)^.*$',
            },
          ],
        },
      },
      {
        properties: {
          prefLabel: [
            {
              lang: 'fi',
              value: 'aaa finnish synonym',
              regex: '(?s)^.*$',
            },
          ],
        },
      },
      {
        properties: {
          prefLabel: [
            {
              lang: 'sv',
              value: 'swedish synonym',
              regex: '(?s)^.*$',
            },
          ],
        },
      },
    ],
    prefLabelXl: [
      {
        properties: {
          prefLabel: [
            {
              lang: 'fi',
              value: 'finnish pref term',
              regex: '(?s)^.*$',
            },
          ],
        },
      },
      {
        properties: {
          prefLabel: [
            {
              lang: 'de',
              value: 'german pref term',
              regex: '(?s)^.*$',
            },
          ],
        },
      },
      {
        properties: {
          prefLabel: [
            {
              lang: 'sv',
              value: 'swedish pref term',
              regex: '(?s)^.*$',
            },
          ],
        },
      },
    ],
    notRecommendedSynonym: [
      {
        properties: {
          prefLabel: [
            {
              lang: 'fi',
              value: 'bbb finnish not recommended',
              regex: '(?s)^.*$',
            },
          ],
        },
      },
      {
        properties: {
          prefLabel: [
            {
              lang: 'fi',
              value: 'zzz finnish not recommended',
              regex: '(?s)^.*$',
            },
          ],
        },
      },
      {
        properties: {
          prefLabel: [
            {
              lang: 'fi',
              value: 'aaa finnish not recommended',
              regex: '(?s)^.*$',
            },
          ],
        },
      },
    ],
  },
};
