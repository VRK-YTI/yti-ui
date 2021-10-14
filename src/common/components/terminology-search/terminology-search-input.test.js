import React from 'react';
import { render, screen } from '@testing-library/react';

import { TerminologySearchInput } from './terminology-search-input';

jest.mock('../../../../modules/terminology-search/terminology-search-api');

describe('TerminologySearchInput', () => {
  test('should render component', () => {

    render(
      <TerminologySearchInput setResults={jest.fn()} />
    );

    expect(screen.findByTestId('search_input')).toBeInTheDocument;
  });

});
