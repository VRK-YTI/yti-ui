import { render, screen } from '@testing-library/react';
import LanguageFilter from './language-filter';
import { themeProvider } from '@app/tests/test-utils';
import mockRouter from 'next-router-mock';
import userEvent from '@testing-library/user-event';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('language-filter', () => {
  it('should render component', () => {
    mockRouter.setCurrentUrl('/');

    render(<LanguageFilter />, { wrapper: themeProvider });

    expect(screen.getByText('tr-filter-by-language')).toBeInTheDocument();
  });

  it('should update router query', async () => {
    mockRouter.setCurrentUrl('/');

    render(<LanguageFilter />, { wrapper: themeProvider });

    userEvent.click(screen.getByPlaceholderText('tr-choose-language'));
    userEvent.click(screen.getByText('tr-vocabulary-info-fi'));

    expect(mockRouter.query.lang).toBe('fi');

    userEvent.click(screen.getByRole('button'));
    expect(mockRouter.query.lang).toBeUndefined();

    userEvent.click(screen.getByPlaceholderText('tr-choose-language'));
    userEvent.click(screen.getByText('tr-vocabulary-info-en'));

    expect(mockRouter.query.lang).toBe('en');
  });
});
