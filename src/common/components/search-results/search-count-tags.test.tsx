import { render, screen } from '@testing-library/react';
import { NextRouter, useRouter } from 'next/router';
import { themeProvider } from '../../../tests/test-utils';
import SearchCountTags from './search-count-tags';

jest.mock('next/router');
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('search-count-tags', () => {
  test('should render component', () => {
    mockedUseRouter.mockReturnValue({ query: {} } as NextRouter);

    render(<SearchCountTags title="4 items found" />, {
      wrapper: themeProvider,
    });

    expect(screen.getByText(/4/)).toBeInTheDocument;
    expect(screen.getByText(/tr-VALID/)).toBeInTheDocument;
    expect(screen.getByText(/tr-DRAFT/)).toBeInTheDocument;
  });
});
