import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from './pagination';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../../layouts/theme';
import { makeStore } from '../../../store';
import { Provider } from 'react-redux';
import { setResultStart } from '../terminology-search/terminology-search-slice';
import { useRouter } from 'next/router';

jest.mock('next/router');
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('pagination', () => {
  test('should render component', () => {
    mockedUseRouter.mockReturnValue({
      query: { page: '0' },
      push: jest.fn(),
    } as any);

    const store = makeStore();
    store.dispatch = jest.fn();
    const query = useRouter();
    const data = {
      'deepHits': null,
      'totalHitCount': 80,
      'resultStart': 0,
      'terminologies': []
    };

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <Pagination
            data={data}
            dispatch={store.dispatch}
            setResultStart={setResultStart}
            pageString={'Page'}
            query={query}
          />
        </ThemeProvider>
      </Provider>
    );

    for (let i = 1; i <= 7; i++) {
      expect(screen.getByText(i)).toBeInTheDocument;
    }

  });

  test('should render empty when list is smaller than 10', () => {
    mockedUseRouter.mockReturnValue({
      query: { page: '0' },
      push: jest.fn(),
    } as any);

    const store = makeStore();
    store.dispatch = jest.fn();
    const query = useRouter();
    const data = {
      'deepHits': null,
      'totalHitCount': 7,
      'resultStart': 0,
      'terminologies': []
    };

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <Pagination
            data={data}
            dispatch={store.dispatch}
            setResultStart={setResultStart}
            pageString={'Page'}
            query={query}
          />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.queryByText(1)).toEqual(null);
    expect(screen.queryByText(7)).toEqual(null);
    expect(screen.queryByText(10)).toEqual(null);

  });

  test('should change active item', () => {
    mockedUseRouter.mockReturnValue({
      query: { page: '0' },
      push: jest.fn(),
    } as any);

    const store = makeStore();
    const query = useRouter();
    const data = {
      'deepHits': null,
      'totalHitCount': 50,
      'resultStart': 0,
      'terminologies': []
    };

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <Pagination
            data={data}
            dispatch={store.dispatch}
            setResultStart={setResultStart}
            pageString={'Page'}
            query={query}
          />
        </ThemeProvider>
      </Provider>
    );

    expect(store.getState().terminologySearch.resultStart).toEqual(0);
    userEvent.click(screen.getByText(3));
    expect(store.getState().terminologySearch.resultStart).toEqual(20);
    userEvent.click(screen.getByTestId('pagination-left'));
    expect(store.getState().terminologySearch.resultStart).toEqual(10);
    userEvent.click(screen.getByTestId('pagination-right'));
    userEvent.click(screen.getByTestId('pagination-right'));
    expect(store.getState().terminologySearch.resultStart).toEqual(30);
  });

});

