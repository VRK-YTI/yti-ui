import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MultiLanguageFilter from './multi-language-filter';
import { themeProvider } from '../../utils/test-utils';
import mockRouter from 'next-router-mock';

jest.mock('next/router', () => require('next-router-mock'));

describe('language-filter', () => {
  it('should render component', () => {
    mockRouter.setCurrentUrl('/');

    render(<MultiLanguageFilter />, { wrapper: themeProvider });

    expect(screen.getByText('tr-filter-by-language')).toBeInTheDocument();
  });

  it('should update router query', async () => {
    mockRouter.setCurrentUrl('/');

    render(<MultiLanguageFilter />, { wrapper: themeProvider });

    // Open dropdown and select Finnish
    await userEvent.click(screen.getByPlaceholderText('tr-choose-language'));
    await waitFor(() => {
      expect(screen.getByText('tr-vocabulary-info-fi')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByText('tr-vocabulary-info-fi'));

    expect(mockRouter.query.lang).toBe('fi');

    // Open dropdown and select English
    await userEvent.click(screen.getByPlaceholderText('tr-choose-language'));
    await waitFor(() => {
      expect(screen.getByText('tr-vocabulary-info-en')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByText('tr-vocabulary-info-en'));

    // lang will have value of "fi" since only the first element
    // of string[] is given to query
    expect(mockRouter.query.lang).toBe('fi');

    // Remove Finnish by clicking the chip
    await userEvent.click(screen.getAllByText(/tr-vocabulary-info-fi/)[1]);
    expect(mockRouter.query.lang).toBe('en');
  });
});
