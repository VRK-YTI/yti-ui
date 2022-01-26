import { ThemeProvider } from 'styled-components';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { lightTheme } from '../../../layouts/theme';
import { makeStore } from '../../../store';
import { setVocabularyFilter } from '../vocabulary/vocabulary-slice';
import DropdownArea from './dropdown-area';

describe('dropdown-area', () => {
  test('renders component', () => {
    const store = makeStore();

    const filter = {
      infoDomains: [],
      keyword: '',
      showByOrg: {
        id: '',
        value: ''
      },
      status: {
        'VALID': true,
        'DRAFT': true,
        'RETIRED': false,
        'SUPERSEDED': false
      }
    };

    const data = [
      {
        code: '',
        id: '123',
        properties: {
          prefLabel: [
            {
              lang: 'en',
              regex: '(?s)^.*$',
              value: 'Organization1'
            },
            {
              lang: 'fi',
              regex: '(?s)^.*$',
              value: 'Organisaatio1'
            }
          ]
        },
        type: {
          graph: {
            id: '321'
          },
          id: 'Organization'
        },
        uri: ''
      },
      {
        code: '',
        id: '456',
        properties: {
          prefLabel: [
            {
              lang: 'en',
              regex: '(?s)^.*$',
              value: 'Organization2'
            },
            {
              lang: 'fi',
              regex: '(?s)^.*$',
              value: 'Organisaatio2'
            }
          ]
        },
        type: {
          graph: {
            id: '654'
          },
          id: 'Organization'
        },
        uri: ''
      },
      {
        code: '',
        id: '789',
        properties: {
          prefLabel: [
            {
              lang: 'en',
              regex: '(?s)^.*$',
              value: 'Organization3'
            },
            {
              lang: 'fi',
              regex: '(?s)^.*$',
              value: 'Organisaatio3'
            }
          ]
        },
        type: {
          graph: {
            id: '987'
          },
          id: 'Organization'
        },
        uri: ''
      }
    ];

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <DropdownArea
            data={data}
            filter={filter}
            setFilter={setVocabularyFilter}
            title='Title'
          />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('Organisaatio1')).toBeInTheDocument;
    expect(screen.getByText('Organisaatio2')).toBeInTheDocument;
    expect(screen.getByText('Organisaatio3')).toBeInTheDocument;
  });
});
