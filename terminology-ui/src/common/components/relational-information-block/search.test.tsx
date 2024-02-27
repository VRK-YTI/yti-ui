import { fireEvent, screen } from '@testing-library/react';
import Search from './search';
import { renderWithProviders } from '@app/tests/test-utils';

describe('other-information', () => {
  it('should render component', async () => {
    const handleSearchMockFn = jest.fn();
    const handleClearMockFn = jest.fn();
    const setSearchTermMockFn = jest.fn();
    const setStatusMockFn = jest.fn();

    renderWithProviders(
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
    );

    expect(screen.getByText('tr-search-term')).toBeInTheDocument();
    expect(screen.getByText('tr-number-of-concepts')).toBeInTheDocument();
    expect(handleSearchMockFn).toHaveBeenCalledTimes(0);
  });

  it('should call search function', async () => {
    const handleSearchMockFn = jest.fn();
    const handleClearMockFn = jest.fn();
    const setSearchTermMockFn = jest.fn();
    const setStatusMockFn = jest.fn();

    renderWithProviders(
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
    );

    expect(screen.getByText('tr-number-of-concepts')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('searchbox'));
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'test' },
    });
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'test123' },
    });
    fireEvent.click(screen.queryAllByText('tr-search')[1]);

    expect(setSearchTermMockFn).toHaveBeenCalledTimes(2);
    expect(handleSearchMockFn).toHaveBeenCalledTimes(1);
  });

  it('should call clear function', async () => {
    const handleSearchMockFn = jest.fn();
    const handleClearMockFn = jest.fn();
    const setSearchTermMockFn = jest.fn();
    const setStatusMockFn = jest.fn();

    renderWithProviders(
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
    );

    fireEvent.click(screen.queryAllByText('tr-clear-search')[0]);

    expect(handleClearMockFn).toHaveBeenCalledTimes(1);
  });
});
