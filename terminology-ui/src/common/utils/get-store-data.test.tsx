import { getTerminology } from '../components/vocabulary/vocabulary.slice';
import { getStoreData } from './get-store-data';

describe('page-head-utils', () => {
  it('should return correct object', () => {
    const gotten = getStoreData({
      state: {
        vocabularyAPI: {
          queries: {
            getTerminology: {
              data: {
                test: '123',
              },
            },
          },
        },
      },
      reduxKey: 'terminologyAPI',
      functionKey: 'getTerminology',
    });

    expect(gotten).toStrictEqual({ test: '123' });
  });

  it('should return empty object with incorrect redux key', () => {
    const gotten = getStoreData({
      state: {
        vocabularyAPI: {
          queries: {
            getTerminology: {
              data: {
                test: '123',
              },
            },
          },
        },
      },
      reduxKey: 'conceptAPI',
      functionKey: 'getTerminology',
    });

    expect(gotten).toStrictEqual({});
  });

  it('should return empty object with incorrect function', () => {
    const gotten = getStoreData({
      state: {
        vocabularyAPI: {
          queries: {
            getTerminology: {
              data: {
                test: '123',
              },
            },
          },
        },
      },
      reduxKey: 'terminologyAPI',
      functionKey: 'getConcept',
    });

    expect(gotten).toStrictEqual({});
  });
});
