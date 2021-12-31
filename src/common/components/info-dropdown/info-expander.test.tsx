import React from 'react';
import { render, screen } from '@testing-library/react';
import InfoExpander from './info-expander';
import { VocabularyInfoDTO } from '../../interfaces/vocabulary.interface';
import { themeProvider } from '../../../tests/test-utils';

describe('InfoExpander', () => {
  test('should render export button', () => {
    render(
      <InfoExpander data={data}
      />,
      { wrapper: themeProvider }
    );

    expect(screen.queryAllByText('tr-vocabulary-info-vocabulary-export')).toHaveLength(2);
  });
});

const data: VocabularyInfoDTO = {
  id: '123123-123123',
  code: 'terminology-vocab-1',
  uri: 'sanastot.fi/terminology-vocab-1',
  number: 0,
  createdBy: 'Admin',
  createdDate: '2021-01-01T00:00:00.000+00:00',
  lastModifiedBy: 'Admin',
  lastModifiedDate: '2021-01-02T00:00:00.000+00:00',
  type: {
    id: 'TerminologicalVocabulary',
    graph: { id: '234234-234234' },
    uri: ''
  },
  properties: {
    prefLabel: [
      {
        lang: 'fi',
        value: 'Demo',
        regex: ''
      },
      {
        lang: 'en',
        value: 'Demo',
        regex: ''
      }
    ],
    language: [
      {
        lang: '',
        value: 'fi',
        regex: ''
      },
      {
        lang: '',
        value: 'en',
        regex: ''
      }
    ],
    status: [
      {
        lang: '',
        value: 'VALID',
        regex: ''
      }
    ],
    description: [
      {
        lang: 'fi',
        value: 'Demon kuvaus',
        regex: ''
      },
      {
        lang: 'en',
        value: 'Demo description',
        regex: ''
      }
    ],
  },
  references: {
    contributor: [
      {
        id: '456456-456456',
        code: '',
        uri: '',
        number: 0,
        createdBy: '',
        createdDate: '2021-01-01T00:00:00.000+00:00',
        lastModifiedBy: '',
        lastModifiedDate: '2021-01-01T00:00:00.000+00:00',
        type: {
          id: 'Organization',
          graph: { id: '789789-789789' },
          uri: ''
        },
        properties: {
          prefLabel: [
            {
              lang: 'fi',
              value: 'Ryhmä',
              regex: ''
            },
            {
              lang: 'en',
              value: 'group',
              regex: ''
            }
          ]
        },
        references: [],
        referrers: [],
        identifier: {
          id: '456456-456456',
          type: {
            id: 'Organization',
            graph: { id: '789789-789789' },
            uri: ''
          }
        }
      }
    ],
    inGroup: [
      {
        id: '321321-321321',
        code: 'v3213',
        uri: '',
        number: 0,
        createdBy: '',
        createdDate: '2021-01-01T00:00:00.000+00:00',
        lastModifiedBy: '',
        lastModifiedDate: '2021-01-01T00:00:00.000+00:00',
        type: {
          id: 'Group',
          graph: { id: '567567-567567' },
          uri: ''
        },
        properties: {},
        references: {},
        referrers: {},
        identifier: {
          id: '654654-654654',
          type: {
            id: 'Group',
            graph: { id: '567567-567567' },
            uri: ''
          }
        }
      }
    ],
  },
  referrers: {},
  identifier: {
    id: '987987-987987',
    type: {
      id: 'TerminologicalVocabulary',
      graph: { id: '54353-543543' },
      uri: ''
    }
  }
};
