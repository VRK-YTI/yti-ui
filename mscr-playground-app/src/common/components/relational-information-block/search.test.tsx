import { render, screen } from '@testing-library/react';
import Search from './search';
import { getMockContext, themeProvider } from '@app/tests/test-utils';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { makeStore } from '@app/store';

describe('other-information', () => {
  it('should render component', async () => {
    const store = makeStore(getMockContext());
    const handleSearchMockFn = jest.fn();
    const handleClearMockFn = jest.fn();
    const setSearchTermMockFn = jest.fn();
    const setStatusMockFn = jest.fn();

    render(
      <Provider store={store}>
        <Search
          handleSearch={handleSearchMockFn}
          handleClearValues={handleClearMockFn}
          setSearchTerm={setSearchTermMockFn}
          searchTerm={''}
          setStatus={setStatusMockFn}
          status={null}
          statuses={[]}
          totalHitCount={10}
        />
      </Provider>,
      { wrapper: themeProvider }
    );

    expect(screen.getByText('tr-search-term')).toBeInTheDocument();
    expect(screen.getByText('tr-number-of-concepts')).toBeInTheDocument();
    expect(handleSearchMockFn).toHaveBeenCalledTimes(0);
  });

  it('should call search function', async () => {
    const store = makeStore(getMockContext());
    const handleSearchMockFn = jest.fn();
    const handleClearMockFn = jest.fn();
    const setSearchTermMockFn = jest.fn();
    const setStatusMockFn = jest.fn();

    render(
      <Provider store={store}>
        <Search
          handleSearch={handleSearchMockFn}
          handleClearValues={handleClearMockFn}
          setSearchTerm={setSearchTermMockFn}
          searchTerm={''}
          setStatus={setStatusMockFn}
          status={null}
          statuses={[]}
          totalHitCount={10}
        />
      </Provider>,
      { wrapper: themeProvider }
    );

    expect(screen.getByText('tr-number-of-concepts')).toBeInTheDocument();
    userEvent.click(screen.getByRole('searchbox'));
    userEvent.keyboard('test');
    userEvent.click(screen.queryAllByText('tr-search')[1]);

    expect(setSearchTermMockFn).toHaveBeenCalledTimes(4);
    expect(handleSearchMockFn).toHaveBeenCalledTimes(1);
  });

  it('should call clear function', async () => {
    const store = makeStore(getMockContext());
    const handleSearchMockFn = jest.fn();
    const handleClearMockFn = jest.fn();
    const setSearchTermMockFn = jest.fn();
    const setStatusmockFn = jest.fn();

    render(
      <Provider store={store}>
        <Search
          handleSearch={handleSearchMockFn}
          handleClearValues={handleClearMockFn}
          setSearchTerm={setSearchTermMockFn}
          searchTerm={''}
          setStatus={setStatusmockFn}
          status={null}
          statuses={[]}
          totalHitCount={10}
        />
      </Provider>,
      { wrapper: themeProvider }
    );

    userEvent.click(screen.queryAllByText('tr-clear-search')[0]);

    expect(handleClearMockFn).toHaveBeenCalledTimes(1);
  });
});
