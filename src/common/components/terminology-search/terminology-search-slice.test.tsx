import { setFilter } from './terminology-search-slice';
import { makeStore } from '../../../store';

describe('Terminology-search-slice', () => {

  test('setFilter sets filter with a given value', () => {
    const store = makeStore();
    const originalState = store.getState();

    store.dispatch(setFilter('test'));

    expect(store.getState()).not.toEqual(originalState);
    expect(store.getState().terminologySearch.filter).toEqual('test');

  });
});
