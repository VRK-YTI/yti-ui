import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../../layouts/theme';
import VocabularyTitle from './vocabulary-title';
import { VocabularyInfoDTO } from '../../interfaces/vocabulary.interface';

describe('vocabulary-title', () => {
  test('should render component', () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <VocabularyTitle data={data} />
      </ThemeProvider>
    );

    expect(screen.getByText('TR-DRAFT')).toBeInTheDocument;
    expect(screen.queryByText('ei sivulla')).toEqual(null);

  });

  test('should render status, contributor and status', () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <VocabularyTitle data={data} />
      </ThemeProvider>
    );

    expect(screen.getByText('uusi sanasto')).toBeInTheDocument;
    expect(screen.getByText('Yhteentoimivuusalustan yllapito')).toBeInTheDocument;
    expect(screen.getByText('TR-DRAFT')).toBeInTheDocument;

  });

  test('should render with missing values provided', () => {
    let incorrectData = data;
    incorrectData.properties.status[0].value = '';
    incorrectData.properties.prefLabel = [];
    incorrectData.references.contributor[0].properties.prefLabel = [];

    render(
      <ThemeProvider theme={lightTheme}>
        <VocabularyTitle data={incorrectData} />
      </ThemeProvider>
    );

    expect(screen.queryByText('TR-DRAFT')).toEqual(null);
    expect(screen.queryByText('uusi sanasto')).toEqual(null);
    expect(screen.queryByText('Yhteentoimivuusalustan yllapito')).toEqual(null);

  });

});



const data: VocabularyInfoDTO = {
  id: '123123-123123-123',
  code: 'terminological-vocabulary-0',
  uri: 'http://suomi.fi/terminology/sanasto/terminological-vocabulary-0',
  number: 0,
  createdBy: 'User',
  createdDate: '1970-01-01T00:00:00.000+00:00',
  lastModifiedBy: 'User',
  lastModifiedDate: '1970-01-01T00:00:00.000+00:00',
  type: {
    id: 'TerminologicalVocabulary',
    graph: {
      id: '123123-123123-123'
    },
    uri: ''
  },
  properties: {
    priority: [
      {
        lang: '',
        value: 'uusi sanasto',
        regex: '(?s)^.*$'
      }
    ],
    status: [
      {
        lang: '',
        value: 'DRAFT',
        regex: '(?s)^.*$'
      }
    ],
    prefLabel: [
      {
        lang: 'fi',
        value: 'uusi sanasto',
        regex: '(?s)^.*$'
      },
      {
        lang: 'en',
        value: '(en) uusi sanasto',
        regex: '(?s)^.*$'
      },
      {
        lang: 'sv',
        value: '(sv) uusi sanasto',
        regex: '(?s)^.*$'
      }
    ],
    language: [
      {
        lang: '',
        value: 'fi',
        regex: '(?s)^.*$'
      },
      {
        lang: '',
        value: 'en',
        regex: '(?s)^.*$'
      },
      {
        lang: '',
        value: 'sv',
        regex: '(?s)^.*$'
      }
    ],
    description: [
      {
        lang: 'fi',
        value: 'sanaston kuvaus',
        regex: '(?s)^.*$'
      }
    ]
  },
  references: {
    contributor: [
      {
        id: '321321-321321-321',
        code: '',
        uri: '',
        number: 0,
        createdBy: '',
        createdDate: '1970-01-01T00:00:00.000+00:00',
        lastModifiedBy: '',
        lastModifiedDate: '1970-01-01T00:00:00.000+00:00',
        type: {
          id: 'Organization',
          graph: {
            id: '456456-456456-456'
          },
          uri: ''
        },
        properties: {
          prefLabel: [
            {
              lang: 'en',
              value: '(en) Yhteentoimivuusalustan yllapito',
              regex: '(?s)^.*$'
            },
            {
              lang: 'fi',
              value: 'Yhteentoimivuusalustan yllapito',
              regex: '(?s)^.*$'
            },
            {
              lang: 'sv',
              value: '(sv) Yhteentoimivuusalustan yllapito',
              regex: '(?s)^.*$'
            }
          ]
        },
        references: {},
        referrers: {},
        identifier: {
          id: '456456-456456-456',
          type: {
            id: 'Organization',
            graph: {
              id: '654654-654654-654'
            },
            uri: ''
          }
        }
      }
    ],
    inGroup: [
      {
        id: '789789-789789-789',
        code: '123-4',
        uri: 'http://suomi.fi/123_4',
        number: 0,
        createdBy: '',
        createdDate: '1970-01-01T00:00:00.000+00:00',
        lastModifiedBy: '',
        lastModifiedDate: '1970-01-01T00:00:00.000+00:00',
        type: {
          id: 'Group',
          graph: {
            id: '789789-789789-789'
          },
          uri: ''
        },
        properties: {
          notation: [
            {
              lang: '',
              value: 'P1',
              regex: '(?s)^.*$'
            }
          ],
          definition: [
            {
              lang: 'en',
              value: 'This service class includes seeking, finding and purchasing a residence, different housing forms, housing benefits, processes and services related to migration within Finland, as well as services associated with the Population Information System.',
              regex: '(?s)^.*$'
            },
            {
              lang: 'fi',
              value: 'Tähän palveluluokkaan kuuluvat asunnon etsiminen, löytäminen ja hankkiminen, erilaiset asumismuodot, asumisen taloudelliset tuet, Suomen sisällä tapahtuvaan muuttoon liittyvät prosessit ja palvelut sekä väestötietojärjestelmään liittyvät palvelut.',
              regex: '(?s)^.*$'
            },
            {
              lang: 'sv',
              value: 'Denna servicegrupp omfattar hur man söker, hittar och skaffar en bostad, olika boendeformer, ekonomiskt stöd för boende, processer och tjänster i anslutning till flyttning inom Finland samt tjänster som berör befolkningsdatasystemet.',
              regex: '(?s)^.*$'
            }
          ],
          order: [
            {
              lang: '',
              value: '100',
              regex: '(?s)^.*$'
            }
          ],
          prefLabel: [
            {
              lang: 'en',
              value: 'Housing',
              regex: '(?s)^.*$'
            },
            {
              lang: 'sv',
              value: 'Boende',
              regex: '(?s)^.*$'
            },
            {
              lang: 'fi',
              value: 'Asuminen',
              regex: '(?s)^.*$'
            }
          ]
        },
        references: {},
        referrers: {},
        identifier: {
          id: '987987-987987-987',
          type: {
            id: 'Group',
            graph: {
              id: '987987-987987-987'
            },
            uri: ''
          }
        }
      }
    ]
  },
  referrers: {},
  identifier: {
    id: '135135-135135-135',
    type: {
      id: 'TerminologicalVocabulary',
      graph: {
        id: '246246-246246-246'
      },
      uri: ''
    }
  }
};
