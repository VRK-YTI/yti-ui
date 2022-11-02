import { themeProvider } from '@app/tests/test-utils';
import { render, screen } from '@testing-library/react';
import ResultCard from './result-card';

describe('result-card-expander', () => {
  it('should render component', () => {
    const contributors = [
      {
        id: 'testid',
        label: {
          fi: 'contributor 1',
        },
      },
    ];

    render(
      <ResultCard
        description="test description"
        title="title"
        titleLink=""
        type="type"
        contributors={contributors}
      />,
      {
        wrapper: themeProvider,
      }
    );

    expect(screen.getByText('test description')).toBeInTheDocument();
    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByText('type')).toBeInTheDocument();
    expect(screen.getAllByText('contributor 1')[0]).toBeInTheDocument();
  });

  it('should render multiple contributors as amount', () => {
    const contributors = [
      {
        id: 'testid',
        label: {
          fi: 'contributor 1',
        },
      },
      {
        id: 'testid2',
        label: {
          fi: 'contributor 2',
        },
      },
    ];

    render(
      <ResultCard
        description="test description"
        title="title"
        titleLink=""
        type="type"
        contributors={contributors}
      />,
      {
        wrapper: themeProvider,
      }
    );

    expect(screen.getByText('test description')).toBeInTheDocument();
    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByText('type')).toBeInTheDocument();
    expect(screen.getByText('2 tr-card-organizations')).toBeInTheDocument();
  });
});
