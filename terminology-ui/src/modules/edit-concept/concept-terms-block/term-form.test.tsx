import { renderWithProviders } from '@app/tests/test-utils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { v4 } from 'uuid';
import { EmptyFormError } from '../validate-form';
import TermForm from './term-form';

describe('term-form', () => {
  it('should render component', () => {
    const mockFn = jest.fn();

    renderWithProviders(
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
          source: [],
          status: 'DRAFT',
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
        errors={EmptyFormError}
        currentTerms={[]}
        handleSwitchTerms={mockFn}
      />
    );

    expect(screen.getByText('tr-term-name-label')).toBeInTheDocument();
  });

  it('should render all statuses', async () => {
    const mockFn = jest.fn();

    renderWithProviders(
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
          source: [],
          status: 'DRAFT',
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
        errors={EmptyFormError}
        currentTerms={[]}
        handleSwitchTerms={mockFn}
      />
    );

    expect(screen.getByText(/tr-statuses\.draft/)).toBeInTheDocument();

    fireEvent.click(screen.getAllByText(/tr-statuses\.draft/)[0]);

    await waitFor(() => {
      expect(screen.getByText('tr-statuses.incomplete')).toBeInTheDocument();
    });

    expect(screen.getByText('tr-statuses.valid')).toBeInTheDocument();
    expect(screen.getByText('tr-statuses.superseded')).toBeInTheDocument();
    expect(screen.getByText('tr-statuses.retired')).toBeInTheDocument();
    expect(screen.getByText('tr-statuses.invalid')).toBeInTheDocument();
    expect(screen.getByText('tr-statuses.suggested')).toBeInTheDocument();
  });
});
