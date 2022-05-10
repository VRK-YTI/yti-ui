import { render, screen } from '@testing-library/react';
import Search from './search';
import { themeProvider } from '@app/tests/test-utils';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';
import { Provider } from 'react-redux';
import { makeStore } from '@app/store';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

describe('other-information', () => {
  it('should render component', async () => {
    const store = makeStore();
    const mockFn = jest.fn();

    const mockAdapter = new MockAdapter(axios);
    mockAdapter.onPost(/\/v1\/frontend\/searchConcept/).reply(200, {
      totalHitCount: 0,
      resultStart: 0,
      concepts: [],
    });

    render(
      <Provider store={store}>
        <Search setSearchResults={mockFn} terminologyId="123-456-789" />
      </Provider>,
      { wrapper: themeProvider }
    );

    expect(screen.getByText('tr-search-term')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('tr-number-of-concepts')).toBeInTheDocument();
    });
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should call update after getting new results', async () => {
    const store = makeStore();
    const mockFn = jest.fn();

    const mockAdapter = new MockAdapter(axios);
    mockAdapter.onPost(/\/v1\/frontend\/searchConcept/).reply(200, {
      totalHitCount: 3,
      resultStart: 0,
      concepts: [{}, {}, {}],
    });

    render(
      <Provider store={store}>
        <Search setSearchResults={mockFn} terminologyId="123-456-789" />
      </Provider>,
      { wrapper: themeProvider }
    );

    await waitFor(() => {
      expect(screen.getByText('tr-number-of-concepts')).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole('searchbox'));
    userEvent.keyboard('test');
    userEvent.click(screen.queryAllByText('tr-search')[1]);

    await expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockAdapter.history.post).toHaveLength(2);
  });
});
