import { render, screen } from '@testing-library/react';
import { themeProvider } from '../../utils/test-utils';
import ResetAllFiltersButton from './reset-all-filters-button';
import mockRouter from 'next-router-mock';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('reset-all-filters-button', () => {
  it('should render component', () => {
    mockRouter.setCurrentUrl('/?q=lorem ipsum');

    render(<ResetAllFiltersButton />, { wrapper: themeProvider });

    expect(screen.getByText('tr-filter-remove-all')).toBeInTheDocument();
  });

  it('should not render component when in initial state', () => {
    mockRouter.setCurrentUrl('/');

    render(<ResetAllFiltersButton />, { wrapper: themeProvider });

    expect(screen.queryByText('tr-filter-remove-all')).not.toBeInTheDocument();
  });
});
