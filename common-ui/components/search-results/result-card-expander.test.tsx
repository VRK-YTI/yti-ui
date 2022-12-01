import { themeProvider } from '../../utils/test-utils';
import { render, screen } from '@testing-library/react';
import ResultCardExpander from './result-card-expander';

describe('result-card-expander', () => {
  it('should render component', () => {
    render(
      <ResultCardExpander
        buttonLabel="button-label"
        contentLabel="content-label"
        deepHits={[
          {
            label: 'hit-label-1',
            id: '01',
          },
          {
            label: 'hit-label-2',
            id: '02',
          },
        ]}
      />,
      { wrapper: themeProvider }
    );

    expect(screen.getByText(/button-label/)).toBeInTheDocument();
    expect(screen.getByText(/content-label/)).toBeInTheDocument();
    expect(screen.getAllByText(/hit-label/)).toHaveLength(4);
    expect(screen.queryAllByText('hit-label-1')).toHaveLength(2);
    expect(screen.queryAllByText('hit-label-2')).toHaveLength(2);
  });

  it('should render commas correctly', () => {
    render(
      <ResultCardExpander
        buttonLabel="button-label"
        contentLabel="content-label"
        deepHits={[
          {
            label: 'hit-label-1',
            id: '01',
          },
          {
            label: 'hit-label-2',
            id: '02',
          },
          {
            label: 'hit-label-3',
            id: '03',
          },
        ]}
      />,
      { wrapper: themeProvider }
    );

    expect(
      screen.getByText((_, node) => {
        const includesText = (node: Element | null) =>
          node?.textContent === 'hit-label-1, hit-label-2, hit-label-3';
        return includesText(node);
      })
    ).toBeValid();
  });

  it('should render commas "+ more" information correctly', () => {
    render(
      <ResultCardExpander
        buttonLabel="button-label"
        contentLabel="content-label"
        deepHits={[
          {
            label: 'hit-label-1',
            id: '01',
          },
          {
            label: 'hit-label-2',
            id: '02',
          },
          {
            label: 'hit-label-3',
            id: '03',
          },
          {
            label: 'hit-label-4',
            id: '04',
          },
          {
            label: 'hit-label-5',
            id: '05',
          },
          {
            label: 'hit-label-6',
            id: '06',
          },
        ]}
      />,
      { wrapper: themeProvider }
    );

    expect(
      screen.getByText((_, node) => {
        const includesText = (node: Element | null) =>
          node?.textContent ===
          'hit-label-1, hit-label-2, hit-label-3 + 3 tr-vocabulary-results-more';
        return includesText(node);
      })
    ).toBeValid();

    expect(screen.getByText(/hit-label-4/)).toBeInTheDocument();
    expect(screen.getByText(/hit-label-5/)).toBeInTheDocument();
    expect(screen.getByText(/hit-label-6/)).toBeInTheDocument();
  });
});
