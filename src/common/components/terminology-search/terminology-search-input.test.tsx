import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TerminologySearchInput } from './terminology-search-input';
import { Provider } from 'react-redux';
import { makeStore } from '../../../store';

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

    render(
      <Provider store={makeStore()}>
        <TerminologySearchInput />
      </Provider>
    );

    expect(screen.getByTestId('search_input')).toBeInTheDocument;

    userEvent.click(screen.getByTestId('search_input'));
    userEvent.keyboard('test');
    userEvent.keyboard('{enter}');

    expect(screen.getByTestId('search_input')).toHaveProperty('value', 'test');

  });

});


