/* eslint-disable @typescript-eslint/no-explicit-any */

import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import { themeProvider } from '@app/tests/test-utils';
import ResetAllFiltersButton from './reset-all-filters-button';

jest.mock('next/router');
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('reset-all-filters-button', () => {
  it('should render component', () => {
    mockedUseRouter.mockReturnValue({
      query: { q: 'lorem ipsum' },
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    render(<ResetAllFiltersButton />, { wrapper: themeProvider });

    expect(
      screen.getByText('tr-vocabulary-filter-remove-all')
    ).toBeInTheDocument();
  });
});
