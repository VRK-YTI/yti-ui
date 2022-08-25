import { render, screen } from '@testing-library/react';
import { themeProvider } from '@app/tests/test-utils';
import mockRouter from 'next-router-mock';
import { KeywordFilter } from './keyword-filter';
import userEvent from '@testing-library/user-event';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('keyword-filter', () => {
  it('should render component', () => {
    render(
      <KeywordFilter title="testTitle" visualPlaceholder="testPlaceholder" />,
      { wrapper: themeProvider }
    );

    expect(screen.getByLabelText('testTitle')).toBeInTheDocument();

    expect(screen.getByPlaceholderText('testPlaceholder')).toBeInTheDocument();
  });

  it('should render component with query set in url', () => {
    mockRouter.setCurrentUrl('/?q=testquery');

    render(
      <KeywordFilter title="testTitle" visualPlaceholder="testPlaceholder" />,
      { wrapper: themeProvider }
    );

    expect(screen.getByLabelText('testTitle')).toBeInTheDocument();

    expect(screen.getByDisplayValue('testquery')).toBeInTheDocument();
  });

  it('should update url with query', () => {
    mockRouter.setCurrentUrl('/');

    render(
      <KeywordFilter title="testTitle" visualPlaceholder="testPlaceholder" />,
      { wrapper: themeProvider }
    );

    userEvent.click(screen.getByPlaceholderText('testPlaceholder'));
    userEvent.keyboard('new value');
    userEvent.tab();

    expect(mockRouter.query.q).toBe('new value');
  });

  it('should not allow < and > characters', () => {
    mockRouter.setCurrentUrl('/');

    render(
      <KeywordFilter title="testTitle" visualPlaceholder="testPlaceholder" />,
      { wrapper: themeProvider }
    );

    const input = screen.getByLabelText('testTitle');

    userEvent.click(input);
    userEvent.keyboard('>');
    userEvent.tab();

    expect(mockRouter.query.q).toBeUndefined();

    userEvent.click(input);
    userEvent.keyboard('<');
    userEvent.tab();

    expect(mockRouter.query.q).toBeUndefined();

    userEvent.clear(input);

    userEvent.click(input);
    userEvent.keyboard('test value');
    userEvent.tab();

    expect(mockRouter.query.q).toBe('test value');

    userEvent.click(input);
    userEvent.keyboard('>');
    userEvent.tab();

    expect(mockRouter.query.q).toBe('test value');
    expect(
      screen.getByText('tr-filter-character-not-allowed')
    ).toBeInTheDocument();
  });
});
