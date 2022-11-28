import { render, screen } from '@testing-library/react';
import { themeProvider } from '../../utils/test-utils';
import SearchCountTags from './search-count-tags';
import mockRouter from 'next-router-mock';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('search-count-tags', () => {
  it('should render component', () => {
    mockRouter.setCurrentUrl('/');

    render(<SearchCountTags title="4 items found" />, {
      wrapper: themeProvider,
    });

    expect(screen.getByText(/4/)).toBeInTheDocument();
  });
});
