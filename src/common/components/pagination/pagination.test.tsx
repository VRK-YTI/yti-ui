import '@app/tests/matchMedia.mock';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from './pagination';
import { themeProvider } from '@app/tests/test-utils';
import mockRouter from 'next-router-mock';
import singletonRouter from 'next/router';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('pagination', () => {
  it('should render component', () => {
    mockRouter.setCurrentUrl('/?page=0');

    const data = {
      deepHits: null,
      totalHitCount: 80,
      resultStart: 0,
      terminologies: [],
    };

    render(<Pagination data={data} pageString="Page" />, {
      wrapper: themeProvider,
    });

    expect(screen.getByText(1)).toBeInTheDocument();
    expect(screen.getByText(2)).toBeInTheDocument();
    expect(screen.getByText(3)).toBeInTheDocument();
    expect(screen.getByText(4)).toBeInTheDocument();
    expect(screen.getByText(5)).toBeInTheDocument();
    expect(screen.getByText(6)).toBeInTheDocument();
    expect(screen.getByText(7)).toBeInTheDocument();
  });

  it('should render empty when list is smaller than 10', () => {
    mockRouter.setCurrentUrl('/');

    const data = {
      deepHits: null,
      totalHitCount: 7,
      resultStart: 0,
      terminologies: [],
    };

    render(<Pagination data={data} pageString="Page" />);

    expect(screen.queryByText(1)).not.toBeInTheDocument();
    expect(screen.queryByText(7)).not.toBeInTheDocument();
    expect(screen.queryByText(10)).not.toBeInTheDocument();
  });

  it('should change active item', async () => {
    mockRouter.setCurrentUrl('/?page=3');

    const data = {
      deepHits: null,
      totalHitCount: 50,
      resultStart: 0,
      terminologies: [],
    };

    render(<Pagination data={data} pageString="Page" />, {
      wrapper: themeProvider,
    });

    expect(singletonRouter).toMatchObject({
      query: { page: '3' },
    });

    userEvent.click(screen.getByText(5));
    expect(singletonRouter).toMatchObject({
      query: { page: 5 },
    });

    userEvent.click(screen.getByTestId('pagination-left'));
    expect(singletonRouter).toMatchObject({
      query: { page: 4 },
    });

    userEvent.click(screen.getByTestId('pagination-right'));
    expect(singletonRouter).toMatchObject({
      query: { page: 5 },
    });
  });
});
