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

    const expectedTermOrder = [
      'finnish pref term',
      'aaa finnish synonym',
      'zzz finnish synonym',
      'finnish not recommended',
      'swedish pref term',
      'swedish synonym',
      'german pref term',
    ];

    const expectedDefinitionOrder = [
      'finnish definition',
      'swedish definition',
    ];

    expect(JSON.stringify(termLabels)).toBe(JSON.stringify(expectedTermOrder));
    expect(JSON.stringify(defintions)).toBe(
      JSON.stringify(expectedDefinitionOrder)
    );
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
              value: 'finnish not recommended',
              regex: '(?s)^.*$',
            },
          ],
        },
      },
    ],
  },
};
