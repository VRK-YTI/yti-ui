import { VocabularyInfoDTO } from '@app/common/interfaces/vocabulary.interface';
import generateInitialData from './generate-initial-data';

describe('generate-initial-data', () => {
  it('should generate initial data from input', () => {
    const returned = generateInitialData('fi', dataSmall);

    const expected = {
      contact: 'yhteentoimivuus@dvv.fi',
      languages: [
        {
          description: 'kuvaus',
          labelText: 'fi',
          selected: true,
          title: 'testi2',
          uniqueItemId: 'fi',
        },
      ],
      infoDomains: [
        {
          checked: false,
          groupId: '654-789',
          labelText: 'Asuminen',
          name: 'Asuminen',
          uniqueItemId: '654-456',
        },
      ],
      contributors: [
        {
          labelText: 'Yhteentoimivuusalustan yllapito',
          name: 'Yhteentoimivuusalustan yllapito',
          organizationId: '456-456',
          uniqueItemId: '456-123',
        },
      ],
      prefix: ['abc1234', true],
      status: 'DRAFT',
      type: 'TERMINOLOGICAL_VOCABULARY',
    };

    expect(returned).toStrictEqual(expected);
  });

  it('should generate data from large input', () => {
    const returned = generateInitialData('fi', dataLarge);
    const expected = {
      contact: 'yhteentoimivuus@dvv.fi',
      languages: [
        {
          description: 'kuvaus',
          labelText: 'fi',
          selected: true,
          title: 'testi2',
          uniqueItemId: 'fi',
        },
        {
          description: 'description',
          labelText: 'en',
          selected: true,
          title: 'test2',
          uniqueItemId: 'en',
        },
        {
          description: '',
          labelText: 'sv',
          selected: true,
          title: 'test2',
          uniqueItemId: 'sv',
        },
      ],
      infoDomains: [
        {
          checked: false,
          groupId: '654-789',
          labelText: 'Asuminen',
          name: 'Asuminen',
          uniqueItemId: '654-456',
        },
        {
          checked: false,
          groupId: '987-456',
          labelText: 'Yksityinen talous ja rahoitus',
          name: 'Yksityinen talous ja rahoitus',
          uniqueItemId: '987-123',
        },
      ],
      contributors: [
        {
          labelText: 'Yhteentoimivuusalustan yllapito',
          name: 'Yhteentoimivuusalustan yllapito',
          organizationId: '456-456',
          uniqueItemId: '456-123',
        },
      ],
      prefix: ['abc1234', true],
      status: 'VALID',
      type: 'OTHER_VOCABULARY',
    };

    expect(returned).toStrictEqual(expected);
  });
});

const dataSmall: VocabularyInfoDTO = {
  id: '123',
  code: 'terminological-vocabulary-0',
  uri: 'uri.fi/terminology/abc1234/terminological-vocabulary-0',
  number: 0,
  createdBy: 'Admin User',
  createdDate: '1970-01-01T00:00:00.000Z',
  lastModifiedBy: 'Admin User',
  lastModifiedDate: '1970-01-01T00:00:00.000Z',
  type: {
    id: 'TerminologicalVocabulary',
    graph: {
      id: '789',
    },
    uri: '',
  },
  properties: {
    contact: [
      {
        lang: '',
        value: 'yhteentoimivuus@dvv.fi',
        regex: '(?s)^.*$',
      },
    ],
    language: [
      {
        lang: '',
        value: 'fi',
        regex: '(?s)^.*$',
      },
    ],
    prefLabel: [
      {
        lang: 'fi',
        value: 'testi2',
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
    terminologyType: [
      {
        lang: '',
        value: 'TERMINOLOGICAL_VOCABULARY',
        regex: '^(OTHER_VOCABULARY|TERMINOLOGICAL_VOCABULARY)$',
      },
    ],
    description: [
      {
        lang: 'fi',
        value: 'kuvaus',
        regex: '(?s)^.*$',
      },
    ],
  },
  references: {
    contributor: [
      {
        id: '456-123',
        code: '',
        uri: '',
        number: 0,
        createdBy: '',
        createdDate: '1970-01-01T00:00:00.000Z',
        lastModifiedBy: '',
        lastModifiedDate: '1970-01-01T00:00:00.000Z',
        type: {
          id: 'Organization',
          graph: {
            id: '456-456',
          },
          uri: '',
        },
        properties: {
          prefLabel: [
            {
              lang: 'en',
              value: 'Interoperability platform developers',
              regex: '(?s)^.*$',
            },
            {
              lang: 'fi',
              value: 'Yhteentoimivuusalustan yllapito',
              regex: '(?s)^.*$',
            },
            {
              lang: 'sv',
              value: 'Utvecklare av interoperabilitetsplattform',
              regex: '(?s)^.*$',
            },
          ],
        },
        references: {},
        referrers: {},
        identifier: {
          id: '456-123',
          type: {
            id: 'Organization',
            graph: {
              id: '456-456',
            },
            uri: '',
          },
        },
      },
    ],
    inGroup: [
      {
        id: '654-456',
        code: 'v1001',
        uri: '',
        number: 0,
        createdBy: '',
        createdDate: '1970-01-01T00:00:00.000Z',
        lastModifiedBy: '',
        lastModifiedDate: '1970-01-01T00:00:00.000Z',
        type: {
          id: 'Group',
          graph: {
            id: '654-789',
          },
          uri: '',
        },
        properties: {
          notation: [
            {
              lang: '',
              value: 'P1',
              regex: '(?s)^.*$',
            },
          ],
          definition: [
            {
              lang: 'en',
              value: '',
              regex: '(?s)^.*$',
            },
            {
              lang: 'fi',
              value: '',
              regex: '(?s)^.*$',
            },
            {
              lang: 'sv',
              value: '',
              regex: '(?s)^.*$',
            },
          ],
          order: [
            {
              lang: '',
              value: '100',
              regex: '(?s)^.*$',
            },
          ],
          prefLabel: [
            {
              lang: 'en',
              value: 'Housing',
              regex: '(?s)^.*$',
            },
            {
              lang: 'sv',
              value: 'Boende',
              regex: '(?s)^.*$',
            },
            {
              lang: 'fi',
              value: 'Asuminen',
              regex: '(?s)^.*$',
            },
          ],
        },
        references: {},
        referrers: {},
        identifier: {
          id: '654-456',
          type: {
            id: 'Group',
            graph: {
              id: '654-789',
            },
            uri: '',
          },
        },
      },
    ],
  },
  referrers: {},
  identifier: {
    id: '123',
    type: {
      id: 'TerminologicalVocabulary',
      graph: {
        id: '789',
      },
      uri: '',
    },
  },
};

const dataLarge: VocabularyInfoDTO = {
  id: '123',
  code: 'terminological-vocabulary-0',
  uri: 'uri.fi/terminology/abc1234/terminological-vocabulary-0',
  number: 0,
  createdBy: 'Admin User',
  createdDate: '1970-01-01T00:00:00.000Z',
  lastModifiedBy: 'Admin User',
  lastModifiedDate: '1970-01-01T00:00:00.000Z',
  type: {
    id: 'TerminologicalVocabulary',
    graph: {
      id: '789',
    },
    uri: '',
  },
  properties: {
    contact: [
      {
        lang: '',
        value: 'yhteentoimivuus@dvv.fi',
        regex: '(?s)^.*$',
      },
    ],
    language: [
      {
        lang: '',
        value: 'fi',
        regex: '(?s)^.*$',
      },
      {
        lang: '',
        value: 'en',
        regex: '(?s)^.*$',
      },
      {
        lang: '',
        value: 'sv',
        regex: '(?s)^.*$',
      },
    ],
    prefLabel: [
      {
        lang: 'fi',
        value: 'testi2',
        regex: '(?s)^.*$',
      },
      {
        lang: 'en',
        value: 'test2',
        regex: '(?s)^.*$',
      },
      {
        lang: 'sv',
        value: 'test2',
        regex: '(?s)^.*$',
      },
    ],
    status: [
      {
        lang: '',
        value: 'VALID',
        regex: '(?s)^.*$',
      },
    ],
    terminologyType: [
      {
        lang: '',
        value: 'OTHER_VOCABULARY',
        regex: '^(OTHER_VOCABULARY|TERMINOLOGICAL_VOCABULARY)$',
      },
    ],
    description: [
      {
        lang: 'fi',
        value: 'kuvaus',
        regex: '(?s)^.*$',
      },
      {
        lang: 'en',
        value: 'description',
        regex: '(?s)^.*$',
      },
    ],
  },
  references: {
    contributor: [
      {
        id: '456-123',
        code: '',
        uri: '',
        number: 0,
        createdBy: '',
        createdDate: '1970-01-01T00:00:00.000Z',
        lastModifiedBy: '',
        lastModifiedDate: '1970-01-01T00:00:00.000Z',
        type: {
          id: 'Organization',
          graph: {
            id: '456-456',
          },
          uri: '',
        },
        properties: {
          prefLabel: [
            {
              lang: 'en',
              value: 'Interoperability platform developers',
              regex: '(?s)^.*$',
            },
            {
              lang: 'fi',
              value: 'Yhteentoimivuusalustan yllapito',
              regex: '(?s)^.*$',
            },
            {
              lang: 'sv',
              value: 'Utvecklare av interoperabilitetsplattform',
              regex: '(?s)^.*$',
            },
          ],
        },
        references: {},
        referrers: {},
        identifier: {
          id: '456-123',
          type: {
            id: 'Organization',
            graph: {
              id: '456-456',
            },
            uri: '',
          },
        },
      },
    ],
    inGroup: [
      {
        id: '654-456',
        code: 'v1001',
        uri: '',
        number: 0,
        createdBy: '',
        createdDate: '1970-01-01T00:00:00.000Z',
        lastModifiedBy: '',
        lastModifiedDate: '1970-01-01T00:00:00.000Z',
        type: {
          id: 'Group',
          graph: {
            id: '654-789',
          },
          uri: '',
        },
        properties: {
          notation: [
            {
              lang: '',
              value: 'P1',
              regex: '(?s)^.*$',
            },
          ],
          definition: [
            {
              lang: 'en',
              value: '',
              regex: '(?s)^.*$',
            },
            {
              lang: 'fi',
              value: '',
              regex: '(?s)^.*$',
            },
            {
              lang: 'sv',
              value: '',
              regex: '(?s)^.*$',
            },
          ],
          order: [
            {
              lang: '',
              value: '100',
              regex: '(?s)^.*$',
            },
          ],
          prefLabel: [
            {
              lang: 'en',
              value: 'Housing',
              regex: '(?s)^.*$',
            },
            {
              lang: 'sv',
              value: 'Boende',
              regex: '(?s)^.*$',
            },
            {
              lang: 'fi',
              value: 'Asuminen',
              regex: '(?s)^.*$',
            },
          ],
        },
        references: {},
        referrers: {},
        identifier: {
          id: '654-456',
          type: {
            id: 'Group',
            graph: {
              id: '654-789',
            },
            uri: '',
          },
        },
      },
      {
        id: '987-123',
        code: 'v1132',
        uri: '',
        number: 0,
        createdBy: '',
        createdDate: '1970-01-01T00:00:00.000Z',
        lastModifiedBy: '',
        lastModifiedDate: '1970-01-01T00:00:00.000Z',
        type: {
          id: 'Group',
          graph: {
            id: '987-456',
          },
          uri: '',
        },
        properties: {
          notation: [
            {
              lang: '',
              value: 'P15',
              regex: '(?s)^.*$',
            },
          ],
          definition: [
            {
              lang: 'fi',
              value: '',
              regex: '(?s)^.*$',
            },
            {
              lang: 'en',
              value: '',
              regex: '(?s)^.*$',
            },
            {
              lang: 'sv',
              value: '',
              regex: '(?s)^.*$',
            },
          ],
          order: [
            {
              lang: '',
              value: '1500',
              regex: '(?s)^.*$',
            },
          ],
          prefLabel: [
            {
              lang: 'en',
              value: 'Private finance and funding',
              regex: '(?s)^.*$',
            },
            {
              lang: 'sv',
              value: 'Privat ekonomi och finansiering',
              regex: '(?s)^.*$',
            },
            {
              lang: 'fi',
              value: 'Yksityinen talous ja rahoitus',
              regex: '(?s)^.*$',
            },
          ],
        },
        references: {},
        referrers: {},
        identifier: {
          id: '987-123',
          type: {
            id: 'Group',
            graph: {
              id: '987-456',
            },
            uri: '',
          },
        },
      },
    ],
  },
  referrers: {},
  identifier: {
    id: '123',
    type: {
      id: 'TerminologicalVocabulary',
      graph: {
        id: '789',
      },
      uri: '',
    },
  },
};
