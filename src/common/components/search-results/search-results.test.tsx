import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '@app/layouts/theme';
import { makeStore } from '@app/store';
import SearchResults from './search-results';
import mockRouter from 'next-router-mock';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('search-results', () => {
  it('should render component', async () => {
    mockRouter.setCurrentUrl('/');

    const store = makeStore();

    const data = {
      totalHitCount: 0,
      resultStart: 0,
      terminologies: null,
      deepHits: null,
    };

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <SearchResults data={data} />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.queryAllByRole('div')).toStrictEqual([]);
  });

  it('should render data', () => {
    mockRouter.setCurrentUrl('/');

    const store = makeStore();

    const data = {
      totalHitCount: 2,
      resultStart: 0,
      deepHits: null,
      terminologies: [
        {
          code: 'code-01',
          contributors: [
            {
              id: 'contributor',
              label: {
                en: 'en-contributor',
                fi: 'fi-contributor',
                sv: 'sv-contributor',
              },
            },
          ],
          description: {
            en: 'en-description',
            fi: 'fi-description',
            sv: 'en-description',
          },
          id: '01',
          informationDomains: [
            {
              id: 'informationDomain-01',
              label: {
                en: 'en-label',
                fi: 'fi-label',
                sv: 'sv-label',
              },
            },
          ],
          label: {
            en: 'en-label-01',
            fi: 'fi-label-01',
            sv: 'sv-label-01',
          },
          status: 'VALID',
          uri: 'https://suomi.fi',
        },
        {
          code: 'code-02',
          contributors: [
            {
              id: 'contributor',
              label: {
                en: 'en-contributor',
                fi: 'fi-contributor',
                sv: 'sv-contributor',
              },
            },
          ],
          description: {
            en: 'en-description',
            fi: 'fi-description',
            sv: 'en-description',
          },
          id: '02',
          informationDomains: [
            {
              id: 'informationDomain-01',
              label: {
                en: 'en-label',
                fi: 'fi-label',
                sv: 'sv-label',
              },
            },
          ],
          label: {
            en: 'en-label-02',
            fi: 'fi-label-02',
            sv: 'sv-label-02',
          },
          status: 'VALID',
          uri: 'https://suomi.fi',
        },
      ],
    };

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <SearchResults data={data} type={'terminology-search'} />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText(/fi-label-01/)).toBeInTheDocument();
    expect(screen.getByText(/fi-label-02/)).toBeInTheDocument();
  });
});
