import {
  Collection,
  getCollectionMock,
} from '../interfaces/collection.interface';
import filterCollectionData from './filter-collection-data';
import { initialUrlState } from './hooks/use-url-state';

describe('filter-collection-data', () => {
  let data: Collection[];

  beforeAll(() => {
    data = [
      getCollectionMock('Collection-01', [
        {
          lang: 'fi',
          regex: '',
          value: 'member-01',
        },
        {
          lang: 'fi',
          regex: '',
          value: 'member-02',
        },
      ]),
      getCollectionMock('Collection-02', [
        {
          lang: 'fi',
          regex: '',
          value: 'member-03',
        },
        {
          lang: 'fi',
          regex: '',
          value: 'member-04',
        },
      ]),
      getCollectionMock('Collection-03', [
        {
          lang: 'fi',
          regex: '',
          value: 'member-05',
        },
        {
          lang: 'fi',
          regex: '',
          value: 'member-01',
        },
      ]),
    ];
  });

  it('should return data unaltered with initial urlState', () => {
    const returned = filterCollectionData(data, initialUrlState, 'fi');

    expect(returned).toStrictEqual(data);
  });

  it('should return collections with labels that match with q value', () => {
    const returned = filterCollectionData(
      data,
      { ...initialUrlState, q: 'Collection-02' },
      'fi'
    );

    expect(returned).toStrictEqual([
      getCollectionMock('Collection-02', [
        {
          lang: 'fi',
          regex: '',
          value: 'member-03',
        },
        {
          lang: 'fi',
          regex: '',
          value: 'member-04',
        },
      ]),
    ]);
  });

  it('should return collections with labels or member labels that match with q value', () => {
    const returned = filterCollectionData(
      data,
      { ...initialUrlState, q: '01' },
      'fi'
    );

    expect(returned).toStrictEqual([
      getCollectionMock('Collection-01', [
        {
          lang: 'fi',
          regex: '',
          value: 'member-01',
        },
        {
          lang: 'fi',
          regex: '',
          value: 'member-02',
        },
      ]),
      getCollectionMock('Collection-03', [
        {
          lang: 'fi',
          regex: '',
          value: 'member-05',
        },
        {
          lang: 'fi',
          regex: '',
          value: 'member-01',
        },
      ]),
    ]);
  });

  it('should return empty array if no matches found', () => {
    const returned = filterCollectionData(
      data,
      { ...initialUrlState, q: 'this should not match with anything' },
      'fi'
    );

    expect(returned).toStrictEqual([]);
  });
});
