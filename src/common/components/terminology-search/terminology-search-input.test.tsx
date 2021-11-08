import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TerminologySearchInput } from './terminology-search-input';
import { Provider } from 'react-redux';
import { makeStore } from '../../../store';
import { setFilter } from './states/terminology-search-slice';

describe('terminology-search-input', () => {
  test('should render component', () => {

    render(
      <Provider store={makeStore()}>
        <TerminologySearchInput />
      </Provider>
    );

    expect(screen.findByTestId('search_input')).toBeInTheDocument;

  });

  test('should set filter', () => {
    const store = makeStore();
    render(
      <Provider store={store}>
        <TerminologySearchInput />
      </Provider>
    );

    expect(screen.getByTestId('search_input')).toBeInTheDocument;

    userEvent.click(screen.getByTestId('search_input'));
    userEvent.keyboard('test');
    userEvent.keyboard('{enter}');

    expect(screen.getByTestId('search_input')).toHaveProperty('value', 'test');
    expect(store.getState().terminologySearch).toStrictEqual({'filter': 'test'});

  });

  test('when filter is defined it has correct value', () => {
    const store = makeStore();
    store.dispatch(setFilter('existingFilter'));

    render(
      <Provider store={store}>
        <TerminologySearchInput />
      </Provider>
    );

    expect(screen.getByTestId('search_input')).toBeInTheDocument;
    expect(screen.getByTestId('search_input')).toHaveProperty('value', 'existingFilter');

  });

});


