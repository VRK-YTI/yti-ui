import { setFilter } from './terminology-search-slice';
import { makeStore } from '../../../store';

describe('Terminology-search-slice', () => {

  test('setFilter sets filter with a given value', () => {
    const store = makeStore();
    const originalState = store.getState().terminologySearch.filter;

    store.dispatch(setFilter('test'));

    expect(store.getState().terminologySearch.filter).not.toEqual(originalState);
    expect(store.getState().terminologySearch.filter).toEqual('test');

  });
});
