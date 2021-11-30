import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from './pagination';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../../layouts/theme';
import { makeStore } from '../../../store';
import { Provider } from 'react-redux';
import { setResultStart } from '../terminology-search/terminology-search-slice';

describe('pagination', () => {
  test('should render component', () => {
    const store = makeStore();

    const data = {
      'deepHits': undefined,
      'totalHitCount': 80,
      'resultStart': 0,
      'terminologies': []
    };

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <Pagination data={data} resultStart={setResultStart} />
        </ThemeProvider>
      </Provider>
    );

    for (let i = 1; i <= data.totalHitCount / 10; i++) {
      expect(screen.getByText(i)).toBeInTheDocument;
    }

  });

  test('should render empty when list is smaller than 10', () => {
    const store = makeStore();

    const data = {
      'deepHits': undefined,
      'totalHitCount': 7,
      'resultStart': 0,
      'terminologies': []
    };

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <Pagination data={data} resultStart={setResultStart} />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.queryByText(1)).toEqual(null);
    expect(screen.queryByText(7)).toEqual(null);
    expect(screen.queryByText(10)).toEqual(null);

  });

  test('should change active item', () => {
    const store = makeStore();

    const data = {
      'deepHits': undefined,
      'totalHitCount': 50,
      'resultStart': 0,
      'terminologies': []
    };

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <Pagination data={data} resultStart={setResultStart} />
        </ThemeProvider>
      </Provider>
    );

    expect(store.getState().terminologySearch.searchFilter.resultStart).toEqual(0);
    userEvent.click(screen.getByText(3));
    expect(store.getState().terminologySearch.searchFilter.resultStart).toEqual(20);
    userEvent.click(screen.getByTestId('pagination-left'));
    expect(store.getState().terminologySearch.searchFilter.resultStart).toEqual(10);
    userEvent.click(screen.getByTestId('pagination-right'));
    userEvent.click(screen.getByTestId('pagination-right'));
    expect(store.getState().terminologySearch.searchFilter.resultStart).toEqual(30);

  });

});

