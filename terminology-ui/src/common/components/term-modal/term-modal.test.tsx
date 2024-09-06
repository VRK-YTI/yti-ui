import { fireEvent, screen } from '@testing-library/react';
import TermModal from '.';
import { renderWithProviders } from '@app/tests/test-utils';
import { initialState } from '@app/common/components/login/login.slice';
import { Term } from '@app/common/interfaces/interfaces-v2';

describe('term-modal', () => {
  let appRoot: HTMLDivElement | null = null;

  beforeEach(() => {
    appRoot = document.createElement('div');
    appRoot.setAttribute('id', '__next');
    document.body.appendChild(appRoot);
  });

  it('should render everything in component', () => {
    renderWithProviders(<TermModal data={data} />, [], {
      preloadedState: { login: { ...initialState, anonymous: false } },
    });

    fireEvent.click(screen.getByText('pref label'));

    expect(screen.getByText('Preferred term')).toBeInTheDocument();
    expect(screen.getByText('tr-statuses.draft')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('term info')).toBeInTheDocument();
    expect(screen.getByText('scope')).toBeInTheDocument();
    expect(screen.getByText('term equivalency')).toBeInTheDocument();
    expect(screen.getByText('source 1')).toBeInTheDocument();

    fireEvent.click(
      screen.getByText('tr-term-modal-organizational-information')
    );

    expect(screen.getByText('change note')).toBeInTheDocument();
    expect(screen.getByText('history note')).toBeInTheDocument();
    expect(screen.getByText('editorial note')).toBeInTheDocument();

    fireEvent.click(screen.getByText('tr-term-modal-grammatic-information'));

    expect(screen.getByText('term style')).toBeInTheDocument();
    expect(screen.getByText('term family')).toBeInTheDocument();
    expect(screen.getByText('term conjugation')).toBeInTheDocument();
    expect(screen.getByText('word class')).toBeInTheDocument();
  });

  it('should render parts of component', () => {
    delete data.term.changeNote;
    delete data.term.historyNote;
    delete data.term.editorialNotes;
    delete data.term.wordClass;

    renderWithProviders(<TermModal data={data} />, [], {
      preloadedState: { login: { ...initialState, anonymous: false } },
    });

    fireEvent.click(screen.getByText('pref label'));

    expect(screen.getByText('Preferred term')).toBeInTheDocument();
    expect(screen.getByText('tr-statuses.draft')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('term info')).toBeInTheDocument();
    expect(screen.getByText('scope')).toBeInTheDocument();
    expect(screen.getByText('term equivalency')).toBeInTheDocument();
    expect(screen.getByText('source 1')).toBeInTheDocument();
    expect(screen.getByText('source 2')).toBeInTheDocument();

    expect(
      screen.queryByText('tr-term-modal-organizational-information')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('change note')).not.toBeInTheDocument();
    expect(screen.queryByText('history note')).not.toBeInTheDocument();
    expect(screen.queryByText('editorial note')).not.toBeInTheDocument();
    expect(screen.queryByText('draft comment')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('tr-term-modal-grammatic-information'));

    expect(screen.getByText('term style')).toBeInTheDocument();
    expect(screen.getByText('term family')).toBeInTheDocument();
    expect(screen.getByText('term conjugation')).toBeInTheDocument();
    expect(screen.queryByText('word class')).not.toBeInTheDocument();
  });
});

const data = {
  term: {
    language: 'fi',
    changeNote: 'change note',
    editorialNotes: ['editorial note'],
    historyNote: 'history note',
    label: 'pref label',
    scope: 'scope',
    sources: ['source 1', 'source 2'],
    status: 'DRAFT',
    termConjugation: 'term conjugation',
    termEquivalency: 'term equivalency',
    termFamily: 'term family',
    homographNumber: 1,
    termInfo: 'term info',
    termStyle: 'term style',
    wordClass: 'word class',
  } as Term,
  type: 'Preferred term',
};
