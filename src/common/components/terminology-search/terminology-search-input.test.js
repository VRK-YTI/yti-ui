import React from 'react';
import { render, screen } from '@testing-library/react';

import { TerminologySearchInput } from './terminology-search-input';
import useTerminologySearch from '../../../../modules/terminology-search/terminology-search-api';

jest.mock('../../../../modules/terminology-search/terminology-search-api');

describe('TerminologySearchInput', () => {
  test('should render component', () => {
    useTerminologySearch.mockResolvedValue({results: '', error: '', loading: ''});

    render(
      <TerminologySearchInput setResults={jest.fn()} />
    );

    expect(screen.findByTestId('search_input')).toBeInTheDocument;
  });

  test('should call useTerminology', () => {
    useTerminologySearch.mockResolvedValue({results: '', error: '', loading: ''});

    render(
      <TerminologySearchInput setResults={jest.fn()} />
    );

    expect(useTerminologySearch).toHaveBeenCalled();
    expect(useTerminologySearch).toHaveBeenCalledTimes(2);
  });

});
