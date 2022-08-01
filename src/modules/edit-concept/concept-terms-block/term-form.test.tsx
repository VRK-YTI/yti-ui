import { themeProvider } from '@app/tests/test-utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { v4 } from 'uuid';
import TermForm from './term-form';

describe('term-form', () => {
  it('should render component', () => {
    const mockFn = jest.fn();

    render(
      <TermForm
        update={mockFn}
        term={{
          changeNote: '',
          draftComment: '',
          editorialNote: [],
          historyNote: '',
          id: v4(),
          language: 'fi',
          prefLabel: 'prefLabel',
          scope: '',
          source: '',
          status: 'draft',
          termConjugation: '',
          termEquivalency: '',
          termEquivalencyRelation: '',
          termFamily: '',
          termHomographNumber: '',
          termInfo: '',
          termStyle: '',
          termType: 'recommended-term',
          wordClass: '',
        }}
      />,
      { wrapper: themeProvider }
    );

    expect(screen.getByText('tr-term-name-label')).toBeInTheDocument();
  });

  it('should render all statuses', () => {
    const mockFn = jest.fn();

    render(
      <TermForm
        update={mockFn}
        term={{
          changeNote: '',
          draftComment: '',
          editorialNote: [],
          historyNote: '',
          id: v4(),
          language: 'fi',
          prefLabel: 'prefLabel',
          scope: '',
          source: '',
          status: 'draft',
          termConjugation: '',
          termEquivalency: '',
          termEquivalencyRelation: '',
          termFamily: '',
          termHomographNumber: '',
          termInfo: '',
          termStyle: '',
          termType: 'recommended-term',
          wordClass: '',
        }}
      />,
      { wrapper: themeProvider }
    );

    // Expect two tr-DRAFT because the default value in dropdown is draft.
    expect(screen.getAllByText(/tr-DRAFT/)).toHaveLength(2);

    userEvent.click(screen.getAllByText(/tr-DRAFT/)[0]);

    expect(screen.getByText('tr-INCOMPLETE')).toBeInTheDocument();
    expect(screen.getByText('tr-VALID')).toBeInTheDocument();
    expect(screen.getByText('tr-SUPERSEDED')).toBeInTheDocument();
    expect(screen.getByText('tr-RETIRED')).toBeInTheDocument();
    expect(screen.getByText('tr-INVALID')).toBeInTheDocument();
    expect(screen.getByText('tr-SUGGESTED')).toBeInTheDocument();
  });
});
