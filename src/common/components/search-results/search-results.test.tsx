import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../../layouts/theme';
import { makeStore } from '../../../store';
import { setVocabularyFilter } from '../vocabulary/vocabulary-slice';
import SearchResults from './search-results';

describe('search-results', () => {
  test('should render component', () => {
    const store = makeStore();

    const filter = {
      infoDomains: {},
      keyword: '',
      showByOrg: '',
      status: {
        'VALID': true,
        'DRAFT': true,
        'RETIRED': false,
        'SUPERSEDED': false
      }
    };

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <SearchResults
            data={[]}
            filter={filter}
            setSomeFilter={setVocabularyFilter}
          />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText(/tr-VALID/)).toBeInTheDocument;
    expect(screen.getByText(/tr-DRAFT/)).toBeInTheDocument;
  });

  test('should render data', () => {
    const store = makeStore();

    const filter = {
      infoDomains: {},
      keyword: '',
      showByOrg: '',
      status: {
        'VALID': true,
        'DRAFT': true,
        'RETIRED': false,
        'SUPERSEDED': false
      }
    };

    const data = {
      totalHitCount: 2,
      resultStart: 0,
      terminologies: [
        {
          code: 'code-01',
          contributors: [
            {
              id: 'contributor',
              label: {
                en: 'en-contributor',
                fi: 'fi-contributor',
                sv: 'sv-contributor'
              }
            }
          ],
          description: {
            en: 'en-description',
            fi: 'fi-description',
            sv: 'en-description'
          },
          id: '01',
          informationDomains: [
            {
              id: 'informationDomain-01',
              label: {
                en: 'en-label',
                fi: 'fi-label',
                sv: 'sv-label'
              }
            }
          ],
          label: {
            en: 'en-label-01',
            fi: 'fi-label-01',
            sv: 'sv-label-01'
          },
          status: 'VALID',
          uri: 'https://suomi.fi'
        },
        {
          code: 'code-02',
          contributors: [
            {
              id: 'contributor',
              label: {
                en: 'en-contributor',
                fi: 'fi-contributor',
                sv: 'sv-contributor'
              }
            }
          ],
          description: {
            en: 'en-description',
            fi: 'fi-description',
            sv: 'en-description'
          },
          id: '02',
          informationDomains: [
            {
              id: 'informationDomain-01',
              label: {
                en: 'en-label',
                fi: 'fi-label',
                sv: 'sv-label'
              }
            }
          ],
          label: {
            en: 'en-label-02',
            fi: 'fi-label-02',
            sv: 'sv-label-02'
          },
          status: 'VALID',
          uri: 'https://suomi.fi'
        }
      ]
    };

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <SearchResults
            data={data}
            filter={filter}
            setSomeFilter={setVocabularyFilter}
            type={'terminology-search'}
          />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText(/fi-label-01/)).toBeInTheDocument;
    expect(screen.getByText(/fi-label-02/)).toBeInTheDocument;
  });

});
