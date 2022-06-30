import { getStoreData } from './utils';

describe('page-head-utils', () => {
  it('should return correct object', () => {
    const gotten = getStoreData({
      state: {
        vocabularyAPI: {
          queries: {
            getVocabulary: {
              data: {
                test: '123',
              },
            },
          },
        },
      },
      reduxKey: 'vocabularyAPI',
      functionKey: 'getVocabulary',
    });

    expect(gotten).toStrictEqual({ test: '123' });
  });

  it('should return empty object with incorrect redux key', () => {
    const gotten = getStoreData({
      state: {
        vocabularyAPI: {
          queries: {
            getVocabulary: {
              data: {
                test: '123',
              },
            },
          },
        },
      },
      reduxKey: 'conceptAPI',
      functionKey: 'getVocabulary',
    });

    expect(gotten).toStrictEqual({});
  });

  it('should return empty object with incorrect function', () => {
    const gotten = getStoreData({
      state: {
        vocabularyAPI: {
          queries: {
            getVocabulary: {
              data: {
                test: '123',
              },
            },
          },
        },
      },
      reduxKey: 'vocabularyAPI',
      functionKey: 'getConcept',
    });

    expect(gotten).toStrictEqual({});
  });
});
