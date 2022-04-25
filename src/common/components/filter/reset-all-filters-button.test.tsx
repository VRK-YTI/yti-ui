import { render, screen } from '@testing-library/react';
import { themeProvider } from '@app/tests/test-utils';
import ResetAllFiltersButton from './reset-all-filters-button';
import mockRouter from 'next-router-mock';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('reset-all-filters-button', () => {
  it('should render component', () => {
    mockRouter.setCurrentUrl('/?q=lorem ipsum');

    render(<ResetAllFiltersButton />, { wrapper: themeProvider });

    expect(
      screen.getByText('tr-vocabulary-filter-remove-all')
    ).toBeInTheDocument();
  });

  it('should not render component when in initial state', () => {
    mockRouter.setCurrentUrl('/?status=draft&status=valid');

    render(<ResetAllFiltersButton />, { wrapper: themeProvider });

    expect(
      screen.queryByText('tr-vocabulary-filter-remove-all')
    ).not.toBeInTheDocument();
  });
});
