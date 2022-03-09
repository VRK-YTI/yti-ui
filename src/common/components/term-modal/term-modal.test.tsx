import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import TermModal from '.';
import { makeStore } from '../../../store';
import { themeProvider } from '../../../tests/test-utils';
import { Term } from '../../interfaces/term.interface';
import { initialState, setLogin } from '../login/login-slice';

let appRoot: HTMLDivElement | null = null;

function setUpAppRoot() {
  appRoot = document.createElement('div');
  appRoot.setAttribute('id', '__next');
  document.body.appendChild(appRoot);
}

describe('term-modal', () => {
  it('should render everything in component', () => {
    setUpAppRoot();
    const store = makeStore();
    store.dispatch(setLogin({ ...initialState, anonymous: false }));

    render(
      <Provider store={store}>
        <TermModal data={data} />
      </Provider>,
      { wrapper: themeProvider }
    );

    userEvent.click(screen.getByText('pref label'));

    expect(screen.getByText('Preferred term')).toBeInTheDocument();
    expect(screen.getByText('tr-DRAFT')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('term info')).toBeInTheDocument();
    expect(screen.getByText('scope')).toBeInTheDocument();
    expect(screen.getByText('term equivalency')).toBeInTheDocument();
    expect(screen.getByText('source')).toBeInTheDocument();

    userEvent.click(
      screen.getByText('tr-term-modal-organizational-information')
    );

    expect(screen.getByText('change note')).toBeInTheDocument();
    expect(screen.getByText('history note')).toBeInTheDocument();
    expect(screen.getByText('editorial note')).toBeInTheDocument();
    expect(screen.getByText('draft comment')).toBeInTheDocument();

    userEvent.click(screen.getByText('tr-term-modal-grammatic-information'));

    expect(screen.getByText('term style')).toBeInTheDocument();
    expect(screen.getByText('term family')).toBeInTheDocument();
    expect(screen.getByText('term conjugation')).toBeInTheDocument();
    expect(screen.getByText('word class')).toBeInTheDocument();
  });

  it('should render parts of component', () => {
    setUpAppRoot();
    const store = makeStore();

    delete data.term.properties.changeNote;
    delete data.term.properties.historyNote;
    delete data.term.properties.editorialNote;
    delete data.term.properties.draftComment;
    delete data.term.properties.wordClass;

    render(
      <Provider store={store}>
        <TermModal data={data} />
      </Provider>,
      { wrapper: themeProvider }
    );

    userEvent.click(screen.getByText('pref label'));

    expect(screen.getByText('Preferred term')).toBeInTheDocument();
    expect(screen.getByText('tr-DRAFT')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('term info')).toBeInTheDocument();
    expect(screen.getByText('scope')).toBeInTheDocument();
    expect(screen.getByText('term equivalency')).toBeInTheDocument();
    expect(screen.getByText('source')).toBeInTheDocument();

    expect(
      screen.queryByText('tr-term-modal-organizational-information')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('change note')).not.toBeInTheDocument();
    expect(screen.queryByText('history note')).not.toBeInTheDocument();
    expect(screen.queryByText('editorial note')).not.toBeInTheDocument();
    expect(screen.queryByText('draft comment')).not.toBeInTheDocument();

    userEvent.click(screen.getByText('tr-term-modal-grammatic-information'));

    expect(screen.getByText('term style')).toBeInTheDocument();
    expect(screen.getByText('term family')).toBeInTheDocument();
    expect(screen.getByText('term conjugation')).toBeInTheDocument();
    expect(screen.queryByText('word class')).not.toBeInTheDocument();
  });
});

const data = {
  term: {
    properties: {
      changeNote: [
        {
          lang: 'fi',
          value: 'change note',
          regex: '',
        },
      ],
      draftComment: [
        {
          lang: 'fi',
          value: 'draft comment',
          regex: '',
        },
      ],
      editorialNote: [
        {
          lang: 'fi',
          value: 'editorial note',
          regex: '',
        },
      ],
      historyNote: [
        {
          lang: 'fi',
          value: 'history note',
          regex: '',
        },
      ],
      prefLabel: [
        {
          lang: 'fi',
          value: 'pref label',
          regex: '',
        },
      ],
      scope: [
        {
          lang: 'fi',
          value: 'scope',
          regex: '',
        },
      ],
      source: [
        {
          lang: 'fi',
          value: 'source',
          regex: '',
        },
      ],
      status: [
        {
          lang: '',
          value: 'DRAFT',
          regex: '',
        },
      ],
      termConjugation: [
        {
          lang: 'fi',
          value: 'term conjugation',
          regex: '',
        },
      ],
      termEquivalency: [
        {
          lang: 'fi',
          value: 'term equivalency',
          regex: '',
        },
      ],
      termFamily: [
        {
          lang: 'fi',
          value: 'term family',
          regex: '',
        },
      ],
      termHomographNumber: [
        {
          lang: 'fi',
          value: '1',
          regex: '',
        },
      ],
      termInfo: [
        {
          lang: 'fi',
          value: 'term info',
          regex: '',
        },
      ],
      termStyle: [
        {
          lang: 'fi',
          value: 'term style',
          regex: '',
        },
      ],
      wordClass: [
        {
          lang: 'fi',
          value: 'word class',
          regex: '',
        },
      ],
    },
  } as Term,
  type: 'Preferred term',
};
