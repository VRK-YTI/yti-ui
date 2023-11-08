import { fireEvent, render, screen } from '@testing-library/react';
import LanguageFilter from './language-filter';
import { themeProvider } from '../../utils/test-utils';
import mockRouter from 'next-router-mock';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('language-filter', () => {
  it('should render component', () => {
    mockRouter.setCurrentUrl('/');

    render(<LanguageFilter labelText="filter-label" />, {
      wrapper: themeProvider,
    });

    expect(screen.getByText('filter-label')).toBeInTheDocument();
  });

  it('should update router query', async () => {
    mockRouter.setCurrentUrl('/');

    render(
      <LanguageFilter
        labelText="filter-label"
        languages={[
          {
            labelText: 'fi',
            uniqueItemId: 'fi',
          },
          {
            labelText: 'en',
            uniqueItemId: 'en',
          },
          {
            labelText: 'sv',
            uniqueItemId: 'sv',
          },
        ]}
      />,
      {
        wrapper: themeProvider,
      }
    );

    fireEvent.click(screen.getByPlaceholderText('tr-choose-language'));
    fireEvent.click(screen.getByText('fi'));

    expect(mockRouter.query.lang).toBe('fi');

    fireEvent.click(screen.getByRole('button'));
    expect(mockRouter.query.lang).toBeUndefined();

    fireEvent.click(screen.getByPlaceholderText('tr-choose-language'));
    fireEvent.click(screen.getByText('en'));

    expect(mockRouter.query.lang).toBe('en');
  });
});
