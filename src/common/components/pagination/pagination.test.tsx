import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from './pagination';
import { useRouter } from 'next/router';
import { themeProvider } from '../../../tests/test-utils';

jest.mock('next/router');
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('pagination', () => {
  test('should render component', () => {
    mockedUseRouter.mockReturnValue({
      query: { page: '0' },
      route: '',
      push: jest.fn(),
    } as any);

    const data = {
      'deepHits': null,
      'totalHitCount': 80,
      'resultStart': 0,
      'terminologies': []
    };

    render(
      <Pagination data={data} pageString="Page" />,
      { wrapper: themeProvider }
    );

    expect(screen.getByText(1)).toBeInTheDocument;
    expect(screen.getByText(2)).toBeInTheDocument;
    expect(screen.getByText(3)).toBeInTheDocument;
    expect(screen.getByText(4)).toBeInTheDocument;
    expect(screen.getByText(5)).toBeInTheDocument;
    expect(screen.getByText(6)).toBeInTheDocument;
    expect(screen.getByText(7)).toBeInTheDocument;
  });

  test('should render empty when list is smaller than 10', () => {
    mockedUseRouter.mockReturnValue({
      query: {},
      route: '',
      push: jest.fn()
    } as any);

    const data = {
      'deepHits': null,
      'totalHitCount': 7,
      'resultStart': 0,
      'terminologies': []
    };

    render(
      <Pagination data={data} pageString="Page" />
    );

    expect(screen.queryByText(1)).toEqual(null);
    expect(screen.queryByText(7)).toEqual(null);
    expect(screen.queryByText(10)).toEqual(null);
  });

  test('should change active item', async () => {
    const push = jest.fn();
    mockedUseRouter.mockReturnValue({
      query: { page: 3 },
      route: '',
      push
    } as any);

    const data = {
      'deepHits': null,
      'totalHitCount': 50,
      'resultStart': 0,
      'terminologies': []
    };

    render(
      <Pagination data={data} pageString="Page" />,
      { wrapper: themeProvider }
    );

    expect(push).not.toBeCalled();

    userEvent.click(screen.getByText(5));
    expect(push.mock.calls[0][0]).toEqual({ query: { page: 5 } });

    userEvent.click(screen.getByTestId('pagination-left'));
    expect(push.mock.calls[1][0]).toEqual({ query: { page: 2 } });

    userEvent.click(screen.getByTestId('pagination-right'));
    expect(push.mock.calls[2][0]).toEqual({ query: { page: 4 } });
  });

});

