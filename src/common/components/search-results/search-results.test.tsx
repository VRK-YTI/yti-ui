import { render, screen } from '@testing-library/react';
import { NextRouter, useRouter } from 'next/router';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../../layouts/theme';
import { makeStore } from '../../../store';
import SearchResults from './search-results';

jest.mock('next/router');
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('search-results', () => {
  test('should render component', () => {
    mockedUseRouter.mockReturnValue({ query: {} } as NextRouter);

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

    expect(screen.findAllByRole('div')).toBeInTheDocument;
    expect(screen.queryAllByRole('div')).toEqual([]);
  });

  test('should render data', () => {
    mockedUseRouter.mockReturnValue({ query: {} } as NextRouter);

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

    expect(screen.getByText(/fi-label-01/)).toBeInTheDocument;
    expect(screen.getByText(/fi-label-02/)).toBeInTheDocument;
  });
});
