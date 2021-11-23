import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../../layouts/theme';
import VocabularyFilter from './vocabulary-filter';
import { Provider } from 'react-redux';
import { makeStore } from '../../../store';

describe('vocabulary-filter', () => {
  test('should render component', () => {
    const store = makeStore();

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <VocabularyFilter />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('tr-vocabulary-filter-filter-list')).toBeInTheDocument;

  });

  test('having showBy set to concept-group hides states', () => {
    const store = makeStore();

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <VocabularyFilter />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByDisplayValue('concept')).toBeChecked();
    expect(screen.getByDisplayValue('concept-group')).not.toBeChecked();

    userEvent.click(screen.getByDisplayValue('concept-group'));

    expect(screen.getByDisplayValue('concept-group')).toBeChecked();
    expect(screen.getByDisplayValue('concept')).not.toBeChecked();

    expect(screen.queryByText('tr-vocabulary-filter-show-concept-states')).toEqual(null);

  });

  test('adding filter shows remove-all-button', () => {
    const store = makeStore();

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <VocabularyFilter />
        </ThemeProvider>
      </Provider>
    );

    userEvent.click(screen.getByText(/tr-VALID/));

    expect(screen.getByText('tr-vocabulary-filter-remove-all')).toBeInTheDocument;

    const filter = store.getState().vocabularySearch.filter;

    expect(filter).toEqual({
      keyword: '',
      showBy: 'concept',
      status: {
        DRAFT: false,
        RETIRED: false,
        SUPERSEDED: false,
        VALID: true
      },
      tKeyword: ''
    });

  });

  test('adding keyword shows remove-all-button', () => {
    const store = makeStore();

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <VocabularyFilter />
        </ThemeProvider>
      </Provider>
    );

    userEvent.type(screen.getByPlaceholderText('tr-vocabulary-filter-visual-placeholder'), 'test keyword{enter}');

    expect(screen.getByDisplayValue('test keyword')).toBeInTheDocument;

    expect(screen.getByText('tr-vocabulary-filter-remove-all')).toBeInTheDocument;

  });

  test('resetting filter hides remove-all-button and set filter to initial value', () => {
    const store = makeStore();

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <VocabularyFilter />
        </ThemeProvider>
      </Provider>
    );

    userEvent.type(screen.getByPlaceholderText('tr-vocabulary-filter-visual-placeholder'), 'test keyword{enter}');
    userEvent.click(screen.getByText(/tr-VALID/));
    userEvent.click(screen.getByText(/tr-DRAFT/));

    let filter = store.getState().vocabularySearch.filter;

    expect(filter).toEqual({
      keyword: 'test keyword',
      showBy: 'concept',
      status: {
        DRAFT: true,
        RETIRED: false,
        SUPERSEDED: false,
        VALID: true
      },
      tKeyword: 'test keyword'
    });

    userEvent.click(screen.getByText(/tr-vocabulary-filter-remove-all/));

    filter = store.getState().vocabularySearch.filter;

    expect(filter).toEqual({
      keyword: '',
      showBy: 'concept',
      status: {
        DRAFT: false,
        RETIRED: false,
        SUPERSEDED: false,
        VALID: false
      },
      tKeyword: ''
    });

    expect(screen.queryByText('tr-vocabulary-filter-remove-all')).toEqual(null);

  });

});
