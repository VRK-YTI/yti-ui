import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../theme';
import SearchResults, { SearchResultData } from './search-results';
import mockRouter from 'next-router-mock';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('search-results', () => {
  it('should render component', async () => {
    mockRouter.setCurrentUrl('/');

    const data: SearchResultData[] = [
      {
        id: '1',
        contributors: ['contibutor-1'],
        description: 'description',
        icon: 'alert',
        status: 'VALID',
        partOf: ['information-domain'],
        title: 'title',
        titleLink: 'https://suomi.fi/title',
        type: 'type',
      },
    ];

    render(
      <ThemeProvider theme={lightTheme}>
        <SearchResults
          data={data}
          noDescriptionText={'no-description-text'}
          partOfText={'part-of-text'}
          tagsHiddenTitle={'tags-hidden-title'}
          tagsTitle={'tags-title'}
        />
      </ThemeProvider>
    );

    expect(screen.queryAllByRole('div')).toStrictEqual([]);
  });

  it('should render data', () => {
    mockRouter.setCurrentUrl('/');

    const data: SearchResultData[] = [
      {
        id: '1',
        contributors: ['contributor-1'],
        description: 'description-1',
        icon: 'alert',
        status: 'VALID',
        partOf: ['information-domain-1'],
        title: 'title-1',
        titleLink: 'https://suomi.fi/title-2',
        type: 'type1',
      },
      {
        id: '2',
        contributors: ['contributor-2', 'contributor-3'],
        description: 'description-2',
        icon: 'alert',
        status: 'DRAFT',
        partOf: ['information-domain-1', 'information-domain-2'],
        title: 'title-2',
        titleLink: 'https://suomi.fi/title-2',
        type: 'type2',
      },
    ];

    render(
      <ThemeProvider theme={lightTheme}>
        <SearchResults
          data={data}
          noDescriptionText={'no-description-text'}
          partOfText={'part-of-text'}
          tagsHiddenTitle={'tags-hidden-title'}
          tagsTitle={'tags-title'}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('tags-title')).toBeInTheDocument();

    expect(screen.getByText('title-1')).toBeInTheDocument();
    expect(screen.getByText('title-2')).toBeInTheDocument();

    // Should find in both visible and hidden
    expect(screen.queryAllByText('contributor-1')).toHaveLength(2);
    expect(screen.getByText('2 tr-card-organizations')).toBeInTheDocument();
    expect(
      screen.getByText('contributor-2, contributor-3')
    ).toBeInTheDocument();
  });
});
