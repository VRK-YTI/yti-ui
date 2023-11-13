import { fireEvent, render, screen } from '@testing-library/react';
import { themeProvider } from '../../utils/test-utils';
import mockRouter from 'next-router-mock';
import KeywordFilter from './keyword-filter';

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

    const el = screen.getByPlaceholderText('testPlaceholder');

    fireEvent.click(el);
    fireEvent.change(el, { target: { value: 'new value' } });
    fireEvent.focusOut(el);

    expect(mockRouter.query.q).toBe('new value');
  });

  it('should not allow < and > characters', () => {
    mockRouter.setCurrentUrl('/');

    render(
      <KeywordFilter title="testTitle" visualPlaceholder="testPlaceholder" />,
      { wrapper: themeProvider }
    );

    const input = screen.getByLabelText('testTitle');

    fireEvent.click(input);
    fireEvent.change(input, { target: { value: '>' } });
    fireEvent.focusOut(input);

    expect(mockRouter.query.q).toBeUndefined();

    fireEvent.click(input);
    fireEvent.change(input, { target: { value: '<' } });
    fireEvent.focusOut(input);

    expect(mockRouter.query.q).toBeUndefined();

    fireEvent.change(input, { target: { value: '' } });

    fireEvent.click(input);
    fireEvent.change(input, { target: { value: 'test value' } });
    fireEvent.focusOut(input);

    expect(mockRouter.query.q).toBe('test value');

    fireEvent.click(input);
    fireEvent.change(input, { target: { value: '>' } });
    fireEvent.focusOut(input);

    expect(mockRouter.query.q).toBe('test value');
    expect(
      screen.getByText('tr-filter-character-not-allowed')
    ).toBeInTheDocument();
  });
});
