import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'

import { TerminologySearchInput } from './terminology-search-input';

jest.mock('../../../modules/terminology-search/hooks/terminology-search-api');

describe('TerminologySearchInput', () => {
  test('should render component', () => {

    render(
      <TerminologySearchInput setFilter={jest.fn()} />
    );

    expect(screen.findByTestId('search_input')).toBeInTheDocument;
  });

  test('should set filter', () => {

    const setFilter = jest.fn();

    render(
      <TerminologySearchInput setFilter={setFilter} />
    );

    userEvent.click(screen.getByTestId('search_input'));
    userEvent.keyboard('test');

    expect(screen.getByTestId('search_input')).toBeInTheDocument;
    expect(screen.getByTestId('search_input')).toHaveProperty('value', 'test')

    userEvent.keyboard('{enter}');

  })

});
