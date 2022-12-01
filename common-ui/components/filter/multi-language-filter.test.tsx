import { render, screen } from '@testing-library/react';
import MultiLanguageFilter from './multi-language-filter';
import { themeProvider } from '../../utils/test-utils';
import mockRouter from 'next-router-mock';
import userEvent from '@testing-library/user-event';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('language-filter', () => {
  it('should render component', () => {
    mockRouter.setCurrentUrl('/');

    render(<MultiLanguageFilter />, { wrapper: themeProvider });

    expect(screen.getByText('tr-filter-by-language')).toBeInTheDocument();
  });

  it('should update router query', async () => {
    mockRouter.setCurrentUrl('/');

    render(<MultiLanguageFilter />, { wrapper: themeProvider });

    userEvent.click(screen.getByPlaceholderText('tr-choose-language'));
    userEvent.click(screen.getByText('tr-vocabulary-info-fi'));

    expect(mockRouter.query.lang).toBe('fi');

    userEvent.click(screen.getByPlaceholderText('tr-choose-language'));
    userEvent.click(screen.getByText('tr-vocabulary-info-en'));

    // lang will have value of "fi" since only the first element
    // of string[] is given to query
    expect(mockRouter.query.lang).toBe('fi');

    userEvent.click(screen.getAllByText(/tr-vocabulary-info-fi/)[1]);
    expect(mockRouter.query.lang).toBe('en');
  });
});
