import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../../layouts/theme';
import VocabularyResults from './vocabulary-results';
import { VocabularyConceptsDTO } from '../../interfaces/vocabulary.interface';
import { Provider } from 'react-redux';
import { makeStore } from '../../../store';

// TODO: Replace Provider and ThemeProvider in render() with wrapper from test-utils after it has been merged to v2

describe('vocabulary-results', () => {
  test('should render component', () => {
    const store = makeStore();

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <VocabularyResults concepts={concepts} />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getAllByText('TR-DRAFT')).toHaveLength(2);

  });

  test('should render concepts', () => {
    const store = makeStore();

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <VocabularyResults concepts={concepts} />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('uusi käsite')).toBeInTheDocument;
    expect(screen.getByText('vanhan käsitteen määritelmä')).toBeInTheDocument;
    expect(screen.getByText('vanha käsite')).toBeInTheDocument;
    expect(screen.getByText('vanhan käsitteen määritelmä')).toBeInTheDocument;

  });

});


const concepts: VocabularyConceptsDTO[] = [
  {
    id: '123123-123123-123',
    uri: 'http://suomi.fi/terminology/sanasto/concept-0',
    status: 'DRAFT',
    label: {
      fi: 'uusi käsite'
    },
    definition: {
      fi: 'uuden käsitteen määritelmä'
    },
    modified: '1970-01-01T00:00:00Z',
    terminology: {
      id: '321321-321321-321',
      uri: 'http://suomi.fi/terminology/sanasto/terminological-vocabulary-0',
      status: 'DRAFT',
      label: {
        sv: '(sv) uusi sanasto',
        fi: 'uusi sanasto',
        en: '(en) uusi sanasto'
      }
    }
  },
  {
    id: '456456-456456-456',
    uri: 'http://suomi.fi/terminology/sanasto/concept-1',
    status: 'DRAFT',
    label: {
      fi: 'vanha käsite'
    },
    definition: {
      fi: 'vanhan käsitteen määritelmä'
    },
    modified: '1970-01-01T00:00:00Z',
    terminology: {
      id: '456456-456456-456',
      uri: 'http://suomi.fi/terminology/sanasto/terminological-vocabulary-0',
      status: 'DRAFT',
      label: {
        sv: '(sv) uusi sanasto',
        fi: 'uusi sanasto',
        en: '(en) uusi sanasto'
      }
    }
  }
];
