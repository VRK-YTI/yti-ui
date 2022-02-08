import { initializeVocabularyFilter, resetVocabularyFilter, setCurrentTerminology, setVocabularyFilter } from './vocabulary-slice';
import { makeStore } from '../../../store';

describe('Vocabulary-slice', () => {
  test('setVocabualryFilter sets filter with a given value', () => {
    const store = makeStore();
    const originalState = store.getState().vocabularySearch;

    const newState = {
      filter: {
        status: {
          'VALID': true,
          'DRAFT': false,
          'RETIRED': false,
          'SUPERSEDED': true
        },
        keyword: 'demo',
        showBy: 'collections'
      },
      currTerminology: {
        id: '',
        value: ''
      },
      resultStart: 0,
    };

    store.dispatch(setVocabularyFilter(newState.filter));

    expect(store.getState().vocabularySearch).not.toEqual(originalState);
    expect(store.getState().vocabularySearch).toEqual(newState);

  });

  test('setCurrentTerminology sets terminology with a given value', () => {
    const store = makeStore();
    const originalState = store.getState().vocabularySearch.currTerminology;

    const newState = {
      id: '123123-123123-123',
      value: 'Demo'
    };

    store.dispatch(setCurrentTerminology(newState));

    expect(store.getState().vocabularySearch.currTerminology).not.toEqual(originalState);
    expect(store.getState().vocabularySearch.currTerminology).toEqual(newState);

  });

  test('resetVocabularyFilter sets terminology with a given value', () => {
    const store = makeStore();
    const originalState = store.getState().vocabularySearch;

    const newState = {
      filter: {
        status: {
          'VALID': true,
          'DRAFT': false,
          'RETIRED': false,
          'SUPERSEDED': true
        },
        keyword: 'demo',
        showBy: 'collections'
      },
      currTerminology: {
        id: '123123-123123-123',
        value: 'Demo'
      },
      resultStart: 0,
    };

    store.dispatch(setVocabularyFilter(newState.filter));
    store.dispatch(setCurrentTerminology(newState.currTerminology));

    expect(store.getState().vocabularySearch).not.toEqual(originalState);
    expect(store.getState().vocabularySearch).toEqual(newState);

    store.dispatch(resetVocabularyFilter());

    expect(store.getState().vocabularySearch).not.toEqual(newState);
    expect(store.getState().vocabularySearch.filter).toEqual(originalState.filter);
    expect(store.getState().vocabularySearch.currTerminology).not.toEqual(originalState.currTerminology);

  });

  test('initializeVocabularyFilter resets value in state ', () => {
    const store = makeStore();
    const originalState = store.getState().vocabularySearch;

    const newState = {
      filter: {
        status: {
          'VALID': true,
          'DRAFT': false,
          'RETIRED': false,
          'SUPERSEDED': true
        },
        keyword: 'demo',
        showBy: 'collections'
      },
      currTerminology: {
        id: '',
        value: ''
      },
      resultStart: 0,
    };

    store.dispatch(setVocabularyFilter(newState.filter));

    expect(store.getState().vocabularySearch).not.toEqual(originalState);
    expect(store.getState().vocabularySearch).toEqual(newState);

    store.dispatch(initializeVocabularyFilter());

    expect(store.getState().vocabularySearch).not.toEqual(newState);
    expect(store.getState().vocabularySearch).toEqual(originalState);

  });
});
