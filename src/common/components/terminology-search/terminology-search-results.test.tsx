import React from 'react';
import { render, screen } from '@testing-library/react';
import { TerminologySearchResults } from './terminology-search-results';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../../layouts/theme';

describe('terminology-search-input', () => {
  test('should render component', () => {

    render(
      <ThemeProvider theme={lightTheme}>
        <TerminologySearchResults results={results} />
      </ThemeProvider>
    );

    expect(screen.getByText('Demo')).toBeInTheDocument;
    expect(screen.getByText('Demon kuvaus')).toBeInTheDocument;
    expect(screen.queryByText('Not found')).toEqual(null);

  });

  // make sure the check for missing description is working properly
  test('should render component with no description', () => {
    const modResults = {
      ...results,
      terminologies: results.terminologies.map(({ description, ...rest }) => rest)
    };

    render(
      <ThemeProvider theme={lightTheme}>
        <TerminologySearchResults results={modResults} />
      </ThemeProvider>
    );

    expect(screen.getByText('Demo')).toBeInTheDocument;
    expect(() => screen.getByText('Demon kuvaus')).toThrow('Unable to find an element');
    expect(screen.queryByText('Not found')).toEqual(null);
  });

});


const results = {
  'totalHitCount': 1,
  'resultStart': 0,
  'terminologies': [
    {
      'id': '123123123',
      'code': 'terminological-vocabulary-0',
      'uri': 'http://uri.suomi.fi/terminology/test/terminological-vocabulary-0',
      'status': 'VALID',
      'label': {
        'fi': 'Demo',
        'sv': 'Demo',
        'en': 'Demo'
      },
      'description': {
        'fi': 'Demon kuvaus',
        'sv': 'Demon kuvaus',
        'en': 'Demo description'
      },
      'informationDomains': [
        {
          'id': '456456456',
          'label': {
            'fi': 'Kulttuuri',
            'sv': 'Kultur',
            'en': 'Culture'
          }
        },
        {
          'id': '789789789',
          'label': {
            'sv': 'Privat ekonomi och finansiering',
            'fi': 'Yksityinen talous ja rahoitus',
            'en': 'Private finance and funding'
          }
        }
      ],
      'contributors': [
        {
          'id': '321321321',
          'label': {
            'fi': 'Yhteentoimivuusalustan yllapito',
            'sv': 'Utvecklare av interoperabilitetsplattform',
            'en': 'Interoperability platform developers'
          }
        }
      ]
    }
  ],
  'deepHits': {
    '123123123': [
      {
        'type': 'CONCEPT',
        'totalHitCount': 1,
        'topHits': [
          {
            'id': '654654654',
            'uri': 'http://uri.suomi.fi/terminology/test/concept-0',
            'status': 'DRAFT',
            'label': {
              'fi': 'demo'
            }
          }
        ]
      }
    ]
  }
};
