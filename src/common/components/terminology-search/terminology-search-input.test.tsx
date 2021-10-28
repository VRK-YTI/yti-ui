import React from 'react';
import { render as rtlRender, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TerminologySearchInput } from './terminology-search-input';
import reducer, { setFilter } from './states/terminology-search-slice';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit'
import { makeStore } from '../../../store';

function render(
  ui: any,
  {
    preloadedState,
    store = configureStore({ reducer: { filter: reducer }, preloadedState }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }: any) {
    return <Provider store={makeStore()}>{children}</Provider>
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

describe('terminology-search-input', () => {
  test('should render component', () => {
    render(<TerminologySearchInput />);

    expect(screen.findByTestId('search_input')).toBeInTheDocument;
  })

  test('should set filter', () => {

    render(
      <TerminologySearchInput />
    );

    expect(screen.getByTestId('search_input')).toBeInTheDocument;

    userEvent.click(screen.getByTestId('search_input'));
    userEvent.keyboard('test');
    userEvent.keyboard('{enter}');

    expect(screen.getByTestId('search_input')).toHaveProperty('value', 'test');

  });

});


